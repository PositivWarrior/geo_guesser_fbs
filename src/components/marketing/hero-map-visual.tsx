'use client';

import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Check, Crosshair, Timer, Target } from 'lucide-react';
import { isHeroMapHighlighted } from '@/lib/hero-map-highlight';

const GEO_URL = 'https://unpkg.com/world-atlas@2/countries-110m.json';

const MAP_WIDTH = 560;
const MAP_HEIGHT = 320;

/** Decorative hero map — real world outlines + dot-matrix fill (mockup style) */
export function HeroMapVisual() {
	const projectionConfig = useMemo(
		() => ({ scale: 100, center: [10, 15] as [number, number] }),
		[],
	);

	return (
		<div className="relative w-full max-w-[min(100%,520px)] mx-auto">
			<div className="relative rounded-3xl game-panel-strong overflow-hidden border border-primary/25 shadow-[0_0_48px_hsl(var(--primary)/0.12)] bg-[#060d14]">
				{/* HUD row — inside map frame like mockup */}
				<div className="relative z-20 flex gap-1.5 sm:gap-2 p-2 sm:p-3 border-b border-white/5 bg-[#080f18]/90 backdrop-blur-sm">
					<HudCard
						icon={<Crosshair className="h-3.5 w-3.5 text-primary" />}
						label="Active Mission"
						value="Europe"
						progress={18}
						total={53}
						className="flex-1 min-w-0"
					/>
					<HudCard
						icon={<Timer className="h-3.5 w-3.5 text-accent drop-shadow-[0_0_6px_hsl(var(--accent))]" />}
						label="Time Left"
						value="05:58"
						accent
						className="shrink-0"
					/>
					<HudCard
						icon={<Target className="h-3.5 w-3.5 text-primary" />}
						label="Found"
						value="18 / 53"
						className="shrink-0 hidden min-[360px]:block"
					/>
				</div>

				{/* Map canvas */}
				<div className="relative aspect-[7/4] sm:aspect-[16/10] w-full">
					<div className="game-grid absolute inset-0 opacity-60 pointer-events-none" />
					<div className="absolute inset-0 bg-gradient-to-t from-[#060d14] via-transparent to-[#0a121c]/50 pointer-events-none z-[1]" />

					<ComposableMap
						width={MAP_WIDTH}
						height={MAP_HEIGHT}
						projection="geoMercator"
						projectionConfig={projectionConfig}
						className="absolute inset-0 w-full h-full z-[2]"
						style={{ width: '100%', height: '100%' }}
					>
						<defs>
							<pattern
								id="hero-dots-dim"
								width="4"
								height="4"
								patternUnits="userSpaceOnUse"
							>
								<circle
									cx="2"
									cy="2"
									r="0.65"
									fill="hsl(215 22% 28%)"
									opacity="0.85"
								/>
							</pattern>
							<pattern
								id="hero-dots-lit"
								width="3.5"
								height="3.5"
								patternUnits="userSpaceOnUse"
							>
								<circle
									cx="1.75"
									cy="1.75"
									r="1.1"
									fill="hsl(145 85% 48%)"
								/>
							</pattern>
							<filter id="hero-land-glow" x="-20%" y="-20%" width="140%" height="140%">
								<feGaussianBlur stdDeviation="1.2" result="blur" />
								<feMerge>
									<feMergeNode in="blur" />
									<feMergeNode in="SourceGraphic" />
								</feMerge>
							</filter>
							<radialGradient id="hero-radar-fade" cx="50%" cy="50%" r="50%">
								<stop offset="0%" stopColor="hsl(145 80% 45% / 0.35)" />
								<stop offset="70%" stopColor="hsl(145 80% 45% / 0.08)" />
								<stop offset="100%" stopColor="transparent" />
							</radialGradient>
						</defs>

						<Geographies geography={GEO_URL}>
							{({ geographies }) =>
								geographies.map((geo) => {
									const lit = isHeroMapHighlighted(geo);
									return (
										<Geography
											key={geo.rsmKey}
											geography={geo}
											fill={lit ? 'url(#hero-dots-lit)' : 'url(#hero-dots-dim)'}
											stroke={lit ? 'hsl(145 80% 55% / 0.35)' : 'hsl(215 25% 18%)'}
											strokeWidth={lit ? 0.25 : 0.15}
											style={{
												default: {
													outline: 'none',
													filter: lit
														? 'url(#hero-land-glow) drop-shadow(0 0 4px hsl(145 90% 50% / 0.5))'
														: 'none',
												},
												hover: { outline: 'none', cursor: 'default' },
												pressed: { outline: 'none' },
											}}
										/>
									);
								})
							}
						</Geographies>

						{/* Radar rings over Europe (~10°E, 50°N in this projection) */}
						<g transform="translate(255, 112)" pointerEvents="none">
							<circle r="52" fill="url(#hero-radar-fade)" className="animate-landing-pulse-glow" />
							<circle
								r="52"
								fill="none"
								stroke="hsl(145 70% 45% / 0.25)"
								strokeWidth="0.5"
								strokeDasharray="3 4"
							/>
							<circle
								r="36"
								fill="none"
								stroke="hsl(145 70% 45% / 0.2)"
								strokeWidth="0.4"
							/>
						</g>
					</ComposableMap>

					{/* CSS radar sweep */}
					<div
						className="absolute z-[3] w-[38%] max-w-[200px] aspect-square pointer-events-none animate-game-radar"
						style={{ top: '18%', left: '42%' }}
						aria-hidden
					>
						<div className="absolute inset-0 rounded-full border border-primary/20" />
						<div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] origin-left -translate-y-1/2 bg-gradient-to-r from-primary via-primary/60 to-transparent shadow-[0_0_8px_hsl(var(--primary))]" />
						<div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 -translate-y-full origin-bottom-left bg-gradient-to-t from-primary/25 to-transparent rounded-tl-full" />
					</div>
				</div>

				{/* Success toast — bottom left like mockup */}
				<div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 flex items-center gap-2.5 game-panel px-3 py-2.5 border-primary/45 shadow-[0_0_24px_hsl(var(--primary)/0.25)] max-w-[240px] pointer-events-none">
					<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 border border-primary/50 shrink-0">
						<Check className="h-4 w-4 text-primary stroke-[3]" />
					</span>
					<div className="min-w-0">
						<p className="text-sm font-bold text-foreground leading-tight">
							Germany
						</p>
						<p className="text-xs text-primary font-semibold">
							Correct! +100 pts
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function HudCard({
	icon,
	label,
	value,
	progress,
	total,
	accent,
	className = '',
}: {
	icon: ReactNode;
	label: string;
	value: string;
	progress?: number;
	total?: number;
	accent?: boolean;
	className?: string;
}) {
	const pct =
		progress != null && total != null && total > 0
			? Math.round((progress / total) * 100)
			: null;

	return (
		<div
			className={`rounded-xl bg-[#0c1520]/90 border border-white/10 px-2.5 py-2 text-left ${accent ? 'border-accent/25' : ''} ${className}`}
		>
			<div className="flex items-center gap-1 mb-0.5">
				{icon}
				<span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-muted-foreground font-semibold truncate">
					{label}
				</span>
			</div>
			<p
				className={`text-xs sm:text-sm font-bold font-headline leading-none truncate ${accent ? 'text-accent tabular-nums' : 'text-foreground'}`}
			>
				{value}
			</p>
			{pct != null && (
				<div className="mt-1.5 flex items-center gap-1.5">
					<div className="flex-1 h-1 rounded-full bg-muted/40 overflow-hidden min-w-0">
						<div
							className="h-full rounded-full bg-gradient-to-r from-secondary to-primary shadow-[0_0_6px_hsl(var(--primary)/0.6)]"
							style={{ width: `${pct}%` }}
						/>
					</div>
					<span className="text-[9px] text-muted-foreground tabular-nums shrink-0">
						{progress}/{total}
					</span>
				</div>
			)}
		</div>
	);
}
