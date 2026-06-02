'use client';

import { Loader2, Map } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PlayShell } from './play-shell';
import { PlayNav } from './play-nav';

type GameLoadingProps = {
	regionName?: string;
	onBack?: () => void;
};

export function GameLoading({ regionName, onBack }: GameLoadingProps) {
	return (
		<PlayShell variant="game">
			<PlayNav backLabel="Lobby" onBack={onBack} />
			<div className="flex flex-col items-center justify-center min-h-[70vh] px-4 pb-12">
				<div className="landing-glass-strong w-full max-w-lg rounded-3xl p-8 sm:p-10 text-center space-y-6">
					<div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 border border-primary/30 mx-auto">
						<Map className="h-7 w-7 text-primary animate-pulse" />
					</div>
					<div className="space-y-2">
						<h2 className="text-2xl sm:text-3xl font-headline font-bold">
							Deploying to {regionName ?? 'region'}…
						</h2>
						<p className="text-sm text-muted-foreground">
							Loading countries and calibrating the map
						</p>
					</div>
					<Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
					<Skeleton className="h-48 sm:h-56 w-full rounded-2xl landing-glass" />
				</div>
			</div>
		</PlayShell>
	);
}
