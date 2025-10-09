"use client";

import { useSearchParams } from 'next/navigation';
import GameController from '@/components/game-controller';

export default function PlayPage() {
  const params = useSearchParams();
  const initialContinentId = params.get('continent') ?? undefined;

  return (
    <main className="flex min-h-screen flex-col">
      <GameController initialContinentId={initialContinentId} />
    </main>
  );
}

