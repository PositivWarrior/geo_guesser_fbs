'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuthButton } from '@/components/auth-button';
import { MarketingShell } from '@/components/marketing/marketing-shell';
import { MarketingNav } from '@/components/marketing/marketing-nav';
import { HeroMapVisual } from '@/components/marketing/hero-map-visual';
import { SocialProofAvatars } from '@/components/marketing/social-proof-avatars';
import {
	BMC_PROFILE_URL,
	BMC_AMERICAS_URL,
	BMC_AFRICA_URL,
	BMC_MIN_SUPPORT_USD,
} from '@/lib/bmc';
import {
	Trophy,
	Map,
	LogIn,
	Coffee,
	Leaf,
	Mountain,
	LandPlot,
	Sun,
	Zap,
	Globe2,
	Crown,
	Crosshair,
	Star,
	Users,
	Target,
} from 'lucide-react';

const regions = [
	{
		icon: Leaf,
		name: 'Europe',
		status: 'Free',
		statusClass: 'bg-primary/20 text-primary border-primary/40',
		desc: 'No account — jump in and climb the leaderboard.',
	},
	{
		icon: Mountain,
		name: 'Asia & Oceania',
		status: 'Sign in',
		statusClass: 'bg-secondary/20 text-secondary border-secondary/40',
		desc: 'Free with Google — saves your name for global scores.',
	},
	{
		icon: LandPlot,
		name: 'The Americas',
		status: `$${BMC_MIN_SUPPORT_USD}+`,
		statusClass: 'bg-accent/20 text-accent border-accent/40',
		desc: 'Unlock with Buy Me a Coffee (separate support).',
		href: BMC_AMERICAS_URL,
	},
	{
		icon: Sun,
		name: 'Africa',
		status: `$${BMC_MIN_SUPPORT_USD}+`,
		statusClass: 'bg-accent/20 text-accent border-accent/40',
		desc: 'Another support unlocks Africa on your account.',
		href: BMC_AFRICA_URL,
	},
];

const features = [
	{
		icon: Globe2,
		title: 'Explore the World',
		text: 'Guess countries across 4 regions and 195+ nations.',
	},
	{
		icon: Zap,
		title: 'Race the Clock',
		text: 'Fast guesses. Big points. Can you beat the timer?',
	},
	{
		icon: Trophy,
		title: 'Climb the Ranks',
		text: 'Compete on the global leaderboard.',
	},
	{
		icon: Crosshair,
		title: 'Track Your Progress',
		text: 'Unlock regions and prove you know the world.',
	},
];

const footerStats = [
	{ icon: Globe2, value: '195+', label: 'Countries' },
	{ icon: Map, value: '4', label: 'Regions' },
	{ icon: Users, value: '100K+', label: 'Players' },
	{ icon: Target, value: '1', label: 'Ultimate Goal' },
];

