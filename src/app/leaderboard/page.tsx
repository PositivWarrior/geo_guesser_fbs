"use client";

import { useEffect, useState } from 'react';
import { getScores, clearScores, type StoredScore } from '@/lib/scores';
import { getAllLeaderboards, type LeaderboardEntry } from '@/lib/leaderboard';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Trophy, Loader2, Globe, AlertCircle, Zap, Medal } from 'lucide-react';
import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/marketing-shell';
import { MarketingNav } from '@/components/marketing/marketing-nav';

export default function LeaderboardPage() {
  const [localScores, setLocalScores] = useState<StoredScore[]>([]);
  const [globalLeaderboards, setGlobalLeaderboards] = useState<Record<string, LeaderboardEntry[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseConfigured, setFirebaseConfigured] = useState(true);
  const [activeTab, setActiveTab] = useState<'global' | 'local'>('global');

  useEffect(() => {
    setLocalScores(getScores());
    loadGlobalLeaderboards();
  }, []);

  const loadGlobalLeaderboards = async () => {
    setIsLoading(true);
    try {
      const { leaderboards, configured } = await getAllLeaderboards(10);
      setGlobalLeaderboards(leaderboards);
      setFirebaseConfigured(configured);
    } catch (error) {
      console.error('Failed to load global leaderboards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const continentLabels: Record<string, string> = {
    'europe': 'Europe',
    'asia-oceania': 'Asia & Oceania',
    'americas': 'The Americas',
    'africa': 'Africa',
    'all-world': 'Whole World',
  };

  const continentOrder = ['europe', 'asia-oceania', 'americas', 'africa', 'all-world'];

  const renderGlobalLeaderboard = (continentId: string, entries: LeaderboardEntry[]) => (
    <article key={continentId} className="game-panel rounded-2xl overflow-hidden">
      <header className="px-4 sm:px-5 py-4 border-b border-white/10 bg-gradient-to-r from-primary/10 via-transparent to-accent/10">
        <h2 className="font-headline font-bold text-lg sm:text-xl flex items-center gap-2">
          <Medal className="w-5 h-5 text-accent shrink-0" />
          {continentLabels[continentId] || continentId}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">Top 10 worldwide</p>
      </header>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="w-12 text-muted-foreground">#</TableHead>
              <TableHead className="text-muted-foreground">Player</TableHead>
              <TableHead className="text-muted-foreground">Score</TableHead>
              <TableHead className="text-muted-foreground">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                  No scores yet — be the first to claim the board!
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry, index) => (
                <TableRow
                  key={entry.id || index}
                  className={`border-white/5 ${index < 3 ? 'bg-primary/5' : ''}`}
                >
                  <TableCell className="font-bold text-base">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && (
                      <span className="text-muted-foreground text-sm">
                        #{index + 1}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-[8rem] sm:max-w-none truncate">
                    {entry.playerName}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    <span className="font-bold text-primary">{entry.score}</span>
                    <span className="text-muted-foreground">/{entry.total}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm tabular-nums">
                    {formatTime(entry.timeTaken)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </article>
  );

  return (
    <MarketingShell>
      <MarketingNav />

      <main className="px-3 sm:px-4 pb-16 max-w-6xl mx-auto">
        <section className="pt-6 sm:pt-10 pb-6 text-center animate-landing-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full game-panel px-3 py-1.5 text-xs text-primary mb-4 border-primary/25">
            <Trophy className="h-4 w-4" />
            <span className="font-medium uppercase tracking-wider">Global Rankings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold uppercase tracking-tight">
            <span className="text-foreground">Climb the </span>
            <span className="game-headline-accent">leaderboard</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-md mx-auto">
            Compete worldwide or track your personal runs on this device.
          </p>
        </section>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Button asChild className="game-cta h-11 px-6">
            <Link href="/play">
              <Zap className="mr-2 h-4 w-4 fill-current" />
              Play Now
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="game-panel h-11 hover:border-primary/40"
          >
            <Link href="/">Back Home</Link>
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'global' | 'local')}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 game-panel p-1 h-12">
            <TabsTrigger
              value="global"
              className="flex items-center gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-lg"
            >
              <Globe className="w-4 h-4" />
              Global
            </TabsTrigger>
            <TabsTrigger
              value="local"
              className="flex items-center gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-lg"
            >
              <Trophy className="w-4 h-4" />
              Personal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="space-y-4 mt-6">
            {!firebaseConfigured && !isLoading && (
              <Alert variant="destructive" className="game-panel border-destructive/40">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Global leaderboard not configured</AlertTitle>
                <AlertDescription className="text-sm">
                  Copy <code className="text-xs">.env.example</code> to{' '}
                  <code className="text-xs">.env.local</code> and add Firebase keys.
                  See <strong>docs/SETUP.md</strong>.
                </AlertDescription>
              </Alert>
            )}
            {isLoading ? (
              <div className="game-panel rounded-2xl flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading global boards…</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {continentOrder.map((continentId) =>
                  renderGlobalLeaderboard(
                    continentId,
                    globalLeaderboards[continentId] ?? [],
                  ),
                )}
              </div>
            )}
            <div className="flex justify-center pt-2">
              <Button
                onClick={loadGlobalLeaderboards}
                variant="outline"
                size="sm"
                className="game-panel"
              >
                Refresh
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="local" className="mt-6">
            <article className="game-panel-strong rounded-2xl overflow-hidden">
              <header className="px-4 sm:px-5 py-4 border-b border-white/10">
                <h2 className="font-headline font-bold text-lg">Your Recent Scores</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Stored locally on this device
                </p>
              </header>
              <div className="p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="game-panel"
                    onClick={() => setLocalScores(getScores())}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      clearScores();
                      setLocalScores([]);
                    }}
                  >
                    Clear All
                  </Button>
                </div>
                <div className="overflow-x-auto -mx-1">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-muted-foreground">When</TableHead>
                        <TableHead className="text-muted-foreground">Region</TableHead>
                        <TableHead className="text-muted-foreground">Score</TableHead>
                        <TableHead className="text-muted-foreground">Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {localScores.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-muted-foreground py-10"
                          >
                            No runs yet — deploy a mission and play!
                          </TableCell>
                        </TableRow>
                      )}
                      {localScores.slice(0, 20).map((s) => (
                        <TableRow key={s.id} className="border-white/5">
                          <TableCell className="text-xs sm:text-sm whitespace-nowrap">
                            {new Date(s.date).toLocaleString()}
                          </TableCell>
                          <TableCell>{s.continentName}</TableCell>
                          <TableCell className="tabular-nums">
                            <span className="font-bold text-primary">{s.score}</span>
                            <span className="text-muted-foreground">/{s.total}</span>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatTime(s.timeTaken)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </article>
          </TabsContent>
        </Tabs>
      </main>
    </MarketingShell>
  );
}
