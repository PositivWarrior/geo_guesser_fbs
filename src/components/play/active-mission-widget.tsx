'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getScores } from '@/lib/scores';
import { Gem, Zap } from 'lucide-react';

const GOAL = 10;

export function ActiveMissionWidget() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const europeRuns = getScores().filter((s) => s.continentId === 'europe');
		if (europeRuns.length === 0) {
			setProgress(0);
			return;
		}
		setProgress(
			Math.min(GOAL, Math.max(...europeRuns.map((r) => r.score))),
		);
	}, []);

	const pct = Math.round((progress / GOAL) * 100);

	return (
		<Link
			href="/play/missions"
			className="game-panel rounded-xl p-3 sm:p-4 border-primary/20 w-full sm:max-w-[280px] shrink-0 block hover:border-primary/40 transition-colors"
		>
			<p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
				Active Mission
			</p>
			<p className="text-xs sm:text-sm font-semibold text-foreground leading-snug mb-2">
				Name {GOAL} countries in Europe
			</p>
			<div className="flex items-center gap-2 mb-2">
				<div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden">
					<div
						className="h-full rounded-full bg-gradient-to-r from-secondary to-primary"
						style={{ width: `${pct}%` }}
					/>
				</div>
				<span className="text-[10px] font-bold tabular-nums text-primary">
					{progress}/{GOAL}
				</span>
			</div>
			<p className="text-[10px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
				<span className="inline-flex items-center gap-0.5 text-accent">
					<Zap className="h-3 w-3" />
					500 XP
				</span>
				<span>+</span>
				<span className="inline-flex items-center gap-0.5 text-primary">
					<Gem className="h-3 w-3" />
					100 Gems
				</span>
			</p>
		</Link>
	);
}
