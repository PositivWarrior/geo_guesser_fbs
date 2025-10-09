"use client";

import { useRouter } from 'next/navigation';
import { ContinentSelector } from '@/components/continent-selector';
import { continents } from '@/lib/continents';

export default function ContinentsPage() {
  const router = useRouter();

  const unlockedContinents = [
    'Europe',
    'Asia & Oceania',
    'The Americas',
    'Africa',
    'Whole World',
  ];

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <ContinentSelector
        continents={continents}
        unlockedContinents={unlockedContinents}
        onSelect={(c) => router.push(`/play?continent=${c.id}`)}
      />
    </main>
  );
}

