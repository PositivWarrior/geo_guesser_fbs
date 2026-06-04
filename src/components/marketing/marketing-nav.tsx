'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Compass } from '@/components/icons';
import { AuthButton } from '@/components/auth-button';
import { BMC_PROFILE_URL } from '@/lib/bmc';
import { Menu, Zap, Trophy, Map, Coffee } from 'lucide-react';

const navLinks = [
	{ href: '/play', label: 'Play', icon: Map },
	{ href: '/leaderboard', label: 'Rankings', icon: Trophy },
	{ href: '/#how-to-play', label: 'How to Play', icon: Zap },
	{ href: BMC_PROFILE_URL, label: 'Support', icon: Coffee, external: true },
];

type MarketingNavProps = {
	/** Compact variant for in-game lobby */
	compact?: boolean;
};

export function MarketingNav({ compact = false }: MarketingNavProps) {
	const [open, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 px-3 sm:px-4 pt-3 pb-2 safe-top">
			<div
				className={`game-panel max-w-6xl mx-auto rounded-2xl px-3 sm:px-5 py-2.5 flex items-center gap-2 sm:gap-3 ${
					compact ? 'max-w-7xl' : ''
				}`}
			>
				<Link
					href="/"
					className="flex items-center gap-2 font-headline font-bold shrink-0 group"
				>
					<span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/35 shadow-[0_0_20px_hsl(var(--primary)/0.25)] group-hover:scale-105 transition-transform">
						<Compass className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
					</span>
					<span className="text-foreground text-sm sm:text-base tracking-tight">
						Geo<span className="text-primary">Guesser</span>
					</span>
				</Link>

				<nav className="hidden lg:flex flex-1 items-center justify-center gap-1">
					{navLinks.map(({ href, label, external }) => (
						<Button
							key={href}
							asChild
							variant="ghost"
							size="sm"
							className="text-muted-foreground hover:text-primary hover:bg-primary/10"
						>
							{external ? (
								<a href={href} target="_blank" rel="noopener noreferrer">
									{label}
								</a>
							) : (
								<Link href={href}>{label}</Link>
							)}
						</Button>
					))}
				</nav>

				<div className="flex-1 lg:flex-none" />

				<div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
					<AuthButton
						variant="outline"
						size="sm"
						showLabel={false}
						className="hidden min-[380px]:flex border-white/15 hover:border-primary/40 hover:bg-primary/10 h-9"
					/>
					<Button
						asChild
						size="sm"
						className="hidden sm:flex h-9 px-4 game-cta shadow-[0_0_24px_hsl(var(--primary)/0.35)]"
					>
						<Link href="/play">
							<Zap className="h-4 w-4 mr-1.5 fill-current" />
							Play Now
						</Link>
					</Button>

					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="lg:hidden h-9 w-9 text-foreground"
								aria-label="Open menu"
							>
								<Menu className="h-5 w-5" />
							</Button>
						</SheetTrigger>
						<SheetContent
							side="right"
							className="game-panel border-l border-white/10 w-[min(100vw-2rem,20rem)]"
						>
							<SheetHeader>
								<SheetTitle className="font-headline text-left">
									Menu
								</SheetTitle>
							</SheetHeader>
							<nav className="flex flex-col gap-2 mt-6">
								{navLinks.map(({ href, label, icon: Icon, external }) => (
									<Button
										key={href}
										asChild
										variant="ghost"
										className="justify-start h-12 text-base game-panel hover:border-primary/30"
										onClick={() => setOpen(false)}
									>
										{external ? (
											<a
												href={href}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Icon className="h-5 w-5 mr-3 text-primary" />
												{label}
											</a>
										) : (
											<Link href={href}>
												<Icon className="h-5 w-5 mr-3 text-primary" />
												{label}
											</Link>
										)}
									</Button>
								))}
								<div className="pt-4 border-t border-white/10 space-y-2">
									<AuthButton
										variant="outline"
										className="w-full border-white/15"
									/>
									<Button asChild className="w-full game-cta h-11">
										<Link href="/play" onClick={() => setOpen(false)}>
											<Zap className="h-4 w-4 mr-2 fill-current" />
											Play Now
										</Link>
									</Button>
								</div>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
