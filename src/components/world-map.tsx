// This component is intentionally simplified for brevity.
// A real-world implementation would dynamically load a large SVG
// and handle pan/zoom, which is beyond the scope of this example.
// The SVG paths should have `id` attributes matching country ISO2 codes.

"use client";
import type { Country } from '@/lib/countries';
import { cn } from '@/lib/utils';
import React from 'react';

interface WorldMapProps {
  guessedCountries: string[];
  allCountries: Country[];
  targetCountries: string[];
}

export const WorldMap: React.FC<WorldMapProps> = ({ guessedCountries, allCountries, targetCountries }) => {
  const isTarget = (iso2: string) => targetCountries.includes(iso2);
  const isGuessed = (iso2: string) => guessedCountries.includes(iso2);

  return (
    <div className="w-full h-full aspect-video bg-card flex items-center justify-center overflow-hidden">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 500.5"
        className="w-full h-auto"
      >
        {/* In a real app, you would map over a GeoJSON or similar data source to generate these paths. */}
        {/* For this example, a small subset is shown. The full app would contain all countries. */}
        {allCountries.map(country => (
          <path
            key={country.iso2}
            id={country.iso2}
            className={cn('country', {
              'guessed': isGuessed(country.iso2),
              'unguessed': isTarget(country.iso2) && !isGuessed(country.iso2),
              'locked': !isTarget(country.iso2),
            })}
            d={country.path} // Assuming your country data has an SVG path 'd' attribute
            aria-label={country.name}
          />
        ))}
      </svg>
    </div>
  );
};