export function LandingPage() {
	return (
		<MarketingShell>
			<MarketingNav />

			<main className="px-3 sm:px-4 pb-16 max-w-6xl mx-auto">
				{/* Hero — copy + CTA first on mobile (mockup) */}
				<section className="pt-4 sm:pt-8 pb-10 sm:pb-16">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
						<div className="text-center lg:text-left space-y-5 animate-landing-fade-up">
							<div className="inline-flex items-center gap-2 rounded-full game-panel px-3 py-1.5 text-[10px] sm:text-xs text-accent border-accent/30 mx-auto lg:mx-0 uppercase tracking-wider font-semibold">
								<Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 fill-accent/20 text-accent" />
								<span>The Ultimate Geography Challenge</span>
							</div>

							<h1 className="font-headline font-bold tracking-tight leading-[1.02]">
								<span className="block text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl xl:text-[3.4rem] text-foreground uppercase hero-headline-line">
									Guess the world.
								</span>
								<span className="block text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl xl:text-[3.4rem] mt-0.5 uppercase italic game-headline-accent animate-game-text-glow">
									Beat the clock.
								</span>
							</h1>

							<p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed">
								Name countries, light up the map, and conquer every region.
								One guess at a time.
							</p>

							<div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
								<Button asChild size="lg" className="h-12 px-8 game-cta text-base uppercase tracking-wide">
									<Link href="/play">
										<Zap className="mr-2 h-5 w-5 fill-current" />
										Start Playing
									</Link>
								</Button>
								<Button
									asChild
									variant="outline"
									size="lg"
									className="h-12 px-8 game-panel hover:bg-primary/10 hover:border-primary/40 hover:text-primary uppercase tracking-wide text-sm"
								>
									<Link href="/leaderboard">
										<Trophy className="mr-2 h-5 w-5" />
										View Leaderboard
									</Link>
								</Button>
							</div>

							<div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
								<SocialProofAvatars />
								<div className="text-left">
									<div className="flex gap-0.5 text-accent mb-0.5">
										{Array.from({ length: 5 }).map((_, i) => (
											<Star
												key={i}
												className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-accent text-accent"
											/>
										))}
									</div>
									<p className="text-xs sm:text-sm text-muted-foreground leading-snug">
										Loved by geography fans worldwide
									</p>
								</div>
							</div>
						</div>

						<div
							className="animate-landing-fade-up lg:justify-self-end w-full"
							style={{ animationDelay: '0.12s' }}
						>
							<HeroMapVisual />
						</div>
					</div>
				</section>

				{/* Feature bar — single panel like mockup */}
				<section className="mb-10 sm:mb-14">
					<div className="game-panel-strong rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-5 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
							{features.map(({ icon: Icon, title, text }) => (
								<div
									key={title}
									className="flex flex-col items-center text-center sm:items-start sm:text-left gap-3 first:pt-0 py-6 sm:py-0 sm:px-4 first:sm:pl-0 last:sm:pr-0"
								>
									<div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.15)]">
										<Icon className="h-5 w-5 text-primary" />
									</div>
									<div>
										<h3 className="font-headline font-bold text-sm sm:text-base mb-1.5">
											{title}
										</h3>
										<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
											{text}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* How to play */}
				<section id="how-to-play" className="mb-10 sm:mb-14 scroll-mt-24">
					<div className="game-panel-strong rounded-2xl p-5 sm:p-8 text-center max-w-2xl mx-auto mb-8">
						<h2 className="text-xl sm:text-2xl font-headline font-bold mb-2 uppercase tracking-wide">
							How to play
						</h2>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Type a country name before the timer hits zero. Correct guesses
							glow green on the map. Clear a region, climb the board, unlock the
							next mission.
						</p>
					</div>

					<ol className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
						{[
							{ step: '01', title: 'Deploy', desc: 'Pick a region and start the clock.' },
							{ step: '02', title: 'Guess', desc: 'Name countries — the map lights up.' },
							{ step: '03', title: 'Conquer', desc: 'Submit your score and rank globally.' },
						].map(({ step, title, desc }) => (
							<li
								key={step}
								className="game-panel rounded-2xl p-4 sm:p-5 flex gap-4 items-start"
							>
								<span className="text-2xl font-headline font-bold text-primary/50 tabular-nums">
									{step}
								</span>
								<div>
									<h3 className="font-headline font-semibold mb-1">{title}</h3>
									<p className="text-xs sm:text-sm text-muted-foreground">
										{desc}
									</p>
								</div>
							</li>
						))}
					</ol>
				</section>

				{/* Regions */}
				<section className="mb-10 sm:mb-14">
					<div className="text-center mb-8">
						<h2 className="text-xl sm:text-2xl font-headline font-bold uppercase tracking-wide">
							Your path across the planet
						</h2>
						<p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
							Unlock every region to earn the ultimate Whole World challenge.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
						{regions.map((r) => {
							const Icon = r.icon;
							return (
								<article
									key={r.name}
									className="game-panel rounded-2xl p-4 sm:p-5 hover:border-primary/30 hover:shadow-[0_0_24px_hsl(var(--primary)/0.12)] transition-all group"
								>
									<div className="flex items-start gap-4">
										<div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-muted/50 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
											<Icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
										</div>
										<div className="flex-1 min-w-0 text-left">
											<div className="flex items-center justify-between gap-2 flex-wrap mb-1">
												<h3 className="font-headline font-bold text-base sm:text-lg">
													{r.name}
												</h3>
												<span
													className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${r.statusClass}`}
												>
													{r.status}
												</span>
											</div>
											<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
												{r.desc}
											</p>
										</div>
									</div>
									{r.href && (
										<Button
											asChild
											variant="outline"
											size="sm"
											className="w-full mt-4 game-panel border-accent/30 hover:bg-accent/10"
										>
											<a
												href={r.href}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Coffee className="mr-2 h-4 w-4 text-accent" />
												Support on Buy Me a Coffee
											</a>
										</Button>
									)}
								</article>
							);
						})}
					</div>

					<div className="game-panel-strong rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 border border-accent/25">
						<div className="h-14 w-14 rounded-2xl bg-accent/15 border border-accent/35 flex items-center justify-center shrink-0 shadow-[0_0_20px_hsl(var(--accent)/0.2)]">
							<Globe2 className="h-8 w-8 text-accent" />
						</div>
						<div className="flex-1 text-center sm:text-left">
							<div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
								<Crown className="h-4 w-4 text-accent" />
								<span className="font-headline font-bold text-lg">
									Whole World
								</span>
								<Badge
									variant="outline"
									className="text-[10px] border-accent/40 text-accent uppercase"
								>
									Ultimate
								</Badge>
							</div>
							<p className="text-sm text-muted-foreground">
								Sign in + unlock Americas &amp; Africa — then deploy the
								12-minute planet-wide run.
							</p>
						</div>
						<Button
							asChild
							className="shrink-0 game-cta w-full sm:w-auto"
						>
							<Link href="/play">Aim for it</Link>
						</Button>
					</div>
				</section>

				{/* BMC */}
				<section className="game-panel-strong rounded-3xl p-6 sm:p-10 text-center overflow-hidden relative mb-10">
					<div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
					<div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
					<div className="relative z-10">
						<div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 border border-accent/40 mb-4">
							<Coffee className="h-6 w-6 text-accent" />
						</div>
						<h2 className="text-xl sm:text-2xl font-headline font-bold mb-2 uppercase">
							Fuel the map
						</h2>
						<p className="text-sm text-muted-foreground max-w-lg mx-auto mb-6 leading-relaxed">
							Unlock <strong className="text-foreground">The Americas</strong> or{' '}
							<strong className="text-foreground">Africa</strong> with a $
							{BMC_MIN_SUPPORT_USD}+ support on{' '}
							<a
								href={BMC_PROFILE_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="text-accent underline font-medium"
							>
								Buy Me a Coffee
							</a>
							. Sign in, copy your unlock code from the game, paste when you pay.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Button
								asChild
								size="lg"
								className="bg-accent hover:bg-accent/90 text-accent-foreground h-11"
							>
								<a
									href={BMC_PROFILE_URL}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Coffee className="mr-2 h-5 w-5" />
									@positivwarrior
								</a>
							</Button>
							<Button
								asChild
								size="lg"
								variant="outline"
								className="game-panel h-11"
							>
								<Link href="/play">Try Europe — free</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Footer stats */}
				<section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
					{footerStats.map(({ icon: Icon, value, label }) => (
						<div
							key={label}
							className="game-panel rounded-xl py-4 px-3 text-center"
						>
							<Icon className="h-5 w-5 text-primary mx-auto mb-2" />
							<p className="font-headline font-bold text-lg text-foreground">
								{value}
							</p>
							<p className="text-[10px] uppercase tracking-wider text-muted-foreground">
								{label}
							</p>
						</div>
					))}
				</section>

				<footer className="game-panel rounded-2xl px-4 py-4 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
					<span className="flex items-center gap-1.5">
						<LogIn className="h-4 w-4 text-secondary" />
						Google sign-in for Asia+
					</span>
					<span className="hidden sm:inline opacity-40">·</span>
					<AuthButton variant="ghost" size="sm" className="h-8" />
					<span className="hidden sm:inline opacity-40">·</span>
					<a
						href={BMC_PROFILE_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-accent underline transition-colors"
					>
						Buy Me a Coffee
					</a>
				</footer>
			</main>
		</MarketingShell>
	);
}
