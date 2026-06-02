'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AuthButton } from '@/components/auth-button';
import { Compass } from '@/components/icons';
import { ArrowLeft, Trophy } from 'lucide-react';

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
			<div className="landing-glass max-w-7xl mx-auto rounded-2xl px-3 sm:px-5 py-2.5 grid grid-cols-[auto_1fr_auto] items-center gap-2">
				{onBack ? (
					<Button
						variant="ghost"
						size="sm"
						onClick={onBack}
						className="justify-self-start px-2 text-muted-foreground hover:text-foreground"
					>
						<ArrowLeft className="h-4 w-4 sm:mr-1.5" />
						<span className="hidden sm:inline text-sm">{backLabel}</span>
					</Button>
				) : (
					<Link
						href="/"
						className="justify-self-start flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						<span className="hidden sm:inline">{backLabel}</span>
					</Link>
				)}

				<Link
					href="/play"
					className="justify-self-center flex items-center gap-2 font-headline font-bold text-sm sm:text-base group"
				>
					<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 border border-primary/25 group-hover:scale-105 transition-transform">
						<Compass className="h-4 w-4 text-primary" />
					</span>
					<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
						GeoGuesser
					</span>
				</Link>

				<div className="justify-self-end flex items-center gap-1">
					{showLeaderboard && (
						<Button
							asChild
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-muted-foreground"
						>
							<Link href="/leaderboard" aria-label="Leaderboard">
								<Trophy className="h-4 w-4" />
							</Link>
						</Button>
					)}
					<AuthButton showLabel={false} />
				</div>
			</div>
		</header>
	);
}
