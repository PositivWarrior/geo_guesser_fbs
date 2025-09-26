"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import type { Country } from "@/lib/countries";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface GameEndDialogProps {
  isOpen: boolean;
  score: number;
  total: number;
  timeTaken: number;
  continentName: string;
  missedCountries: Country[];
  onRestart: () => void;
  onMenu: () => void;
}

export function GameEndDialog({
  isOpen,
  score,
  total,
  timeTaken,
  continentName,
  missedCountries,
  onRestart,
  onMenu,
}: GameEndDialogProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const isWin = score === total;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-3xl">
            {isWin ? `Congratulations!` : `Time's Up!`}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            You guessed {score} out of {total} countries in {continentName} in {formatTime(timeTaken)}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {missedCountries.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Countries you missed:</h3>
            <ScrollArea className="h-40 w-full rounded-md border p-2">
                <div className="flex flex-wrap gap-2">
                {missedCountries.map((c) => (
                    <Badge key={c.iso2} variant="secondary">{c.name}</Badge>
                ))}
                </div>
            </ScrollArea>
          </div>
        )}
        <AlertDialogFooter>
          <Button variant="outline" onClick={onMenu}>
            Back to Menu
          </Button>
          <Button onClick={onRestart}>
            Play Again
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
