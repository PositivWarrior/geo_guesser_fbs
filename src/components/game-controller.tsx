
"use client";

import { useState, useEffect } from 'react';
import { WorldMap } from '@/components/world-map';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { continents, type Continent } from '@/lib/continents';
import { normalizeString } from '@/lib/game-logic';
import { Timer, Check, Pause, Play, ShieldQuestion, ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { checkPauseAbility, getCountriesByRegion } from '@/app/actions';
import { GameEndDialog } from './game-end-dialog';
import { ContinentSelector } from './continent-selector';
import { Compass } from './icons';
import { Country } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

type GameState = "menu" | "loading" | "playing" | "paused" | "finished";

const GameController = () => {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [currentContinent, setCurrentContinent] = useState<Continent | null>(null);
  const [targetCountries, setTargetCountries] = useState<Country[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isChallengeMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [gameVersion, setGameVersion] = useState(0);
  const { toast } = useToast();

  const unlockedContinents = ["Europe", "Asia & Oceania", "The Americas", "Africa", "Whole World"];

  const startGame = async (continent: Continent) => {
    setGameState("loading");
    setCurrentContinent(continent);
    setInputValue("");
    setGameVersion(0);
    
    try {
        const gameCountries = await getCountriesByRegion(continent.id);
        setTargetCountries(gameCountries);
        setTimeLeft(continent.time);
        setGameState("playing");
    } catch (error) {
        console.error("Failed to start game:", error);
        toast({
            title: "Error",
            description: "Could not load countries. Please try again later.",
            variant: "destructive",
        });
        setGameState("menu");
    }
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const normalizedGuess = normalizeString(inputValue);

    const isAlreadyGuessed = targetCountries.some(
      (c) => c.guessed && normalizeString(c.name.common) === normalizedGuess
    );

    if (isAlreadyGuessed) {
        toast({ title: "Already Guessed!", description: "You've already found that country.", variant: "default" });
        setInputValue("");
        return;
    }

    const targetIndex = targetCountries.findIndex(
      (c) => !c.guessed && 
        (normalizeString(c.name.common) === normalizedGuess || 
         Object.values(c.translations).some(t => normalizeString(t.common) === normalizedGuess) ||
         (c.demonyms && Object.values(c.demonyms).some(d => normalizeString(d.m) === normalizedGuess || normalizeString(d.f) === normalizedGuess))
        )
    );

    if (targetIndex !== -1) {
      const countryName = targetCountries[targetIndex].name.common;
      const newTargetCountries = targetCountries.map((country, index) => 
        index === targetIndex ? { ...country, guessed: true } : country
      );
      setTargetCountries(newTargetCountries);
      setGameVersion(v => v + 1); // Force re-render of map
      toast({ title: "Correct!", description: `You've guessed ${countryName}.`, variant: 'default' });
    } else {
      toast({ title: "Incorrect", description: "That's not a recognized country in this continent. Try again!", variant: "destructive" });
    }
    setInputValue("");
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
        title: "Pause Disabled",
        description: "Pausing is not allowed during challenges.",
      });
    }
  };

  const resetGame = () => {
    setGameState("menu");
    setCurrentContinent(null);
    setTargetCountries([]);
  };

  const guessedCount = targetCountries.filter(c => c.guessed).length;
  const total = targetCountries.length;

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (gameState === "playing" && timeLeft === 0 && total > 0) {
      setGameState("finished");
    }
  }, [gameState, timeLeft, total]);

  useEffect(() => {
    if (gameState === "playing" && total > 0 && guessedCount === total) {
      setGameState("finished");
    }
  }, [guessedCount, total, gameState]);

  if (gameState === "menu") {
    return <ContinentSelector continents={continents} unlockedContinents={unlockedContinents} onSelect={startGame} />;
  }
  
  if (gameState === "loading") {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full">
            <Card className="w-full max-w-2xl text-center">
                <CardHeader>
                    <CardTitle className="text-3xl">Loading your adventure...</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <Loader2 className="w-16 h-16 animate-spin text-primary" />
                    <p className="text-muted-foreground">Fetching countries and preparing the map.</p>
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
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 p-4">
       {currentContinent && (
         <GameEndDialog
            isOpen={gameState === 'finished'}
            score={guessedCount}
            total={total}
            timeTaken={currentContinent.time - timeLeft}
            continentName={currentContinent.name}
            missedCountries={targetCountries.filter(c => !c.guessed).map(c => c.name.common)}
            onRestart={() => startGame(currentContinent)}
            onMenu={resetGame}
          />
       )}
      <header className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <Compass className="w-10 h-10 text-primary" />
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-foreground tracking-tighter">
            GeoGuesser
          </h1>
        </div>
        <Button onClick={resetGame} variant="outline" size="sm" className="bg-card/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
        </Button>
      </header>
       <Card>
        <CardContent className="grid grid-cols-2 gap-4 text-center p-4">
          <div className="flex flex-col items-center justify-center p-4 bg-background/50 rounded-lg">
            <Timer className="w-8 h-8 mb-2 text-primary" />
            <span className="text-4xl font-bold font-mono tracking-tighter">{formatTime(timeLeft)}</span>
            <span className="text-sm text-muted-foreground">Time Left</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-background/50 rounded-lg">
            <Check className="w-8 h-8 mb-2 text-accent" />
            <span className="text-4xl font-bold font-mono tracking-tighter">{guessedCount}/{total}</span>
            <span className="text-sm text-muted-foreground">Countries</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card className="w-full bg-transparent border-0 shadow-none">
          <CardContent className="p-0">
           <WorldMap
              key={`${currentContinent?.id}-${gameVersion}`}
              countries={targetCountries}
              region={currentContinent?.id}
            />
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
            <form onSubmit={handleGuess} className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="Enter country name..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={gameState !== 'playing'}
                className="text-lg h-14 bg-background/80 focus:bg-background"
                aria-label="Country guess input"
              />
              <div className="grid grid-cols-2 gap-4">
                  <Button type="button" onClick={handlePause} variant="secondary" size="lg" disabled={gameState !== 'playing' && gameState !== 'paused'}>
                    {gameState === 'paused' ? <Play className="mr-2" /> : <Pause className="mr-2" />}
                    {gameState === 'paused' ? 'Resume' : 'Pause'}
                  </Button>
                <Button type="submit" size="lg" disabled={gameState !== 'playing'}>
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

    