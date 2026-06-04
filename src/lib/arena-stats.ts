import { getScores } from '@/lib/scores';
import { formatBestTime } from '@/lib/arena-meta';

export type ArenaPersonalStats = {
	bestTime: string | null;
	accuracy: string | null;
	plays: number;
};

export function getArenaPersonalStats(continentId: string): ArenaPersonalStats {
	const runs = getScores().filter((s) => s.continentId === continentId);
	if (runs.length === 0) {
		return { bestTime: null, accuracy: null, plays: 0 };
	}

	let bestRun = runs[0];
	let bestAccuracy = runs[0].score / runs[0].total;

	for (const run of runs) {
		const acc = run.score / run.total;
		if (
			acc > bestAccuracy ||
			(acc === bestAccuracy && run.timeTaken < bestRun.timeTaken)
		) {
			bestRun = run;
			bestAccuracy = acc;
		}
	}

	const perfectRuns = runs.filter((r) => r.score === r.total);
	const bestTimeRun =
		perfectRuns.length > 0
			? perfectRuns.reduce((a, b) =>
					a.timeTaken < b.timeTaken ? a : b,
				)
			: bestRun;

	return {
		bestTime: formatBestTime(bestTimeRun.timeTaken),
		accuracy: `${Math.round(bestAccuracy * 100)}%`,
		plays: runs.length,
	};
}

/** Lightweight player level from local run history */
export function getPlayerProgress(): {
	level: number;
	rank: string;
	xp: number;
	xpToNext: number;
} {
	const runs = getScores();
	const totalGuessed = runs.reduce((sum, r) => sum + r.score, 0);
	const level = Math.min(
		99,
		Math.max(1, 1 + Math.floor(totalGuessed / 50) + runs.length),
	);
	const xpToNext = 4000;
	const xp = Math.min(
		xpToNext - 1,
		400 + totalGuessed * 12 + runs.length * 80,
	);
	const ranks = [
		'Rookie',
		'Explorer',
		'Navigator',
		'Cartographer',
		'Globetrotter',
		'Master',
	];
	const rank = ranks[Math.min(ranks.length - 1, Math.floor((level - 1) / 5))];

	return { level, rank, xp, xpToNext };
}
