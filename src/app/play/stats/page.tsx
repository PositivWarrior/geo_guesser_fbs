'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaySubpage } from '@/components/play/play-subpage';
import { getScores, clearScores, type StoredScore } from '@/lib/scores';
import { getArenaPersonalStats } from '@/lib/arena-stats';
import { standardContinents } from '@/lib/playable-continents';
import { formatBestTime } from '@/lib/arena-meta';
import { getPlayerProgress } from '@/lib/arena-stats';

export default function StatsPage() {
	const [scores, setScores] = useState<StoredScore[]>([]);
	const { level, rank, xp, xpToNext } = getPlayerProgress();

	useEffect(() => {
		setScores(getScores());
	}, []);

	const totalGuessed = scores.reduce((s, r) => s + r.score, 0);
	const totalRuns = scores.length;

	return (
		<PlaySubpage
			title="Player"
			titleAccent="stats"
			subtitle="Progress on this device from your saved runs."
		>
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
				{[
					{ label: 'Level', value: String(level) },
					{ label: 'Rank', value: rank },
					{ label: 'Total runs', value: String(totalRuns) },
					{ label: 'Countries named', value: String(totalGuessed) },
				].map(({ label, value }) => (
					<div key={label} className="game-panel rounded-xl p-3 text-center">
						<p className="text-[10px] uppercase tracking-wider text-muted-foreground">
							{label}
						</p>
						<p className="font-headline font-bold text-lg text-foreground mt-1 truncate">
							{value}
						</p>
					</div>
				))}
			</div>

			<div className="game-panel rounded-xl p-4 mb-6">
				<p className="text-xs text-muted-foreground mb-2">XP progress</p>
				<div className="h-2 rounded-full bg-muted/40 overflow-hidden">
					<div
						className="h-full bg-primary rounded-full"
						style={{
							width: `${Math.min(100, Math.round((xp / xpToNext) * 100))}%`,
						}}
					/>
				</div>
				<p className="text-xs text-muted-foreground mt-1 tabular-nums">
					{xp.toLocaleString()} / {xpToNext.toLocaleString()} XP
				</p>
			</div>

			<h2 className="font-headline font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
				By region
			</h2>
			<div className="space-y-2 mb-6">
				{standardContinents.map((c) => {
					const st = getArenaPersonalStats(c.id);
					return (
						<div
							key={c.id}
							className="game-panel rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-2"
						>
							<span className="font-medium">{c.name}</span>
							<span className="text-xs text-muted-foreground tabular-nums">
								{st.plays} runs · Best {st.bestTime ?? '—'} · Acc{' '}
								{st.accuracy ?? '—'}
							</span>
						</div>
					);
				})}
			</div>

			<h2 className="font-headline font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
				Recent runs
			</h2>
			<div className="game-panel rounded-2xl overflow-hidden mb-4">
				{scores.length === 0 ? (
					<p className="p-6 text-center text-sm text-muted-foreground">
						No runs yet.{' '}
						<Link href="/play" className="text-primary underline">
							Play an arena
						</Link>
					</p>
				) : (
					<ul className="divide-y divide-white/10">
						{scores.slice(0, 15).map((s) => (
							<li
								key={s.id}
								className="px-4 py-3 flex flex-wrap justify-between gap-2 text-sm"
							>
								<span>{s.continentName}</span>
								<span className="text-muted-foreground tabular-nums">
									{s.score}/{s.total} · {formatBestTime(s.timeTaken)}
								</span>
							</li>
						))}
					</ul>
				)}
			</div>

			<div className="flex flex-wrap gap-2">
				<Button
					variant="outline"
					className="game-panel"
					onClick={() => setScores(getScores())}
				>
					Refresh
				</Button>
				<Button
					variant="destructive"
					onClick={() => {
						clearScores();
						setScores([]);
					}}
				>
					Clear local stats
				</Button>
			</div>
		</PlaySubpage>
	);
}
