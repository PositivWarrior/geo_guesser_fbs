'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type GameLoadingProps = {
	regionName?: string;
	onBack: () => void;
};

export function GameLoading({ regionName, onBack }: GameLoadingProps) {
	return (
		<div className="w-full max-w-lg mx-auto px-3 py-4 min-h-[100dvh] flex flex-col justify-center">
			<Button
				variant="ghost"
				size="sm"
				className="mb-4 -ml-2 text-muted-foreground"
				onClick={onBack}
			>
				<ArrowLeft className="h-4 w-4 mr-1" />
				Lobby
			</Button>
			<div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 game-panel-strong rounded-2xl p-8">
				<Loader2 className="h-12 w-12 animate-spin text-primary" />
				<p className="text-muted-foreground text-sm text-center">
					Deploying mission
					{regionName ? (
						<>
							{' '}
							<span className="text-foreground font-semibold">
								{regionName}
							</span>
						</>
					) : null}
					…
				</p>
			</div>
		</div>
	);
}
