/** Buy Me a Coffee — https://buymeacoffee.com/positivwarrior */

export const BMC_PROFILE_URL = 'https://buymeacoffee.com/positivwarrior';

/** Optional dedicated Extra URLs (create in BMC dashboard → Extras) */
export const BMC_AMERICAS_URL =
	process.env.NEXT_PUBLIC_BMC_AMERICAS_URL ?? BMC_PROFILE_URL;
export const BMC_AFRICA_URL =
	process.env.NEXT_PUBLIC_BMC_AFRICA_URL ?? BMC_PROFILE_URL;

export const BMC_MIN_SUPPORT_USD = Number(
	process.env.NEXT_PUBLIC_BMC_MIN_SUPPORT_USD ?? '3',
);

export type PaidRegion = 'americas' | 'africa';

/** Paste this into the BMC “message” field so the webhook can match payment → account */
export function buildUnlockNote(uid: string, region: PaidRegion): string {
	return `geo:${uid}:${region}`;
}

export function getBmcUrlForRegion(region: PaidRegion): string {
	return region === 'americas' ? BMC_AMERICAS_URL : BMC_AFRICA_URL;
}

export function getRegionDisplayName(region: PaidRegion): string {
	return region === 'americas' ? 'The Americas' : 'Africa';
}
