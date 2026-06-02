'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass } from '@/components/icons';
import { AuthButton } from '@/components/auth-button';
import {
	BMC_PROFILE_URL,
	BMC_AMERICAS_URL,
	BMC_AFRICA_URL,
	BMC_MIN_SUPPORT_USD,
} from '@/lib/bmc';
import {
	Timer,
	Trophy,
	Map,
	LogIn,
	Coffee,
	Leaf,
	Mountain,
	LandPlot,
	Sun,
	ArrowRight,
	Sparkles,
	Globe2,
	Zap,
	Crown,
} from 'lucide-react';

const regions = [
	{
		icon: Leaf,
		name: 'Europe',
		status: 'Free',
		statusClass: 'bg-primary/25 text-primary border-primary/40',
		desc: 'No account — jump in and climb the leaderboard.',
		glow: 'shadow-primary/20',
	},
	{
		icon: Mountain,
		name: 'Asia & Oceania',
		status: 'Sign in',
		statusClass: 'bg-secondary/25 text-secondary border-secondary/40',
		desc: 'Free with Google — saves your name for global scores.',
		glow: 'shadow-secondary/20',
	},
	{
		icon: LandPlot,
		name: 'The Americas',
		status: `$${BMC_MIN_SUPPORT_USD}+`,
		statusClass: 'bg-accent/25 text-accent border-accent/40',
		desc: 'Unlock with Buy Me a Coffee (separate support).',
		href: BMC_AMERICAS_URL,
		glow: 'shadow-accent/20',
	},
	{
		icon: Sun,
		name: 'Africa',
		status: `$${BMC_MIN_SUPPORT_USD}+`,
		statusClass: 'bg-accent/25 text-accent border-accent/40',
		desc: 'Another support unlocks Africa on your account.',
		href: BMC_AFRICA_URL,
		glow: 'shadow-accent/20',
	},
];

const floatingPins = [
	{ label: 'FR', top: '18%', left: '48%', delay: '0s' },
	{ label: 'JP', top: '32%', left: '72%', delay: '0.4s' },
	{ label: 'BR', top: '58%', left: '32%', delay: '0.8s' },
	{ label: 'EG', top: '42%', left: '55%', delay: '1.2s' },
];

function HeroCompass() {
	return (
		<div className="relative mx-auto w-full max-w-[320px] sm:max-w-[380px] aspect-square flex items-center justify-center">
			{/* Orbit ring */}
			<div
				className="absolute inset-4 rounded-full border border-dashed border-primary/25 animate-landing-orbit"
				aria-hidden
			/>
			<div
				className="absolute inset-10 rounded-full border border-white/5 animate-landing-orbit"
				style={{ animationDirection: 'reverse', animationDuration: '32s' }}
				aria-hidden
			/>

			{/* Glow core */}
			<div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/25 blur-2xl animate-landing-pulse-glow" />

			{/* Glass compass capsule */}
			<div className="relative z-10 landing-glass-strong rounded-full p-10 sm:p-12 animate-landing-float">
				<div className="absolute inset-3 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
				<Compass className="relative w-28 h-28 sm:w-36 sm:h-36 text-primary drop-shadow-[0_0_24px_hsl(var(--primary)/0.5)]" />
			</div>

			{/* Floating country pins */}
			{floatingPins.map((pin) => (
				<div
					key={pin.label}
					className="absolute z-20 landing-glass rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider text-foreground/90 animate-landing-drift shadow-lg"
					style={{
						top: pin.top,
						left: pin.left,
						animationDelay: pin.delay,
					}}
				>
					{pin.label}
				</div>
			))}
		</div>
	);
}

