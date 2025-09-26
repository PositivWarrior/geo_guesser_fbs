"use client";

import { useState, useEffect } from 'react';
import { WorldMap } from '@/components/world-map';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { continents, type Continent } from '@/lib/continents';
import { countries, type Country } from '@/lib/countries';
import { normalizeString } from '@/lib/game-logic';
import { Timer, Check, Globe, Pause, Play, ShieldQuestion, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { checkPauseAbility } from '@/app/actions';
import { GameEndDialog } from './game-end-dialog';
import { ContinentSelector } from './continent-selector';
import { Compass } from './icons';

type GameState = "menu" | "playing" | "paused" | "finished";

const GameController = () => {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [currentContinent, setCurrentContinent] = useState<Continent | null>(null);
  const [targetCountries, setTargetCountries] = useState<Country[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isChallengeMode] = useState(false); // Challenge mode logic removed for now
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  const unlockedContinents = ["Europe", "Asia", "Africa", "North America", "South America", "Oceania"];

  const startGame = (continent: Continent) => {
    setCurrentContinent(continent);
    setTimeLeft(continent.time);
    setInputValue("");
    const gameCountries = (continent.id === "all-world" 
        ? countries 
        : countries.filter(c => c.continent === continent.name)
    ).map(c => ({ ...c, guessed: false }));

    setTargetCountries(gameCountries);
    setGameState("playing");
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
  
    const normalizedGuess = normalizeString(inputValue);
  
    const targetIndex = targetCountries.findIndex(
      (c) => !c.guessed && (normalizeString(c.name) === normalizedGuess || c.aliases?.some(alias => normalizeString(alias) === normalizedGuess))
    );
  
    if (targetIndex !== -1) {
      const newTargetCountries = [...targetCountries];
      newTargetCountries[targetIndex] = { ...newTargetCountries[targetIndex], guessed: true };
      setTargetCountries(newTargetCountries);
      toast({ title: "Correct!", description: `You've guessed ${newTargetCountries[targetIndex].name}.`, variant: 'default' });
    } else {
        const alreadyGuessed = targetCountries.some(
            (c) => c.guessed && (normalizeString(c.name) === normalizedGuess || c.aliases?.some(alias => normalizeString(alias) === normalizedGuess))
        );
        if (alreadyGuessed) {
            toast({ title: "Already Guessed!", description: "You've already found that country.", variant: "default" });
        } else {
            toast({ title: "Incorrect", description: "That's not a recognized country in this continent. Try again!", variant: "destructive" });
        }
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
  };

  const guessedCount = targetCountries.filter(c => c.guessed).length;

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (gameState === "playing" && timeLeft === 0) {
      setGameState("finished");
    }
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState === "playing" && targetCountries.length > 0 && guessedCount === targetCountries.length) {
      setGameState("finished");
    }
  }, [guessedCount, targetCountries.length, gameState]);

  if (gameState === "menu") {
    return <ContinentSelector continents={continents} unlockedContinents={unlockedContinents} onSelect={startGame} />;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const total = targetCountries.length;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 p-4">
       {currentContinent && (
         <GameEndDialog
            isOpen={gameState === 'finished'}
            score={guessedCount}
            total={total}
            timeTaken={currentContinent.time - timeLeft}
            continentName={currentContinent.name}
            missedCountries={targetCountries.filter(c => !c.guessed)}
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
        <Button onClick={resetGame} variant="outline" size="sm" className="bg-card/50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
        </Button>
      </header>
       <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
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
              key={currentContinent?.id}
              countries={targetCountries}
              mode={currentContinent?.id}
            />
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
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
