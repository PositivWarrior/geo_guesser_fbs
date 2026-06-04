import { normalizeString } from '@/lib/game-logic';

/** Country names as they appear in world-atlas@2 countries-110m (Natural Earth) */
const LIT_COUNTRY_NAMES = [
	// Europe
	'Albania',
	'Andorra',
	'Austria',
	'Belarus',
	'Belgium',
	'Bosnia and Herz.',
	'Bulgaria',
	'Croatia',
	'Cyprus',
	'Czechia',
	'Czech Rep.',
	'Czech Republic',
	'Denmark',
	'Estonia',
	'Finland',
	'France',
	'Germany',
	'Greece',
	'Hungary',
	'Iceland',
	'Ireland',
	'Italy',
	'Kosovo',
	'Latvia',
	'Liechtenstein',
	'Lithuania',
	'Luxembourg',
	'Macedonia',
	'North Macedonia',
	'Malta',
	'Moldova',
	'Monaco',
	'Montenegro',
	'Netherlands',
	'Norway',
	'Poland',
	'Portugal',
	'Romania',
	'Russia',
	'Serbia',
	'Slovakia',
	'Slovenia',
	'Spain',
	'Sweden',
	'Switzerland',
	'Ukraine',
	'United Kingdom',
	// Other highlighted regions (mockup — selective glow, not whole continents)
	'Brazil',
	'China',
	'Australia',
	'Japan',
];

const LIT_NORMALIZED = new Set(
	LIT_COUNTRY_NAMES.map((n) => normalizeString(n)),
);

export function getGeoDisplayName(geo: {
	properties?: Record<string, string | undefined>;
}): string | undefined {
	const props = geo.properties ?? {};
	return (
		props.NAME ||
		props.NAME_LONG ||
		props.ADMIN ||
		props.name ||
		props.name_long
	);
}

export function isHeroMapHighlighted(geo: {
	properties?: Record<string, string | undefined>;
}): boolean {
	const name = getGeoDisplayName(geo);
	if (!name) return false;
	return LIT_NORMALIZED.has(normalizeString(name));
}
