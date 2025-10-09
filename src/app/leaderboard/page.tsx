"use client";

import { useEffect, useMemo, useState } from 'react';
import { getScores, clearScores, type StoredScore } from '@/lib/scores';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function LeaderboardPage() {
  const [scores, setScores] = useState<StoredScore[]>([]);

  useEffect(() => {
    setScores(getScores());
  }, []);

  const bestByContinent = useMemo(() => {
    const map = new Map<string, StoredScore>();
    for (const s of scores) {
      const key = s.continentId;
      const best = map.get(key);
      const isBetter = !best || s.score > best.score || (s.score === best.score && s.timeTaken < best.timeTaken);
      if (isBetter) map.set(key, s);
    }
    return Array.from(map.values());
  }, [scores]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>Local scores on this device. Cloud sync coming later.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setScores(getScores())}>Refresh</Button>
              <Button variant="destructive" onClick={() => { clearScores(); setScores([]); }}>Clear All</Button>
            </div>
            <Table>
              <TableCaption>Recent Scores</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Continent</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scores.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">No scores yet. Play a game to get started!</TableCell>
                  </TableRow>
                )}
                {scores.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{new Date(s.date).toLocaleString()}</TableCell>
                    <TableCell>{s.continentName}</TableCell>
                    <TableCell>{s.score}/{s.total}</TableCell>
                    <TableCell>{Math.floor(s.timeTaken / 60)}m {s.timeTaken % 60}s</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="pt-2">
              <h3 className="font-semibold mb-2">Best By Continent</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {bestByContinent.map((b) => (
                  <div key={b.continentId} className="rounded-lg border p-3 text-sm">
                    <div className="font-medium">{b.continentName}</div>
                    <div className="text-muted-foreground">Best: {b.score}/{b.total} in {Math.floor(b.timeTaken / 60)}m {b.timeTaken % 60}s</div>
                  </div>
                ))}
                {bestByContinent.length === 0 && (
                  <div className="text-muted-foreground">No best scores yet.</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

