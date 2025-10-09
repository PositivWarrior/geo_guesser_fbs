'use client';

import { useState, useEffect } from 'react';
import { WorldMap } from '@/components/world-map';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { continents, type Continent } from '@/lib/continents';
import { normalizeString } from '@/lib/game-logic';
import {
	Timer,
	Check,
	Pause,
	Play,
	ShieldQuestion,
	ArrowLeft,
	Loader2,
	ChevronDown,
	ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { checkPauseAbility, getCountriesByRegion } from '@/app/actions';
import { GameEndDialog } from './game-end-dialog';
import { ContinentSelector } from './continent-selector';
import { Compass } from './icons';
import { Country } from '@/lib/types';
import { saveScore } from '@/lib/scores';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from './ui/skeleton';
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

	const unlockedContinents = [
		'Europe',
		'Asia & Oceania',
		'The Americas',
		'Africa',
		'Whole World',
	];

	const startGame = async (continent: Continent) => {
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
    }, [initialContinentId, gameState]);

	if (gameState === 'menu') {
		return (
			<ContinentSelector
				continents={continents}
				unlockedContinents={unlockedContinents}
				onSelect={startGame}
			/>
		);
	}

	if (gameState === 'loading') {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen w-full">
				<Card className="w-full max-w-2xl text-center">
					<CardHeader>
						<CardTitle className="text-3xl">
							Loading your adventure...
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col items-center gap-4">
						<Loader2 className="w-16 h-16 animate-spin text-primary" />
						<p className="text-muted-foreground">
							Fetching countries and preparing the map.
						</p>
						<Skeleton className="h-96 w-full" />
					</CardContent>
				</Card>
			</div>
		);
	}

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
	};

	return (
		<div className="w-full h-screen max-w-7xl mx-auto flex flex-col gap-4 p-4 overflow-hidden">
			{currentContinent && (
				<GameEndDialog
					isOpen={gameState === 'finished'}
					score={guessedCount}
					total={total}
					timeTaken={currentContinent.time - timeLeft}
					continentName={currentContinent.name}
					missedCountries={targetCountries
						.filter((c) => !c.guessed)
						.map((c) => c.name.common)}
					onRestart={() => startGame(currentContinent)}
					onMenu={resetGame}
				/>
			)}
            <header className="flex justify-between items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-primary/10 via-background/40 to-accent/10 border border-border/50 shadow-sm flex-shrink-0">
                <div className="flex items-center gap-3">
                    <Compass className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl sm:text-3xl font-headline font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        GeoGuesser
                    </h1>
                </div>
                <Button
                    onClick={() => { resetGame(); router.push('/play'); }}
                    variant="outline"
                    size="sm"
                    className="bg-card/80 border-border/60 shadow-sm"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            </header>
			<div className="grid grid-cols-2 gap-3 flex-shrink-0">
				<div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border-2 border-accent/30 shadow-md">
					<Timer className="w-6 h-6 mb-1 text-accent" />
					<span
						className={`text-3xl font-bold font-mono tracking-tight ${
							timeLeft < 30
								? 'text-destructive animate-pulse'
								: 'text-accent'
						}`}
					>
						{formatTime(timeLeft)}
					</span>
					<span className="text-xs text-muted-foreground font-semibold">
						Time Left
					</span>
				</div>
				<div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30 shadow-md">
					<Check className="w-6 h-6 mb-1 text-primary" />
					<span className="text-3xl font-bold font-mono tracking-tight text-primary">
						{guessedCount}/{total}
					</span>
					<span className="text-xs text-muted-foreground font-semibold">
						Found
					</span>
				</div>
			</div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                <div className="flex flex-col gap-2 min-h-0">
                    <div className="flex-1 min-h-[320px] sm:min-h-[380px] lg:min-h-0">
                        <WorldMap
                            countries={targetCountries}
                            region={currentContinent?.id}
                        />
                    </div>
					<div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
						<div className="flex items-center gap-1.5">
							<span className="inline-block h-2.5 w-2.5 rounded-full bg-[hsl(var(--geo-green))]" />
							Guessed
						</div>
						<div className="flex items-center gap-1.5">
							<span className="inline-block h-2.5 w-2.5 rounded-full bg-[hsl(var(--geo-blue))]" />
							In play
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-3 min-h-0">
					<Card className="flex-shrink-0">
						<CardHeader className="bg-gradient-to-r from-secondary/10 to-accent/10 py-3">
							<CardTitle className="flex items-center gap-2 text-xl">
								<ShieldQuestion className="w-6 h-6 text-secondary" />
								<span>Make Your Guess</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-4 pb-4">
							<form
								onSubmit={handleGuess}
								className="flex flex-col gap-3"
							>
								<Input
									type="text"
									placeholder="Type a country name..."
									value={inputValue}
									onChange={(e) =>
										setInputValue(e.target.value)
									}
									disabled={gameState !== 'playing'}
									className="text-lg h-14 bg-background/80 focus:bg-background border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl shadow-inner"
									aria-label="Country guess input"
									autoFocus
								/>
								<div className="grid grid-cols-2 gap-3">
									<Button
										type="button"
										onClick={handlePause}
										variant="secondary"
										size="lg"
										className="h-12 text-base bg-secondary hover:bg-secondary/90 transition-all duration-300"
										disabled={
											gameState !== 'playing' &&
											gameState !== 'paused'
										}
									>
										{gameState === 'paused' ? (
											<Play className="mr-2 h-5 w-5" />
										) : (
											<Pause className="mr-2 h-5 w-5" />
										)}
										{gameState === 'paused'
											? 'Resume'
											: 'Pause'}
									</Button>
									<Button
										type="submit"
										size="lg"
										className="h-12 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
										disabled={gameState !== 'playing'}
									>
										<Check className="mr-2 h-5 w-5" />
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
								className="w-full flex items-center justify-between"
							>
								<span className="flex items-center gap-2">
									📍 Countries List ({guessedCount}/{total})
								</span>
								{showCountriesList ? (
									<ChevronUp className="h-4 w-4" />
								) : (
									<ChevronDown className="h-4 w-4" />
								)}
							</Button>
						</CollapsibleTrigger>
						<CollapsibleContent className="flex-1 min-h-0 mt-2">
							<Card className="h-full flex flex-col">
								<CardContent className="flex-1 min-h-0 p-4">
									<div className="grid grid-cols-2 gap-2 h-full overflow-y-auto pr-2">
										{targetCountries
											.sort((a, b) =>
												a.name.common.localeCompare(
													b.name.common,
												),
											)
											.map((country) => (
												<div
													key={country.cca2}
													className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 border h-fit ${
														country.guessed
															? 'bg-[hsl(var(--geo-green))] text-white font-bold border-[hsl(var(--geo-green))]/50 shadow-md'
															: 'bg-muted/30 text-muted-foreground border-border/50'
													}`}
												>
													{country.guessed ? (
														<span className="inline-flex items-center gap-1.5">
															<Check className="h-3 w-3" />
															{
																country.name
																	.common
															}
														</span>
													) : (
														'???'
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
	);
};

export default GameController;
