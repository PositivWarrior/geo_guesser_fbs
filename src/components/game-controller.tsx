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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { checkPauseAbility, getCountriesByRegion } from '@/app/actions';
import { GameEndDialog } from './game-end-dialog';
import { ContinentSelector } from './continent-selector';
import { Compass } from './icons';
import { Country } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

type GameState = 'menu' | 'loading' | 'playing' | 'paused' | 'finished';

const GameController = () => {
	const [gameState, setGameState] = useState<GameState>('menu');
	const [currentContinent, setCurrentContinent] = useState<Continent | null>(
		null,
	);
	const [targetCountries, setTargetCountries] = useState<Country[]>([]);
	const [timeLeft, setTimeLeft] = useState(0);
	const [isChallengeMode] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const { toast } = useToast();

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
		<div className="w-full max-w-7xl mx-auto flex flex-col gap-6 p-4 md:p-6">
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
			<header className="flex justify-between items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-primary/10 via-background/40 to-accent/10 border border-border/50 shadow-sm">
				<div className="flex items-center gap-3">
					<Compass className="w-10 h-10 text-primary" />
					<h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
						GeoGuesser
					</h1>
				</div>
				<Button
					onClick={resetGame}
					variant="outline"
					size="sm"
					className="bg-card/80 border-border/60 shadow-sm"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Menu
				</Button>
			</header>
			<Card className="bg-card/60 backdrop-blur-md border border-border/50 shadow-xl">
				<CardContent className="grid grid-cols-2 gap-4 text-center p-4">
					<div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-br from-background/70 to-background/40 border border-border/50 shadow-sm">
						<Timer className="w-8 h-8 mb-2 text-primary" />
						<span className="text-4xl font-bold font-mono tracking-tighter">
							{formatTime(timeLeft)}
						</span>
						<span className="text-sm text-muted-foreground">
							Time Left
						</span>
					</div>
					<div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-br from-background/70 to-background/40 border border-border/50 shadow-sm">
						<Check className="w-8 h-8 mb-2 text-accent" />
						<span className="text-4xl font-bold font-mono tracking-tighter">
							{guessedCount}/{total}
						</span>
						<span className="text-sm text-muted-foreground">
							Countries
						</span>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 gap-6">
				<Card className="w-full bg-transparent border-0 shadow-none">
					<CardContent className="p-0">
						<div className="flex items-center justify-end gap-4 px-2 pb-2 text-xs text-muted-foreground">
							<div className="flex items-center gap-2">
								<span className="inline-block h-3 w-3 rounded-full bg-green-500" />{' '}
								Guessed
							</div>
							<div className="flex items-center gap-2">
								<span className="inline-block h-3 w-3 rounded-full bg-accent" />{' '}
								In play
							</div>
							{currentContinent?.id !== 'all-world' && (
								<div className="flex items-center gap-2">
									<span className="inline-block h-3 w-3 rounded-full bg-muted-foreground/40" />{' '}
									Out of play
								</div>
							)}
						</div>
						<WorldMap
							countries={targetCountries}
							region={currentContinent?.id}
						/>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-xl font-headline">
							Countries List
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
							{targetCountries
								.sort((a, b) =>
									a.name.common.localeCompare(b.name.common),
								)
								.map((country) => (
									<div
										key={country.cca2}
										className={`px-3 py-2 rounded-md text-sm transition-all duration-300 border ${
											country.guessed
												? 'bg-[hsl(var(--geo-green))] text-white font-bold border-[hsl(var(--geo-green))]/50 shadow-md hover:shadow-lg hover:scale-105'
												: 'bg-muted/30 text-muted-foreground border-border/50'
										}`}
									>
										{country.guessed ? (
											<span className="inline-flex items-center gap-2">
												<Check className="h-3.5 w-3.5" />{' '}
												{country.name.common}
											</span>
										) : (
											'???'
										)}
									</div>
								))}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-xl font-headline">
							<ShieldQuestion />
							<span>Make a Guess</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleGuess}
							className="flex flex-col gap-4"
						>
							<Input
								type="text"
								placeholder="Enter country name..."
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								disabled={gameState !== 'playing'}
								className="text-lg h-14 bg-background/80 focus:bg-background rounded-xl ring-1 ring-border/50 focus:ring-2 focus:ring-primary/40 shadow-sm"
								aria-label="Country guess input"
							/>
							<div className="grid grid-cols-2 gap-4">
								<Button
									type="button"
									onClick={handlePause}
									variant="secondary"
									size="lg"
									disabled={
										gameState !== 'playing' &&
										gameState !== 'paused'
									}
									className="shadow-sm"
								>
									{gameState === 'paused' ? (
										<Play className="mr-2" />
									) : (
										<Pause className="mr-2" />
									)}
									{gameState === 'paused'
										? 'Resume'
										: 'Pause'}
								</Button>
								<Button
									type="submit"
									size="lg"
									disabled={gameState !== 'playing'}
									className="shadow-sm"
								>
									Guess
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default GameController;
