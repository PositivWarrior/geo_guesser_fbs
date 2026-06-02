'use client';

import { useSearchParams } from 'next/navigation';
import GameController from '@/components/game-controller';

export default function PlayPageClient() {
	const params = useSearchParams();
	const initialContinentId = params.get('continent') ?? undefined;

	return (
		<GameController initialContinentId={initialContinentId} />
	);
}
