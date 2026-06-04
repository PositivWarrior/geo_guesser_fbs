'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlaySubpage } from '@/components/play/play-subpage';
import { getScores } from '@/lib/scores';
import { Gem, Zap, Target, ChevronRight } from 'lucide-react';

const MISSIONS = [
	{
		id: 'europe-10',
		title: 'Name 10 countries in Europe',
		region: 'europe',
		goal: 10,
		xp: 500,
		gems: 100,
	},
	{
		id: 'europe-perfect',
		title: 'Clear Europe with 90%+ accuracy',
		region: 'europe',
		goal: 1,
		xp: 800,
		gems: 150,
		check: (scores: ReturnType<typeof getScores>) =>
			scores.some(
				(s) =>
					s.continentId === 'europe' &&
					s.score / s.total >= 0.9,
			),
	},
	{
		id: 'asia-signin',
		title: 'Deploy Asia & Oceania (sign in required)',
		region: 'asia-oceania',
		goal: 1,
		xp: 600,
		gems: 120,
		check: (scores: ReturnType<typeof getScores>) =>
			scores.some((s) => s.continentId === 'asia-oceania'),
	},
];

export default function MissionsPage() {
	const [scores, setScores] = useState<ReturnType<typeof getScores>>([]);

	useEffect(() => {
		setScores(getScores());
	}, []);

	return (
		<PlaySubpage
			title="Active"
			titleAccent="missions"
			subtitle="Complete objectives to earn XP and gems."
		>
			<div className="space-y-3">
				{MISSIONS.map((m) => {
					const regionRuns = scores.filter((s) => s.continentId === m.region);
					let progress = 0;
					let done = false;

					if (m.id === 'europe-10') {
						progress = regionRuns.length
							? Math.min(m.goal, Math.max(...regionRuns.map((r) => r.score)))
							: 0;
						done = progress >= m.goal;
					} else if (m.check) {
						done = m.check(scores);
						progress = done ? m.goal : 0;
					}

					const pct = Math.round((progress / m.goal) * 100);

					return (
						<div
							key={m.id}
							className="game-panel rounded-2xl p-4 sm:p-5 border-white/10"
						>
							<div className="flex items-start gap-3">
								<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 border border-primary/30">
									<Target className="h-5 w-5 text-primary" />
								</span>
								<div className="flex-1 min-w-0">
									<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
										{done ? 'Complete' : 'In progress'}
									</p>
									<p className="font-semibold text-foreground mb-3">
										{m.title}
									</p>
									<div className="flex items-center gap-2 mb-2">
										<div className="flex-1 h-2 rounded-full bg-muted/40 overflow-hidden">
											<div
												className="h-full rounded-full bg-gradient-to-r from-secondary to-primary"
												style={{ width: `${pct}%` }}
											/>
										</div>
										<span className="text-xs font-bold text-primary tabular-nums">
											{progress}/{m.goal}
										</span>
									</div>
									<p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
										<span className="inline-flex items-center gap-1 text-accent">
											<Zap className="h-3 w-3" />
											{m.xp} XP
										</span>
										<span className="inline-flex items-center gap-1 text-primary">
											<Gem className="h-3 w-3" />
											{m.gems} Gems
										</span>
									</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<Button asChild className="mt-6 game-cta">
				<Link href="/play">
					Back to arenas
					<ChevronRight className="ml-2 h-4 w-4" />
				</Link>
			</Button>
		</PlaySubpage>
	);
}
