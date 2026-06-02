"use client";

import { useState, useEffect } from "react";
import { getSavedPlayerName, savePlayerName } from "@/lib/player-name";
import { useAuth, getLeaderboardDisplayName } from "@/contexts/auth-context";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Trophy, Loader2 } from "lucide-react";

interface GameEndDialogProps {
  isOpen: boolean;
  score: number;
  total: number;
  timeTaken: number;
  continentName: string;
  continentId: string;
  missedCountries: string[];
  onRestart: () => void;
  onMenu: () => void;
  onSubmitToLeaderboard?: (playerName: string) => Promise<void>;
}

export function GameEndDialog({
  isOpen,
  score,
  total,
  timeTaken,
  continentName,
  continentId,
  missedCountries,
  onRestart,
  onMenu,
  onSubmitToLeaderboard,
}: GameEndDialogProps) {
  const { user } = useAuth();
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fromAuth = getLeaderboardDisplayName(user);
      setPlayerName(fromAuth || getSavedPlayerName());
    }
  }, [isOpen, user]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const isWin = score === total;

  const handleSubmitToLeaderboard = async () => {
    if (!playerName.trim() || !onSubmitToLeaderboard) return;
    
    setIsSubmitting(true);
    try {
      const name = playerName.trim();
      await onSubmitToLeaderboard(name);
      savePlayerName(name);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to submit to leaderboard:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset state when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setPlayerName("");
      setIsSubmitted(false);
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="w-[calc(100vw-2rem)] max-w-md max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-2xl sm:text-3xl flex items-center gap-2">
            {isWin && <Trophy className="w-8 h-8 text-yellow-500" />}
            {isWin ? `Congratulations!` : `Time's Up!`}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            You guessed <span className="font-bold text-primary">{score}</span> out of <span className="font-bold">{total}</span> countries in {continentName} in {formatTime(timeTaken)}.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Leaderboard submission section */}
        {onSubmitToLeaderboard && !isSubmitted && (
          <div className="flex flex-col gap-3 py-3 px-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-border/50">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-sm">Submit to Global Leaderboard</h3>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter your name..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
                disabled={isSubmitting}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && playerName.trim()) {
                    handleSubmitToLeaderboard();
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={handleSubmitToLeaderboard}
                disabled={!playerName.trim() || isSubmitting}
                size="sm"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </div>
        )}

        {isSubmitted && (
          <div className="flex items-center gap-2 py-3 px-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <Trophy className="w-5 h-5 text-green-500" />
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              Score submitted successfully!
            </p>
          </div>
        )}

        {missedCountries.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm">Countries you missed:</h3>
            <ScrollArea className="h-32 w-full rounded-md border p-2">
                <div className="flex flex-wrap gap-2">
                {missedCountries.map((c) => (
                    <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                ))}
                </div>
            </ScrollArea>
          </div>
        )}
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onMenu} className="w-full sm:w-auto">
            Back to Menu
          </Button>
          <Button onClick={onRestart} className="w-full sm:w-auto">
            Play Again
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
