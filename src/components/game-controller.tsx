'use client';

import { useState, useEffect, useRef } from 'react';
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
import { useGameSession } from '@/contexts/game-session-context';
import { normalizeString } from '@/lib/game-logic';
import { GameLoading } from '@/components/play/game-loading';
import { GamePlayScreen } from '@/components/play/game-play-screen';
import type { GuessFeedback } from '@/components/play/guess-feedback-popup';
import { GameEndDialog } from './game-end-dialog';
import { ContinentSelector } from './continent-selector';
import { Country } from '@/lib/types';
import { saveScore } from '@/lib/scores';
import { saveToLeaderboard } from '@/lib/leaderboard';
import { useRouter } from 'next/navigation';
import { getCountriesByRegion, checkPauseAbility } from '@/app/actions';

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
	const [streak, setStreak] = useState(0);
	const [guessFeedback, setGuessFeedback] = useState<GuessFeedback | null>(
		null,
	);
	const { toast } = useToast();
	const router = useRouter();
	const entitlementState = useEntitlementState();
	const { setInSession } = useGameSession();

	const guessedCount = targetCountries.filter((c) => c.guessed).length;
	const total = targetCountries.length;
	const savedOnceRef = useRef(false);
	const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const feedbackIdRef = useRef(0);

	const showGuessFeedback = (next: Omit<GuessFeedback, 'id'>) => {
		if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
		feedbackIdRef.current += 1;
		setGuessFeedback({ ...next, id: feedbackIdRef.current });
		feedbackTimerRef.current = setTimeout(() => {
			setGuessFeedback(null);
			feedbackTimerRef.current = null;
		}, 1600);
	};

	useEffect(() => {
		return () => {
			if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
		};
	}, []);

	const inActiveGame =
		gameState === 'loading' ||
		gameState === 'playing' ||
		gameState === 'paused' ||
		gameState === 'finished';

	useEffect(() => {
		setInSession(inActiveGame);
		return () => setInSession(false);
	}, [inActiveGame, setInSession]);

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
		setStreak(0);
		savedOnceRef.current = false;

		try {
			const gameCountries = await getCountriesByRegion(continent.id);
			setTargetCountries(gameCountries);
			setTimeLeft(continent.time);
			setGameState('playing');
		} catch {
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
		if (!inputValue.trim() || gameState !== 'playing') return;

		const normalizedGuess = normalizeString(inputValue);

		const isAlreadyGuessed = targetCountries.some(
			(c) =>
				c.guessed && normalizeString(c.name.common) === normalizedGuess,
		);

		if (isAlreadyGuessed) {
			showGuessFeedback({
				kind: 'duplicate',
				title: 'Already found',
				subtitle: 'You guessed this country earlier.',
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
			setTargetCountries((prev) =>
				prev.map((country, index) =>
					index === targetIndex
						? { ...country, guessed: true }
						: country,
				),
			);
			setStreak((s) => s + 1);
			showGuessFeedback({
				kind: 'correct',
				title: 'Correct!',
				subtitle: countryName,
			});
		} else {
			setStreak(0);
			showGuessFeedback({
				kind: 'incorrect',
				title: 'Wrong guess',
				subtitle: 'Not in this region — try again',
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
				title: 'Pause disabled',
				description: 'Pausing is not allowed during challenges.',
			});
		}
	};

	const resetGame = () => {
		setGameState('menu');
		setCurrentContinent(null);
		setTargetCountries([]);
		setStreak(0);
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
			});
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: 'Failed to submit score. Please try again.';
			toast({
				title: 'Error',
				description: message,
				variant: 'destructive',
			});
			throw error;
		}
	};

	useEffect(() => {
		if (gameState === 'playing' && timeLeft > 0) {
			const timer = setInterval(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
			return () => clearInterval(timer);
		}
		if (gameState === 'playing' && timeLeft === 0 && total > 0) {
			setGameState('finished');
		}
	}, [gameState, timeLeft, total]);

	useEffect(() => {
		if (gameState === 'playing' && total > 0 && guessedCount === total) {
			setGameState('finished');
		}
	}, [guessedCount, total, gameState]);

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

	useEffect(() => {
		if (!initialContinentId) return;
		if (gameState !== 'menu') return;
		const found = continents.find((c) => c.id === initialContinentId);
		if (found) startGame(found);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- auto-start once
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
				onBack={resetGame}
			/>
		);
	}

	if (!currentContinent) return null;

	return (
		<>
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

			{(gameState === 'playing' || gameState === 'paused') && (
				<GamePlayScreen
					continent={currentContinent}
					timeLeft={timeLeft}
					guessedCount={guessedCount}
					total={total}
					inputValue={inputValue}
					onInputChange={setInputValue}
					gameState={gameState}
					streak={streak}
					countries={targetCountries}
					guessFeedback={guessFeedback}
					onSubmit={handleGuess}
					onPause={handlePause}
					onExit={() => {
						resetGame();
						router.push('/play');
					}}
				/>
			)}
		</>
	);
};

export default GameController;
