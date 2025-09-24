"use client";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { countries as allCountries } from "@/lib/countries";
import { cn } from "@/lib/utils";

interface WorldMapProps {
  guessedCountries: string[];
  gameContinent: string;
  mode?: string;
}

const geoUrl = "https://unpkg.com/world-atlas@2/countries-110m.json";

function WorldMapComponent({
  guessedCountries,
  gameContinent,
  mode = "all-world"
}: WorldMapProps) {

  const getMapConfig = () => {
    const configs = {
      europe: { center: [15, 54] as [number, number], scale: 600 },
      asia: { center: [90, 30] as [number, number], scale: 400 },
      africa: { center: [20, 2] as [number, number], scale: 400 },
      'north-america': { center: [-90, 40] as [number, number], scale: 400 },
      'south-america': { center: [-60, -20] as [number, number], scale: 350 },
      oceania: { center: [135, -25] as [number, number], scale: 450 },
      'all-world': { center: [10, 20] as [number, number], scale: 150 }
    };
    
    const key = mode as keyof typeof configs;
    return configs[key] || configs['all-world'];
  };

  const mapConfig = getMapConfig();

  const targetCountriesISO = allCountries
    .filter(c => gameContinent === 'All World' || c.continent === gameContinent)
    .map(c => c.iso2);

  return (
    <div className="w-full h-full aspect-video bg-card flex items-center justify-center overflow-hidden border rounded-lg">
       <TooltipProvider>
      <ComposableMap
        projectionConfig={{
          scale: mapConfig.scale,
          rotation: [-10,0,0]
        }}
        className="w-full h-full"
      >
        <ZoomableGroup center={mapConfig.center}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const country = allCountries.find(c => c.iso2 === geo.properties.ISO_A2);
                const isGuessed = !!country && guessedCountries.includes(country.iso2);
                const isTarget = !!country && targetCountriesISO.includes(country.iso2);
                
                return (
                  <Tooltip key={geo.rsmKey}>
                    <TooltipTrigger asChild>
                      <Geography
                        geography={geo}
                        className={cn('country outline-none', {
                          'guessed': isGuessed,
                          'unguessed': isTarget && !isGuessed,
                          'locked': !isTarget
                        })}
                        style={{
                           hover: {
                              fill: "hsl(var(--accent))",
                              stroke: "hsl(var(--ring))",
                              strokeWidth: 1,
                              outline: "none",
                            },
                            pressed: {
                              fill: "hsl(var(--accent))",
                              stroke: "hsl(var(--ring))",
                              strokeWidth: 1,
                              outline: "none",
                            },
                        }}
                      />
                    </TooltipTrigger>
                    {country && (
                      <TooltipContent>
                        <p className="font-medium">{country.name}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
       </TooltipProvider>
    </div>
  );
};

export const WorldMap = WorldMapComponent;
