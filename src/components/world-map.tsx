'use client';

import { useState, useMemo, useCallback } from 'react';
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
			map.byCca2.set(country.cca2, country);
			map.byCca3.set(country.cca3, country);
			map.byName.set(country.name.common.toLowerCase(), country);
			map.byName.set(country.name.official.toLowerCase(), country);
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
				const nameLc = String(geoName).toLowerCase();
				country =
					countriesMap.byName.get(nameLc) ||
					countriesMap.byName.get(
						{
							// common renames between Natural Earth and REST Countries
							'czech republic': 'czechia',
							swaziland: 'eswatini',
							'cape verde': 'cabo verde',
							burma: 'myanmar',
							macedonia: 'north macedonia',
							'ivory coast': "cote d'ivoire",
							'congo (kinshasa)':
								'congo (democratic republic of the)',
							'congo (brazzaville)': 'congo',
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
						}[nameLc] || '',
					);
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
			europe: { center: [15, 54] as [number, number], scale: 700 },
			'asia-oceania': {
				center: [100, 30] as [number, number],
				scale: 500,
			},
			africa: { center: [20, 2] as [number, number], scale: 500 },
			americas: { center: [-80, 20] as [number, number], scale: 400 },
			'all-world': { center: [10, 20] as [number, number], scale: 180 },
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
		<div className="w-full h-full bg-background/30 rounded-lg border border-border/20 overflow-hidden shadow-lg shadow-black/20">
			<TooltipProvider delayDuration={100}>
				<ComposableMap
					projectionConfig={{
						scale: mapConfig.scale,
						center: mapConfig.center,
					}}
					className="w-full h-full"
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
									fillColor = 'hsl(var(--geo-green))'; // #2ECC71
								} else if (country) {
									fillColor = 'hsl(var(--geo-blue) / 0.3)'; // Light blue for unguessed
								} else if (region !== 'all-world') {
									fillColor =
										'hsl(var(--muted-foreground) / 0.1)';
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
															: 'hsl(var(--muted-foreground) / 0.3)',
														stroke: 'hsl(var(--geo-dark))',
														strokeWidth: 1.5,
														outline: 'none',
													},
													pressed: {
														fill: country?.guessed
															? 'hsl(var(--geo-green))'
															: country
															? 'hsl(var(--geo-orange) / 0.9)'
															: 'hsl(var(--muted-foreground) / 0.3)',
														stroke: 'hsl(var(--geo-dark))',
														strokeWidth: 1.5,
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
