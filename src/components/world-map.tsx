'use client';

import { useState, useMemo, useCallback } from 'react';
import { normalizeString } from '@/lib/game-logic';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { type Country } from '@/lib/types';

interface WorldMapProps {
	countries: Country[];
	onCountryHover?: (countryName: string | null) => void;
	region?: string | null;
}

const geoUrl = 'https://unpkg.com/world-atlas@2/countries-110m.json';

export function WorldMap({
	countries,
	onCountryHover,
	region = 'all-world',
}: WorldMapProps) {
	const [tooltipContent, setTooltipContent] = useState<string | null>(null);
	const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

	// Removed verbose debug logging for production UI

	// Create a Map for faster lookups - recreated when countries change
	const countriesMap = useMemo(() => {
		const map = {
			byCca2: new Map<string, Country>(),
			byCca3: new Map<string, Country>(),
			byName: new Map<string, Country>(),
		};
		countries.forEach((country) => {
			map.byCca2.set(
				country.cca2?.toUpperCase?.() || country.cca2,
				country,
			);
			map.byCca3.set(
				country.cca3?.toUpperCase?.() || country.cca3,
				country,
			);

			const pushName = (n?: string) => {
				if (!n) return;
				const key = normalizeString(n);
				if (!map.byName.has(key)) map.byName.set(key, country);
			};
			pushName(country.name.common);
			pushName(country.name.official);
			// Include translations for robust matching
			Object.values(country.translations || {}).forEach((t: any) => {
				pushName(t?.common);
				pushName(t?.official);
			});
			// Include demonyms
			if (country.demonyms) {
				Object.values(country.demonyms).forEach((d: any) => {
					pushName(d?.m);
					pushName(d?.f);
				});
			}
			// Common abbreviations and variants
			const extraVariants: string[] = [];
			if (
				normalizeString(country.name.common) ===
				normalizeString('Congo (Democratic Republic of the)')
			) {
				extraVariants.push(
					'congo (kinshasa)',
					'dem. rep. congo',
					'congo, dem. rep.',
					'drc',
				);
			}
			if (
				normalizeString(country.name.common) ===
				normalizeString('Congo')
			) {
				extraVariants.push(
					'congo (brazzaville)',
					'congo, rep.',
					'republic of the congo',
				);
			}
			if (
				normalizeString(country.name.common) ===
				normalizeString("Korea (Democratic People's Republic of)")
			) {
				extraVariants.push('north korea');
			}
			if (
				normalizeString(country.name.common) ===
				normalizeString('Korea (Republic of)')
			) {
				extraVariants.push('south korea');
			}
			if (
				normalizeString(country.name.common) ===
				normalizeString('Micronesia (Federated States of)')
			) {
				extraVariants.push('micronesia');
			}
			if (
				normalizeString(country.name.common) ===
				normalizeString("Cote d'Ivoire")
			) {
				extraVariants.push('ivory coast');
			}
			extraVariants.forEach(pushName);
		});
		return map;
	}, [countries]);

	const getCountryFromGeo = useCallback(
		(geo: any) => {
			// Use a variety of properties to identify the country, as datasets differ.
			const props = geo.properties || {};
			const geoCode2 =
				props.ISO_A2 || props.WB_A2 || props.iso_a2 || props.wb_a2;
			const geoCode3 =
				props.ISO_A3 || props.ADM0_A3 || props.iso_a3 || props.adm0_a3;
			const geoName =
				props.NAME ||
				props.NAME_LONG ||
				props.ADMIN ||
				props.BRK_NAME ||
				props.FORMAL_EN ||
				props.name ||
				props.name_long;

			let country: Country | undefined;

			// Normalize codes to uppercase and skip invalid sentinel values
			const norm2 =
				typeof geoCode2 === 'string'
					? geoCode2.toUpperCase()
					: undefined;
			const norm3 =
				typeof geoCode3 === 'string'
					? geoCode3.toUpperCase()
					: undefined;

			if (norm2 && norm2 !== '-99') {
				country = countriesMap.byCca2.get(norm2);
			}
			if (!country && norm3 && norm3 !== '-99') {
				country = countriesMap.byCca3.get(norm3);
			}

			// Try matching by name (with a small alias map for common mismatches)
			if (!country && geoName) {
				const nameNorm = normalizeString(String(geoName));
				country = countriesMap.byName.get(nameNorm);
				if (!country) {
					const alias: Record<string, string> = {
						'czech republic': 'czechia',
						swaziland: 'eswatini',
						'cape verde': 'cabo verde',
						burma: 'myanmar',
						macedonia: 'north macedonia',
						'ivory coast': "cote d'ivoire",
						'congo (kinshasa)':
							'congo (democratic republic of the)',
						'dem. rep. congo': 'congo (democratic republic of the)',
						'congo, dem. rep.':
							'congo (democratic republic of the)',
						'congo (brazzaville)': 'congo',
						'congo, rep.': 'congo',
						bolivia: 'bolivia (plurinational state of)',
						iran: 'iran (islamic republic of)',
						laos: "lao people's democratic republic",
						moldova: 'moldova, republic of',
						palestine: 'palestine, state of',
						russia: 'russian federation',
						syria: 'syrian arab republic',
						tanzania: 'tanzania, united republic of',
						'the bahamas': 'bahamas',
						'the gambia': 'gambia',
						'vatican city': 'holy see',
						vietnam: 'viet nam',
						'north korea':
							"korea (democratic people's republic of)",
						'south korea': 'korea (republic of)',
						micronesia: 'micronesia (federated states of)',
						// De facto states mapped to parent where needed
						'northern cyprus': 'cyprus',
						somaliland: 'somalia',
					};
					const mapped = alias[nameNorm];
					if (mapped) {
						country = countriesMap.byName.get(
							normalizeString(mapped),
						);
					}
				}
			}

			// No console logging in UI

			return country;
		},
		[countriesMap],
	);

	const getCountryColor = useCallback(
		(geo: any) => {
			const country = getCountryFromGeo(geo);

			if (country?.guessed) {
				return 'hsl(142 71% 47%)'; // A vibrant green for guessed countries
			}

			const isCountryInGame = !!country;
			if (!isCountryInGame && region !== 'all-world') {
				return 'hsl(var(--muted-foreground) / 0.1)'; // Very faint for out-of-play countries
			}

			return 'hsl(var(--card-foreground) / 0.2)'; // Default for unguessed countries
		},
		[getCountryFromGeo, region],
	);

	const getMapConfig = () => {
		const configs = {
			europe: { center: [25, 55] as [number, number], scale: 700 },
			'asia-oceania': {
				center: [90, 5] as [number, number],
				scale: 330,
			},
			// Move projection center north (positive) to shift map down and create more top margin
			africa: { center: [16, 2] as [number, number], scale: 420 },
			americas: { center: [-90, 10] as [number, number], scale: 260 },
			'all-world': { center: [10, 0] as [number, number], scale: 210 },
		};

		const key = region as keyof typeof configs;
		return configs[key] || configs['all-world'];
	};

	const handleMouseEnter = (geo: any) => {
		const country = getCountryFromGeo(geo);
		const countryName = country?.name.common || geo.properties.NAME;
		setTooltipContent(countryName);
		setHoveredCountry(countryName);
		onCountryHover?.(countryName);
	};

	const handleMouseLeave = () => {
		setTooltipContent(null);
		setHoveredCountry(null);
		onCountryHover?.(null);
	};

	const mapConfig = getMapConfig();

	// Create a hash of guessed countries to force Geographies to re-render
	const guessedHash = countries
		.filter((c) => c.guessed)
		.map((c) => c.cca2)
		.sort()
		.join(',');

	return (
		<div className="w-full h-full bg-background/30 rounded-lg border border-border/20 overflow-hidden shadow-lg shadow-black/20 p-3 sm:p-4">
			<TooltipProvider delayDuration={100}>
				<ComposableMap
					projectionConfig={{
						scale: mapConfig.scale,
						center: mapConfig.center,
					}}
					className="w-full h-full"
					preserveAspectRatio="xMidYMid meet"
				>
					<Geographies key={guessedHash} geography={geoUrl}>
						{({ geographies }) => {
							return geographies.map((geo, index) => {
								const country = getCountryFromGeo(geo);
								const countryName =
									country?.name.common ||
									geo.properties?.NAME ||
									geo.properties?.name ||
									geo.properties?.ADMIN ||
									geo.properties?.BRK_NAME;

								// Removed country-specific debug checks

								// Calculate fill color directly using new palette
								let fillColor: string;
								if (country?.guessed) {
									fillColor = 'hsl(var(--geo-green))';
								} else if (country) {
									fillColor = 'hsl(var(--geo-blue) / 0.3)';
								} else if (region !== 'all-world') {
									// Treat unmatched geographies as in-play to avoid gray holes in regional views
									fillColor = 'hsl(var(--geo-blue) / 0.2)';
								} else {
									fillColor = 'hsl(var(--geo-blue) / 0.2)';
								}

								return (
									<Tooltip
										key={`${geo.rsmKey}-${
											country?.guessed
												? 'guessed'
												: 'unguessed'
										}`}
									>
										<TooltipTrigger asChild>
											<Geography
												key={`geo-${geo.rsmKey}-${
													country?.guessed
														? 'guessed'
														: 'unguessed'
												}`}
												geography={geo}
												onMouseEnter={() =>
													handleMouseEnter(geo)
												}
												onMouseLeave={handleMouseLeave}
												style={{
													default: {
														fill: fillColor,
														stroke: 'hsl(var(--background))',
														strokeWidth: 0.5,
														outline: 'none',
														transition:
															'fill 0.4s ease-in-out, stroke-width 0.2s ease',
													},
													hover: {
														fill: country?.guessed
															? 'hsl(var(--geo-green) / 0.9)'
															: country
															? 'hsl(var(--geo-orange))'
															: 'hsl(var(--geo-blue) / 0.4)',
														stroke: 'hsl(var(--geo-dark))',
														strokeWidth: 1.0,
														outline: 'none',
													},
													pressed: {
														fill: country?.guessed
															? 'hsl(var(--geo-green))'
															: country
															? 'hsl(var(--geo-orange) / 0.9)'
															: 'hsl(var(--muted-foreground) / 0.3)',
														stroke: 'hsl(var(--geo-dark))',
														strokeWidth: 1.0,
														outline: 'none',
													},
												}}
											/>
										</TooltipTrigger>
										{tooltipContent &&
											hoveredCountry === countryName && (
												<TooltipContent>
													<p className="font-medium">
														{tooltipContent}
													</p>
													{country?.guessed && (
														<p className="text-xs text-green-400">
															✓ Guessed
														</p>
													)}
												</TooltipContent>
											)}
									</Tooltip>
								);
							});
						}}
					</Geographies>
				</ComposableMap>
			</TooltipProvider>
		</div>
	);
}
