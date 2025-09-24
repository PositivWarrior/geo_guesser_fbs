"use client";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { countries as allCountries, type Country } from "@/lib/countries";

interface WorldMapProps {
  countries: Country[];
  mode?: string;
}

const geoUrl = "https://unpkg.com/world-atlas@2/countries-110m.json";

export function WorldMap({
  countries,
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

  const getCountryColor = (geo: any) => {
    const countryInGame = countries.find(c => c.iso2 === geo.properties.ISO_A2);

    if (countryInGame?.guessed) {
        return 'hsl(120 60% 45%)';
    }
    
    const isCountryInPlay = allCountries.some(c => c.iso2 === geo.properties.ISO_A2 && c.continent === (countries[0]?.continent || ''));
    if (mode !== 'all-world' && !isCountryInPlay) {
      return 'hsl(var(--muted-foreground) / 0.3)';
    }

    if (countryInGame) {
      return 'hsl(var(--card-foreground) / 0.3)';
    }
    
    return 'hsl(var(--muted-foreground) / 0.3)';
  };

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
                  const countryInGame = countries.find(c => c.iso2 === geo.properties.ISO_A2);
                  const isGuessed = countryInGame?.guessed;
                  const color = getCountryColor(geo);

                  return (
                    <Tooltip key={geo.rsmKey}>
                      <TooltipTrigger asChild>
                        <Geography
                          geography={geo}
                          style={{
                              default: {
                                fill: color,
                                stroke: "hsl(var(--background))",
                                strokeWidth: 0.5,
                                outline: "none",
                              },
                              hover: {
                                fill: isGuessed 
                                  ? "hsl(120 60% 55%)"
                                  : countryInGame
                                  ? "hsl(var(--accent))"
                                  : "hsl(var(--muted) / 0.5)",
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
                      {country && countryInGame && (
                        <TooltipContent>
                          <p className="font-medium">{country.name}</p>
                          {isGuessed && (
                            <p className="text-xs text-muted-foreground">✓ Guessed</p>
                          )}
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