export function LandingPage() {
	return (
		<div className="relative min-h-screen overflow-x-hidden">
			{/* Ambient background */}
			<div className="pointer-events-none fixed inset-0 -z-10">
				<div className="absolute -top-40 left-[10%] h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-[120px] animate-landing-drift" />
				<div
					className="absolute top-1/4 right-[5%] h-80 w-80 rounded-full bg-secondary/15 blur-[100px] animate-landing-drift"
					style={{ animationDelay: '2s' }}
				/>
				<div
					className="absolute bottom-10 left-[20%] h-64 w-64 rounded-full bg-accent/12 blur-[90px] animate-landing-drift"
					style={{ animationDelay: '4s' }}
				/>
				<div
					className="absolute inset-0 opacity-[0.035]"
					style={{
						backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
						backgroundSize: '32px 32px',
					}}
				/>
			</div>

			{/* Glass nav */}
			<header className="sticky top-0 z-50 px-4 sm:px-6 pt-4 pb-2">
				<div className="landing-glass max-w-6xl mx-auto rounded-2xl px-4 sm:px-6 py-3 grid grid-cols-[auto_1fr_auto] items-center gap-3">
					<Link
						href="/"
						className="flex items-center gap-2.5 font-headline font-bold group justify-self-start"
					>
						<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/30 group-hover:scale-105 transition-transform shadow-inner shadow-primary/10">
							<Compass className="h-6 w-6 text-primary" />
						</span>
						<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-base sm:text-lg">
							GeoGuesser
						</span>
					</Link>

					<nav className="hidden md:flex items-center justify-center gap-0.5 justify-self-center">
						<Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
							<Link href="/play">Play</Link>
						</Button>
						<Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
							<Link href="/leaderboard">Ranks</Link>
						</Button>
						<Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
							<a href={BMC_PROFILE_URL} target="_blank" rel="noopener noreferrer">
								Support
							</a>
						</Button>
					</nav>

					<div className="justify-self-end">
						<AuthButton showLabel={false} />
					</div>
				</div>
			</header>

			<main className="relative z-10 px-4 sm:px-6 pb-20 max-w-6xl mx-auto">
				{/* Hero — split layout: copy left, compass right (stacked on mobile) */}
				<section className="pt-6 sm:pt-12 pb-16 sm:pb-24">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
						{/* Copy column — always left / top */}
						<div className="order-2 lg:order-1 text-center lg:text-left space-y-6 animate-landing-fade-up">
							<div className="inline-flex items-center gap-2 rounded-full landing-glass px-4 py-2 text-sm text-primary mx-auto lg:mx-0">
								<Sparkles className="h-4 w-4 shrink-0" />
								<span>Map lights up with every correct guess</span>
							</div>

							<div className="space-y-4">
								<h1 className="text-4xl sm:text-5xl xl:text-6xl font-headline font-bold tracking-tight leading-[1.1]">
									<span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-landing-shimmer bg-[length:200%_auto]">
										Guess the world.
									</span>
									<span className="block text-foreground mt-1">Beat the clock.</span>
								</h1>
								<p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
									A geography sprint on a live world map. Start free in{' '}
									<strong className="text-foreground">Europe</strong>, unlock more
									regions as you go — and chase your name on the global board.
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
								<Button
									asChild
									size="lg"
									className="h-12 px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all"
								>
									<Link href="/play">
										Start playing
										<ArrowRight className="ml-2 h-5 w-5" />
									</Link>
								</Button>
								<Button
									asChild
									variant="outline"
									size="lg"
									className="h-12 px-8 landing-glass hover:bg-card/60"
								>
									<Link href="/leaderboard">
										<Trophy className="mr-2 h-5 w-5" />
										Leaderboard
									</Link>
								</Button>
							</div>

							{/* Quick stats */}
							<div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
								{[
									{ icon: Globe2, text: '4 regions' },
									{ icon: Timer, text: 'Timed modes' },
									{ icon: Zap, text: 'Instant feedback' },
								].map(({ icon: Icon, text }) => (
									<span
										key={text}
										className="inline-flex items-center gap-1.5 rounded-full landing-glass px-3 py-1.5 text-xs text-muted-foreground"
									>
										<Icon className="h-3.5 w-3.5 text-primary" />
										{text}
									</span>
								))}
							</div>
						</div>

						{/* Visual column — compass centerpiece */}
						<div className="order-1 lg:order-2 flex flex-col items-center gap-4 animate-landing-fade-up" style={{ animationDelay: '0.15s' }}>
							{/* Mobile: compact brand above compass */}
							<div className="lg:hidden flex items-center gap-2 mb-2">
								<Compass className="h-8 w-8 text-primary" />
								<span className="font-headline font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
									GeoGuesser
								</span>
							</div>
							<HeroCompass />
							<p className="text-xs text-muted-foreground text-center max-w-[240px] landing-glass rounded-full px-4 py-2">
								Countries you name glow green on the map
							</p>
						</div>
					</div>
				</section>

				{/* Features — glass bento */}
				<section className="mb-16 sm:mb-20">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						{[
							{
								icon: Map,
								title: 'Live map',
								text: 'Every correct guess highlights the country — mistakes stay subtle.',
								span: '',
							},
							{
								icon: Timer,
								title: 'Timed modes',
								text: 'From a 6-minute Europe sprint to longer continental marathons.',
								span: 'sm:translate-y-4',
							},
							{
								icon: Trophy,
								title: 'Global ranks',
								text: 'Submit your run and see how you compare worldwide.',
								span: '',
							},
						].map(({ icon: Icon, title, text, span }, i) => (
							<Card
								key={title}
								className={`landing-glass border-white/10 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group ${span}`}
								style={{ animationDelay: `${0.1 * i}s` }}
							>
								<CardContent className="pt-6 pb-6 flex flex-col gap-4">
									<div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
										<Icon className="h-6 w-6 text-primary" />
									</div>
									<div>
										<h3 className="font-headline font-semibold text-lg mb-1">{title}</h3>
										<p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				{/* Regions */}
				<section className="mb-16 sm:mb-20">
					<div className="text-center mb-10 landing-glass rounded-2xl py-8 px-6 max-w-2xl mx-auto">
						<h2 className="text-2xl sm:text-3xl font-headline font-bold mb-2">
							Your path across the planet
						</h2>
						<p className="text-muted-foreground text-sm sm:text-base">
							Unlock every region to earn the ultimate Whole World challenge — 12
							minutes, every country.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
						{regions.map((r, i) => {
							const Icon = r.icon;
							return (
								<Card
									key={r.name}
									className={`landing-glass overflow-hidden hover:shadow-xl ${r.glow} hover:-translate-y-0.5 transition-all duration-300 group`}
									style={{ animationDelay: `${i * 0.08}s` }}
								>
									<CardHeader className="flex flex-row items-start gap-4 pb-2">
										<div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-muted/80 to-card/50 border border-white/10 flex items-center justify-center shrink-0 group-hover:rotate-3 transition-transform">
											<Icon className="h-7 w-7 text-primary" />
										</div>
										<div className="flex-1 text-left min-w-0">
											<div className="flex items-center justify-between gap-2 flex-wrap">
												<CardTitle className="text-lg font-headline">{r.name}</CardTitle>
												<span
													className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${r.statusClass}`}
												>
													{r.status}
												</span>
											</div>
											<CardDescription className="mt-2 text-sm leading-relaxed">
												{r.desc}
											</CardDescription>
										</div>
									</CardHeader>
									{r.href && (
										<CardContent className="pt-0 pb-5">
											<Button
												asChild
												variant="outline"
												size="sm"
												className="w-full landing-glass border-accent/30 hover:bg-accent/10"
											>
												<a href={r.href} target="_blank" rel="noopener noreferrer">
													<Coffee className="mr-2 h-4 w-4 text-accent" />
													Support on Buy Me a Coffee
												</a>
											</Button>
										</CardContent>
									)}
								</Card>
							);
						})}
					</div>

					<div className="landing-glass-strong rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 border border-accent/20">
						<div className="h-14 w-14 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
							<Globe2 className="h-8 w-8 text-accent" />
						</div>
						<div className="flex-1 text-center sm:text-left">
							<div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
								<Crown className="h-4 w-4 text-accent" />
								<span className="font-headline font-bold text-lg">Whole World</span>
								<Badge variant="outline" className="text-[10px] border-accent/40 text-accent">
									Ultimate
								</Badge>
							</div>
							<p className="text-sm text-muted-foreground">
								Sign in + unlock Americas &amp; Africa — then deploy the 12-minute
								planet-wide run in-game.
							</p>
						</div>
						<Button asChild variant="outline" className="shrink-0 landing-glass border-accent/30">
							<Link href="/play">Aim for it</Link>
						</Button>
					</div>
				</section>

				{/* BMC CTA — glass panel with motion */}
				<section className="relative landing-glass-strong rounded-3xl p-8 sm:p-12 text-center overflow-hidden">
					<div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-accent/20 blur-3xl animate-landing-pulse-glow" />
					<div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-primary/20 blur-3xl animate-landing-pulse-glow" style={{ animationDelay: '2s' }} />

					<div className="relative z-10">
						<div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 border border-accent/40 mb-5 mx-auto">
							<Coffee className="h-7 w-7 text-accent" />
						</div>
						<h2 className="text-2xl sm:text-3xl font-headline font-bold mb-3">
							Fuel the map — unlock a continent
						</h2>
						<p className="text-muted-foreground max-w-lg mx-auto mb-8 text-sm sm:text-base leading-relaxed">
							Unlock <strong className="text-foreground">The Americas</strong> or{' '}
							<strong className="text-foreground">Africa</strong> with a ${BMC_MIN_SUPPORT_USD}+
							support on{' '}
							<a
								href={BMC_PROFILE_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="text-accent underline font-medium hover:text-accent/80"
							>
								Buy Me a Coffee
							</a>
							. Sign in, copy your unlock code from the game, paste it when you pay.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Button
								asChild
								size="lg"
								className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/25 hover:scale-[1.02] transition-transform"
							>
								<a href={BMC_PROFILE_URL} target="_blank" rel="noopener noreferrer">
									<Coffee className="mr-2 h-5 w-5" />
									@positivwarrior
								</a>
							</Button>
							<Button asChild size="lg" variant="outline" className="landing-glass">
								<Link href="/play">Try Europe — it&apos;s free</Link>
							</Button>
						</div>
					</div>
				</section>

				<footer className="mt-14 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground landing-glass rounded-full px-6 py-4 max-w-md mx-auto">
					<span className="flex items-center gap-1.5">
						<LogIn className="h-4 w-4 text-secondary" />
						Google sign-in for Asia+
					</span>
					<span className="hidden sm:inline text-border">·</span>
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
		</div>
	);
}
