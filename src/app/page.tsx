import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Compass } from '@/components/icons';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto space-y-10 text-center">
        <div className="space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent blur-3xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-sm rounded-full p-8 border-4 border-white/20 shadow-2xl">
              <Compass className="w-28 h-28 text-primary animate-pulse" />
            </div>
          </div>
          <h1 className="text-6xl font-headline font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">GeoGuesser</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Guess countries on an interactive world map. Choose a continent, beat the clock, and track your best scores.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="h-12 px-8">
            <Link href="/play">Play Now</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8">
            <Link href="/leaderboard">Leaderboard</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <Card>
            <CardHeader>
              <CardTitle>Fast Gameplay</CardTitle>
              <CardDescription>Short, timed rounds across regions.</CardDescription>
            </CardHeader>
            <CardContent>
              Beat the clock and guess as many countries as you can.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Path</CardTitle>
              <CardDescription>Play by continent or whole world.</CardDescription>
            </CardHeader>
            <CardContent>
              Start with Europe, or take on the full world challenge.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>Basic local leaderboard (more soon).</CardDescription>
            </CardHeader>
            <CardContent>
              Your device stores recent scores; global rankings coming later.
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
