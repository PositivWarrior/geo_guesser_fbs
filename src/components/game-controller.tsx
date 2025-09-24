"use client";

import { useState, useEffect } from 'react';
import { WorldMap } from '@/components/world-map';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { continents, type Continent } from '@/lib/continents';
import { countries, type Country } from '@/lib/countries';
import { normalizeString } from '@/lib/game-logic';
import { Timer, Check, Globe, Pause, Play, ShieldQuestion } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { checkPauseAbility } from '@/app/actions';
import { GameEndDialog } from './game-end-dialog';
import { ContinentSelector } from './continent-selector';
import { Compass } from './icons';

type GameState = "menu" | "playing" | "paused" | "finished";

const GameController = () => {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [currentContinent, setCurrentContinent] = useState<Continent>(continents[0]);
  const [targetCountries, setTargetCountries] = useState<Country[]>([]);
  const [timeLeft, setTimeLeft] = useState(continents[0].time);
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  const unlockedContinents = ["Europe"]; // Mock for IAP

  const startGame = (continent: Continent) => {
    setCurrentContinent(continent);
    setTimeLeft(continent.time);
    setInputValue("");
    let gameCountries;
    if (continent.id === "all-world") {
      gameCountries = countries.map(c => ({ ...c, guessed: false }));
    } else {
      gameCountries = countries
        .filter(c => c.continent === continent.name)
        .map(c => ({ ...c, guessed: false }));
    }
    setTargetCountries(gameCountries);
    setGameState("playing");
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const normalizedGuess = normalizeString(inputValue);
    const targetIndex = targetCountries.findIndex(
      c => normalizeString(c.name) === normalizedGuess || c.aliases.some(alias => normalizeString(alias) === normalizedGuess)
    );

    if (targetIndex !== -1) {
      const target = targetCountries[targetIndex];
      if (target.guessed) {
        toast({ title: "Already Guessed!", description: `You've already found ${target.name}.`, variant: "default" });
      } else {
        const newTargetCountries = [...targetCountries];
        newTargetCountries[targetIndex] = { ...target, guessed: true };
        setTargetCountries(newTargetCountries);
        toast({ title: "Correct!", description: `You've guessed ${target.name}.`, variant: "default" });
      }
    } else {
      toast({ title: "Incorrect", description: "That's not a recognized country. Try again!", variant: "destructive" });
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
  };

  const guessedCount = targetCountries.filter(c => c.guessed).length;

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameState("finished");
    }
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState === "playing" && targetCountries.length > 0 && guessedCount === targetCountries.length) {
      setGameState("finished");
    }
  }, [guessedCount, targetCountries, gameState]);


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
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
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
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <Compass className="w-10 h-10 text-primary" />
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-foreground">
            GeoGuesser
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="challenge-mode" className="text-sm font-medium">Challenge Mode</Label>
            <Switch
              id="challenge-mode"
              checked={isChallengeMode}
              onCheckedChange={setIsChallengeMode}
              aria-label="Toggle challenge mode"
            />
          </div>
          <Button onClick={resetGame} variant="outline" size="sm">
            <Globe className="mr-2 h-4 w-4" />
            Change Continent
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6 order-1 lg:order-2">
           <Card>
            <CardContent className="grid grid-cols-2 lg:grid-cols-2 gap-4 text-center p-6">
              <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                <Timer className="w-8 h-8 mb-2 text-primary" />
                <span className="text-3xl font-bold font-mono">{formatTime(timeLeft)}</span>
                <span className="text-sm text-muted-foreground">Time Left</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                <Check className="w-8 h-8 mb-2 text-accent" />
                <span className="text-3xl font-bold font-mono">{guessedCount}/{total}</span>
                <span className="text-sm text-muted-foreground">Countries</span>
              </div>
            </CardContent>
          </Card>
           <Card className="w-full">
            <CardContent className="p-2 sm:p-4">
             <WorldMap 
                key={currentContinent.id}
                countries={targetCountries}
                mode={currentContinent.id}
              />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6 order-2 lg:order-1">
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
                  className="text-lg h-12"
                  aria-label="Country guess input"
                />
                <div className="grid grid-cols-2 gap-2">
                    <Button type="button" onClick={handlePause} variant="outline" size="lg" disabled={gameState !== 'playing' && gameState !== 'paused'}>
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
    </div>
  );
};

export default GameController;
