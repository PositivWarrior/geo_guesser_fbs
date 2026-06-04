'use client';

import { useEffect, useState } from 'react';
import { PlaySubpage } from '@/components/play/play-subpage';
import { getScores } from '@/lib/scores';
import { Award, Lock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACHIEVEMENTS = [
	{
		id: 'first-blood',
		title: 'First guess',
		desc: 'Complete any region run.',
		check: (s: ReturnType<typeof getScores>) => s.length >= 1,
	},
	{
		id: 'europe-rider',
		title: 'Euro trip',
		desc: 'Play Europe at least 3 times.',
		check: (s: ReturnType<typeof getScores>) =>
			s.filter((r) => r.continentId === 'europe').length >= 3,
	},
	{
		id: 'speedster',
		title: 'Speedster',
		desc: 'Finish a run with 80%+ accuracy.',
		check: (s: ReturnType<typeof getScores>) =>
			s.some((r) => r.score / r.total >= 0.8),
	},
	{
		id: 'globetrotter',
		title: 'Globetrotter',
		desc: 'Play 3 different regions.',
		check: (s: ReturnType<typeof getScores>) =>
			new Set(s.map((r) => r.continentId)).size >= 3,
	},
	{
		id: 'perfectionist',
		title: 'Perfectionist',
		desc: '100% accuracy on any run.',
		check: (s: ReturnType<typeof getScores>) =>
			s.some((r) => r.score === r.total && r.total > 0),
	},
	{
		id: 'world-dreamer',
		title: 'World dreamer',
		desc: 'Unlock and play Whole World.',
		check: (s: ReturnType<typeof getScores>) =>
			s.some((r) => r.continentId === 'all-world'),
	},
];

export default function AchievementsPage() {
	const [scores, setScores] = useState<ReturnType<typeof getScores>>([]);

	useEffect(() => {
		setScores(getScores());
	}, []);

	const unlocked = ACHIEVEMENTS.filter((a) => a.check(scores)).length;

	return (
		<PlaySubpage
			title="Your"
			titleAccent="achievements"
			subtitle={`${unlocked} of ${ACHIEVEMENTS.length} unlocked — keep exploring.`}
		>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{ACHIEVEMENTS.map((a) => {
					const met = a.check(scores);
					return (
						<div
							key={a.id}
							className={cn(
								'game-panel rounded-2xl p-4 flex gap-3 border',
								met
									? 'border-primary/40 bg-primary/5'
									: 'border-white/10 opacity-80',
							)}
						>
							<span
								className={cn(
									'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border',
									met
										? 'bg-primary/20 border-primary/40 text-primary'
										: 'bg-muted/30 border-white/10 text-muted-foreground',
								)}
							>
								{met ? (
									<Check className="h-6 w-6" />
								) : (
									<Lock className="h-5 w-5" />
								)}
							</span>
							<div>
								<div className="flex items-center gap-2 mb-0.5">
									<Award
										className={cn(
											'h-4 w-4',
											met ? 'text-accent' : 'text-muted-foreground',
										)}
									/>
									<h3 className="font-headline font-bold text-sm">
										{a.title}
									</h3>
								</div>
								<p className="text-xs text-muted-foreground">{a.desc}</p>
							</div>
						</div>
					);
				})}
			</div>
		</PlaySubpage>
	);
}
