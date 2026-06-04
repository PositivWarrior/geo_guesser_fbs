'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AuthButton } from '@/components/auth-button';
import { Compass } from '@/components/icons';
import { ArrowLeft, Trophy, Zap } from 'lucide-react';

type PlayNavProps = {
	backLabel?: string;
	onBack?: () => void;
	showLeaderboard?: boolean;
};

export function PlayNav({
	backLabel = 'Home',
	onBack,
	showLeaderboard = true,
}: PlayNavProps) {
	return (
		<header className="sticky top-0 z-40 px-3 sm:px-4 pt-3 pb-2">
			<div className="game-panel max-w-7xl mx-auto rounded-2xl px-3 sm:px-4 py-2.5 grid grid-cols-[auto_1fr_auto] items-center gap-2">
				{onBack ? (
					<Button
						variant="ghost"
						size="sm"
						onClick={onBack}
						className="justify-self-start px-2 h-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
					>
						<ArrowLeft className="h-4 w-4 sm:mr-1" />
						<span className="hidden sm:inline text-sm">{backLabel}</span>
					</Button>
				) : (
					<Link
						href="/"
						className="justify-self-start flex items-center gap-1 h-9 px-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
					>
						<ArrowLeft className="h-4 w-4" />
						<span className="hidden sm:inline">{backLabel}</span>
					</Link>
				)}

				<Link
					href="/play"
					className="justify-self-center flex items-center gap-2 font-headline font-bold text-sm sm:text-base group min-w-0"
				>
					<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 border border-primary/30 shadow-[0_0_12px_hsl(var(--primary)/0.2)] group-hover:scale-105 transition-transform shrink-0">
						<Compass className="h-4 w-4 text-primary" />
					</span>
					<span className="truncate">
						Geo<span className="text-primary">Guesser</span>
					</span>
				</Link>

				<div className="justify-self-end flex items-center gap-1">
					{showLeaderboard && (
						<Button
							asChild
							variant="ghost"
							size="icon"
							className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
						>
							<Link href="/leaderboard" aria-label="Leaderboard">
								<Trophy className="h-4 w-4" />
							</Link>
						</Button>
					)}
					<Button
						asChild
						size="sm"
						className="hidden min-[400px]:flex h-8 px-3 game-cta text-xs"
					>
						<Link href="/play">
							<Zap className="h-3.5 w-3.5 mr-1 fill-current" />
							Play
						</Link>
					</Button>
					<AuthButton showLabel={false} className="h-9" />
				</div>
			</div>
		</header>
	);
}
