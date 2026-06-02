'use client';

import { useState, useEffect } from 'react';
import { WorldMap } from '@/components/world-map';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { continents, type Continent } from '@/lib/continents';
import {
	standardContinents,
	ultimateContinent,
} from '@/lib/playable-continents';
import {
	getContinentAccess,
	getLockMessage,
} from '@/lib/entitlements';
import { useAuth, useEntitlementState } from '@/contexts/auth-context';
import { normalizeString } from '@/lib/game-logic';
import {
	Timer,
	Check,
	Pause,
	Play,
	ShieldQuestion,
	ChevronDown,
	ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { PlayShell } from '@/components/play/play-shell';
import { PlayNav } from '@/components/play/play-nav';
import { GameLoading } from '@/components/play/game-loading';
import { Badge } from './ui/badge';
import { checkPauseAbility, getCountriesByRegion } from '@/app/actions';
import { GameEndDialog } from './game-end-dialog';
import { ContinentSelector } from './continent-selector';
import { Country } from '@/lib/types';
import { saveScore } from '@/lib/scores';
import { saveToLeaderboard } from '@/lib/leaderboard';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from './ui/collapsible';

type GameState = 'menu' | 'loading' | 'playing' | 'paused' | 'finished';

interface GameControllerProps {
	initialContinentId?: string;
}

const GameController = ({ initialContinentId }: GameControllerProps) => {
	const [gameState, setGameState] = useState<GameState>('menu');
	const [currentContinent, setCurrentContinent] = useState<Continent | null>(
		null,
	);
	const [targetCountries, setTargetCountries] = useState<Country[]>([]);
	const [timeLeft, setTimeLeft] = useState(0);
	const [isChallengeMode] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [showCountriesList, setShowCountriesList] = useState(false);
	const { toast } = useToast();
	const router = useRouter();
	const entitlementState = useEntitlementState();

	const startGame = async (continent: Continent) => {
		const access = getContinentAccess(continent, entitlementState);
		if (!access.canPlay) {
			toast({
				title:
					access.lockReason === 'auth'
						? 'Sign in required'
						: 'Support to unlock',
				description: getLockMessage(access.lockReason),
				variant: 'destructive',
			});
			return;
		}

		setGameState('loading');
		setCurrentContinent(continent);
		setInputValue('');

		try {
			const gameCountries = await getCountriesByRegion(continent.id);
			setTargetCountries(gameCountries);
			setTimeLeft(continent.time);
			setGameState('playing');
		} catch (error) {
			toast({
				title: 'Error',
				description:
					'Could not load countries. Please try again later.',
				variant: 'destructive',
			});
			setGameState('menu');
		}
	};

	const handleGuess = (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputValue.trim()) return;

		const normalizedGuess = normalizeString(inputValue);

		const isAlreadyGuessed = targetCountries.some(
			(c) =>
				c.guessed && normalizeString(c.name.common) === normalizedGuess,
		);

		if (isAlreadyGuessed) {
			toast({
				title: 'Already Guessed!',
				description: "You've already found that country.",
				variant: 'default',
			});
			setInputValue('');
			return;
		}

		const targetIndex = targetCountries.findIndex(
			(c) =>
				!c.guessed &&
				(normalizeString(c.name.common) === normalizedGuess ||
					Object.values(c.translations).some(
						(t) => normalizeString(t.common) === normalizedGuess,
					) ||
					(c.demonyms &&
						Object.values(c.demonyms).some(
							(d) =>
								normalizeString(d.m) === normalizedGuess ||
								normalizeString(d.f) === normalizedGuess,
						))),
		);

		if (targetIndex !== -1) {
			const countryName = targetCountries[targetIndex].name.common;
			const newTargetCountries = targetCountries.map((country, index) =>
				index === targetIndex ? { ...country, guessed: true } : country,
			);
			setTargetCountries(newTargetCountries);
			toast({
				title: 'Correct!',
				description: `You've guessed ${countryName}.`,
				variant: 'default',
			});
		} else {
			toast({
				title: 'Incorrect',
				description:
					"That's not a recognized country in this continent. Try again!",
				variant: 'destructive',
			});
		}
		setInputValue('');
	};

	const handlePause = async () => {
		if (gameState === 'paused') {
			setGameState('playing');
			return;
		}
		if (gameState !== 'playing') return;

		const { pauseTimer } = await checkPauseAbility(isChallengeMode);
		if (pauseTimer) {
			setGameState('paused');
		} else {
			toast({
				title: 'Pause Disabled',
				description: 'Pausing is not allowed during challenges.',
			});
		}
	};

	const resetGame = () => {
		setGameState('menu');
		setCurrentContinent(null);
		setTargetCountries([]);
	};

	const handleSubmitToLeaderboard = async (playerName: string) => {
		if (!currentContinent) return;

		try {
			const result = await saveToLeaderboard({
				playerName,
				continentId: currentContinent.id,
				continentName: currentContinent.name,
				score: guessedCount,
				total,
				timeTaken: currentContinent.time - timeLeft,
			});

			if (!result.success) {
				throw new Error(result.error ?? 'Failed to submit score');
			}

			toast({
				title: 'Success!',
				description:
					'Your score has been added to the global leaderboard.',
				variant: 'default',
			});
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: 'Failed to submit score to leaderboard. Please try again.';
			toast({
				title: 'Error',
				description: message,
				variant: 'destructive',
			});
			throw error;
		}
	};

	const guessedCount = targetCountries.filter((c) => c.guessed).length;
	const total = targetCountries.length;
	const savedOnceRef = useRef(false);

	useEffect(() => {
		if (gameState === 'playing' && timeLeft > 0) {
			const timer = setInterval(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
			return () => clearInterval(timer);
		} else if (gameState === 'playing' && timeLeft === 0 && total > 0) {
			setGameState('finished');
		}
	}, [gameState, timeLeft, total]);

	useEffect(() => {
		if (gameState === 'playing' && total > 0 && guessedCount === total) {
			setGameState('finished');
		}
	}, [guessedCount, total, gameState]);

	// Persist a score once when the game finishes
	useEffect(() => {
		if (gameState !== 'finished') return;
		if (!currentContinent) return;
		if (savedOnceRef.current) return;
		savedOnceRef.current = true;
		saveScore({
			continentId: currentContinent.id,
			continentName: currentContinent.name,
			score: guessedCount,
			total,
			timeTaken: currentContinent.time - timeLeft,
		});
	}, [gameState, currentContinent, guessedCount, total, timeLeft]);

	// Auto-start if an initial continent is provided via query param
	useEffect(() => {
		if (!initialContinentId) return;
		// Don’t auto-start if already started
		if (gameState !== 'menu') return;
		const found = continents.find((c) => c.id === initialContinentId);
		if (found) {
			startGame(found);
		}
	}, [initialContinentId, gameState, entitlementState]);

	if (gameState === 'menu') {
		return (
			<ContinentSelector
				continents={standardContinents}
				ultimate={ultimateContinent}
				onSelect={startGame}
			/>
		);
	}

	if (gameState === 'loading') {
		return (
			<GameLoading
				regionName={currentContinent?.name}
				onBack={() => setGameState('menu')}
			/>
		);
	}

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
	};

	const progressPct = total > 0 ? Math.round((guessedCount / total) * 100) : 0;
	const isPaused = gameState === 'paused';
	const isUrgent = timeLeft > 0 && timeLeft < 30 && gameState === 'playing';

	return (
		<PlayShell variant="game">
			{currentContinent && (
				<GameEndDialog
					isOpen={gameState === 'finished'}
					score={guessedCount}
					total={total}
					timeTaken={currentContinent.time - timeLeft}
					continentName={currentContinent.name}
					continentId={currentContinent.id}
					missedCountries={targetCountries
						.filter((c) => !c.guessed)
						.map((c) => c.name.common)}
					onRestart={() => startGame(currentContinent)}
					onMenu={resetGame}
					onSubmitToLeaderboard={handleSubmitToLeaderboard}
				/>
			)}

			<PlayNav
				backLabel="Lobby"
				onBack={() => {
					resetGame();
					router.push('/play');
				}}
			/>

			<div className="w-full max-w-7xl mx-auto flex flex-col gap-3 sm:gap-4 px-3 sm:px-4 pb-6">
				{/* Mission HUD */}
				<div className="landing-glass-strong rounded-2xl p-3 sm:p-4 space-y-3 flex-shrink-0">
					<div className="flex flex-wrap items-center justify-between gap-2">
						<div className="min-w-0">
							<p className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground font-semibold">
								Active mission
							</p>
							<h2 className="font-headline font-bold text-lg sm:text-xl truncate">
								{currentContinent?.name}
							</h2>
						</div>
						<div className="flex items-center gap-2">
							{isPaused && (
								<Badge variant="secondary" className="animate-pulse">
									Paused
								</Badge>
							)}
							{isUrgent && (
								<Badge variant="destructive" className="animate-pulse">
									Hurry!
								</Badge>
							)}
						</div>
					</div>
					<div className="space-y-1.5">
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>Progress</span>
							<span className="font-mono text-primary font-semibold">
								{guessedCount}/{total} ({progressPct}%)
							</span>
						</div>
						<Progress value={progressPct} className="h-2" />
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-2 gap-3 flex-shrink-0">
					<div
						className={`landing-glass rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center border ${
							isUrgent
								? 'border-destructive/50 shadow-lg shadow-destructive/10'
								: 'border-accent/20'
						}`}
					>
						<Timer
							className={`w-5 h-5 mb-1 ${isUrgent ? 'text-destructive' : 'text-accent'}`}
						/>
						<span
							className={`text-2xl sm:text-4xl font-bold font-mono tracking-tight ${
								isUrgent
									? 'text-destructive animate-pulse'
									: 'text-accent'
							}`}
						>
							{formatTime(timeLeft)}
						</span>
						<span className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wide">
							Time left
						</span>
					</div>
					<div className="landing-glass rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center border border-primary/25">
						<Check className="w-5 h-5 mb-1 text-primary" />
						<span className="text-2xl sm:text-4xl font-bold font-mono tracking-tight text-primary">
							{guessedCount}
							<span className="text-lg text-muted-foreground">/{total}</span>
						</span>
						<span className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wide">
							Countries found
						</span>
					</div>
				</div>

				<div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
					{/* Map panel */}
					<div className="flex flex-col gap-2 min-h-0 relative">
						<div className="landing-glass-strong rounded-2xl p-2 sm:p-3 flex-1 min-h-[36vh] max-h-[42vh] sm:min-h-[380px] sm:max-h-none lg:min-h-[420px] relative overflow-hidden">
							<WorldMap
								countries={targetCountries}
								region={currentContinent?.id}
							/>
							{isPaused && (
								<div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
									<div className="landing-glass-strong rounded-2xl px-8 py-6 text-center">
										<Pause className="h-10 w-10 text-secondary mx-auto mb-2" />
										<p className="font-headline font-bold text-lg">Paused</p>
										<p className="text-sm text-muted-foreground mt-1">
											Tap Resume to continue
										</p>
									</div>
								</div>
							)}
						</div>
						<div className="flex items-center justify-center gap-4 text-xs text-muted-foreground landing-glass rounded-full py-1.5 px-4 mx-auto w-fit">
							<span className="inline-flex items-center gap-1.5">
								<span className="h-2 w-2 rounded-full bg-[hsl(var(--geo-green))]" />
								Guessed
							</span>
							<span className="inline-flex items-center gap-1.5">
								<span className="h-2 w-2 rounded-full bg-[hsl(var(--geo-blue))]" />
								Remaining
							</span>
						</div>
					</div>

					{/* Controls */}
					<div className="flex flex-col gap-3 min-h-0">
						<Card className="flex-shrink-0 landing-glass border-white/10 overflow-hidden">
							<CardHeader className="py-3 px-4 border-b border-white/5 bg-gradient-to-r from-secondary/10 to-primary/5">
								<CardTitle className="flex items-center gap-2 text-base sm:text-lg font-headline">
									<ShieldQuestion className="w-5 h-5 text-secondary shrink-0" />
									Enter country name
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-4 pb-4 px-4">
								<form
									onSubmit={handleGuess}
									className="flex flex-col gap-3"
								>
									<Input
										type="text"
										placeholder="e.g. Poland, Germany…"
										value={inputValue}
										onChange={(e) =>
											setInputValue(e.target.value)
										}
										disabled={gameState !== 'playing'}
										className={`text-base sm:text-lg h-12 sm:h-14 landing-glass border-2 rounded-xl transition-all ${
											gameState === 'playing'
												? 'border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/25'
												: 'opacity-60'
										}`}
										aria-label="Country guess input"
										autoFocus
									/>
									<div className="grid grid-cols-2 gap-3">
										<Button
											type="button"
											onClick={handlePause}
											variant="secondary"
											size="lg"
											className="h-11 sm:h-12 landing-glass border-secondary/30"
											disabled={
												gameState !== 'playing' &&
												gameState !== 'paused'
											}
										>
											{gameState === 'paused' ? (
												<Play className="mr-2 h-4 w-4" />
											) : (
												<Pause className="mr-2 h-4 w-4" />
											)}
											{gameState === 'paused' ? 'Resume' : 'Pause'}
										</Button>
										<Button
											type="submit"
											size="lg"
											className="h-11 sm:h-12 bg-gradient-to-r from-primary to-primary/85 hover:shadow-lg hover:shadow-primary/20 transition-all"
											disabled={gameState !== 'playing'}
										>
											<Check className="mr-2 h-4 w-4" />
											Submit
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>

						<Collapsible
							open={showCountriesList}
							onOpenChange={setShowCountriesList}
							className="flex-1 min-h-0 flex flex-col"
						>
							<CollapsibleTrigger asChild>
								<Button
									variant="outline"
									className="w-full flex items-center justify-between landing-glass border-white/10 h-11"
								>
									<span className="flex items-center gap-2 text-sm font-medium">
										Intel — {guessedCount}/{total} revealed
									</span>
									{showCountriesList ? (
										<ChevronUp className="h-4 w-4" />
									) : (
										<ChevronDown className="h-4 w-4" />
									)}
								</Button>
							</CollapsibleTrigger>
							<CollapsibleContent className="flex-1 min-h-0 mt-2">
								<Card className="h-full flex flex-col landing-glass border-white/10 max-h-[280px] sm:max-h-[320px]">
									<CardContent className="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto">
										<div className="grid grid-cols-2 gap-2">
											{targetCountries
												.sort((a, b) =>
													a.name.common.localeCompare(
														b.name.common,
													),
												)
												.map((country) => (
													<div
														key={country.cca2}
														className={`px-2.5 py-2 rounded-lg text-xs sm:text-sm transition-all duration-300 border ${
															country.guessed
																? 'bg-[hsl(var(--geo-green))] text-white font-semibold border-[hsl(var(--geo-green))]/50 shadow-sm'
																: 'landing-glass text-muted-foreground border-white/5'
														}`}
													>
														{country.guessed ? (
															<span className="inline-flex items-center gap-1">
																<Check className="h-3 w-3 shrink-0" />
																<span className="truncate">
																	{
																		country.name
																			.common
																	}
																</span>
															</span>
														) : (
															<span className="font-mono opacity-50">
																???
															</span>
														)}
													</div>
												))}
										</div>
									</CardContent>
								</Card>
							</CollapsibleContent>
						</Collapsible>
					</div>
				</div>
			</div>
		</PlayShell>
	);
};

export default GameController;
