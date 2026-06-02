"use client";

import { useEffect, useState } from 'react';
import { getScores, clearScores, type StoredScore } from '@/lib/scores';
import { getAllLeaderboards, type LeaderboardEntry } from '@/lib/leaderboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Trophy, Loader2, Globe, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { AuthButton } from '@/components/auth-button';

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
    <Card key={continentId} className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Trophy className="w-5 h-5 text-yellow-500" />
          {continentLabels[continentId] || continentId}
        </CardTitle>
        <CardDescription>Top 10 players worldwide</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No scores yet. Be the first!
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry, index) => (
                <TableRow key={entry.id || index} className={index < 3 ? 'bg-accent/5' : ''}>
                  <TableCell className="font-bold">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${index + 1}`}
                  </TableCell>
                  <TableCell className="font-medium">{entry.playerName}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-primary">{entry.score}</span>
                    <span className="text-muted-foreground">/{entry.total}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatTime(entry.timeTaken)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <main className="min-h-screen p-4 sm:p-6 pt-8 sm:pt-12">
      <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex justify-end">
          <AuthButton />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-headline font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Leaderboards
          </h1>
          <p className="text-muted-foreground">
            Compete with players worldwide or track your personal progress
          </p>
        </div>

        <div className="flex justify-center">
          <Button asChild variant="outline" size="sm">
            <Link href="/play">Back to Game</Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'global' | 'local')} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="global" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Global
            </TabsTrigger>
            <TabsTrigger value="local" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Personal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="space-y-6 mt-6">
            {!firebaseConfigured && !isLoading && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Global leaderboard not configured</AlertTitle>
                <AlertDescription>
                  Copy <code className="text-sm">.env.example</code> to{' '}
                  <code className="text-sm">.env.local</code> and add your Firebase keys.
                  Full steps are in <strong>docs/SETUP.md</strong> in this repository.
                </AlertDescription>
              </Alert>
            )}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading global leaderboards...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {continentOrder.map((continentId) =>
                  renderGlobalLeaderboard(
                    continentId,
                    globalLeaderboards[continentId] ?? [],
                  ),
                )}
              </div>
            )}
            <div className="flex justify-center pt-4">
              <Button onClick={loadGlobalLeaderboards} variant="outline" size="sm">
                Refresh Leaderboards
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="local" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Recent Scores</CardTitle>
                <CardDescription>Scores stored locally on this device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setLocalScores(getScores())}>Refresh</Button>
                  <Button variant="destructive" onClick={() => { clearScores(); setLocalScores([]); }}>Clear All</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>When</TableHead>
                      <TableHead>Continent</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {localScores.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          No scores yet. Play a game to get started!
                        </TableCell>
                      </TableRow>
                    )}
                    {localScores.slice(0, 20).map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{new Date(s.date).toLocaleString()}</TableCell>
                        <TableCell>{s.continentName}</TableCell>
                        <TableCell>
                          <span className="font-semibold text-primary">{s.score}</span>
                          <span className="text-muted-foreground">/{s.total}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatTime(s.timeTaken)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
