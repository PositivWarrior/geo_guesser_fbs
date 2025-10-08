'use server';
import { shouldPauseTimer } from '@/ai/flows/dynamic-challenge-timer-control';
import type { Country } from '@/lib/types';

export async function checkPauseAbility(isChallengeMode: boolean) {
	try {
		const result = await shouldPauseTimer({
			challengeEnabled: isChallengeMode,
		});
		return result;
	} catch (error) {
		console.error('AI flow error:', error);
		// In case of an AI error, default to allowing the pause to not disrupt the user experience.
		return { pauseTimer: true };
	}
}

async function fetchCountries(url: string): Promise<Country[]> {
	const response = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (!response.ok) {
		throw new Error(`Failed to fetch countries: ${response.statusText}`);
	}
	const data = await response.json();
	return data.map((country: any) => ({
		name: country.name,
		cca2: country.cca2,
		cca3: country.cca3,
		region: country.region,
		subregion: country.subregion,
		translations: country.translations,
		demonyms: country.demonyms,
		guessed: false,
	}));
}

export async function getCountriesByRegion(region: string): Promise<Country[]> {
	if (region === 'all-world') {
		return await fetchCountries('https://restcountries.com/v3.1/all');
	}
	if (region === 'asia-oceania') {
		const asia = await fetchCountries(
			'https://restcountries.com/v3.1/region/asia',
		);
		const oceania = await fetchCountries(
			'https://restcountries.com/v3.1/region/oceania',
		);
		return [...asia, ...oceania];
	}

	const validRegions = ['africa', 'americas', 'europe'];
	if (validRegions.includes(region)) {
		return await fetchCountries(
			`https://restcountries.com/v3.1/region/${region}`,
		);
	}

	throw new Error(`Invalid region: ${region}`);
}
