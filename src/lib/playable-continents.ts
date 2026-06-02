import { continents, type Continent } from '@/lib/continents';

export const standardContinents: Continent[] = continents.filter(
	(c) => c.id !== 'all-world',
);

export const ultimateContinent: Continent =
	continents.find((c) => c.id === 'all-world')!;

/** @deprecated Use standardContinents — kept for imports */
export const playableContinents = standardContinents;
