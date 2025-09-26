"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type Country } from "@/lib/countries";

interface WorldMapProps {
  countries: Country[];
  onCountryHover?: (countryName: string | null) => void;
  mode?: string | null;
}

const geoUrl = "https://unpkg.com/world-atlas@2/countries-110m.json";

export function WorldMap({
  countries,
  onCountryHover,
  mode = "all-world"
}: WorldMapProps) {
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const getCountryFromGeo = (geo: any) => {
    return countries.find(c => c.iso2 === geo.properties.ISO_A2);
  };
  
  const getCountryColor = (geo: any) => {
    const country = getCountryFromGeo(geo);
    
    if (country?.guessed) {
      return "hsl(142 71% 47%)"; // Bright green for guessed countries
    }
    
    const isCountryInGame = countries.some(c => c.iso2 === geo.properties.ISO_A2);
    if (!isCountryInGame) {
        return "hsl(var(--muted-foreground) / 0.1)";
    }
    
    return "hsl(var(--card-foreground) / 0.2)";
  };

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

  const handleMouseEnter = (geo: any) => {
    const country = getCountryFromGeo(geo);
    if (country) {
      setTooltipContent(country.name);
      setHoveredCountry(country.name);
      onCountryHover?.(country.name);
    } else {
       // Show country name from map data even if not in game
       const countryName = geo.properties.NAME;
       setTooltipContent(countryName);
       setHoveredCountry(countryName);
    }
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
    setHoveredCountry(null);
    onCountryHover?.(null);
  };

  const mapConfig = getMapConfig();

  return (
    <div className="w-full h-full bg-background/30 rounded-lg border border-border/20 overflow-hidden shadow-lg shadow-black/20">
      <TooltipProvider delayDuration={100}>
        <ComposableMap
          projectionConfig={{
            scale: mapConfig.scale,
            rotation: [-10,0,0]
          }}
          className="w-full h-full"
        >
          <ZoomableGroup center={mapConfig.center} minZoom={0.75}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const country = getCountryFromGeo(geo);
                  
                  return (
                    <Tooltip key={geo.rsmKey}>
                      <TooltipTrigger asChild>
                        <Geography
                          geography={geo}
                          onMouseEnter={() => handleMouseEnter(geo)}
                          onMouseLeave={handleMouseLeave}
                          style={{
                            default: {
                              fill: getCountryColor(geo),
                              stroke: "hsl(var(--background))",
                              strokeWidth: 0.25,
                              outline: "none",
                              transition: "fill 0.3s ease-in-out",
                            },
                            hover: {
                              fill: country?.guessed 
                                ? "hsl(142 71% 57%)" // Slightly brighter green on hover
                                : country
                                ? "hsl(var(--accent))"
                                : "hsl(var(--muted-foreground) / 0.2)",
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
                      {tooltipContent && hoveredCountry === (country?.name || geo.properties.NAME) && (
                        <TooltipContent>
                          <p className="font-medium">{tooltipContent}</p>
                          {country?.guessed && (
                            <p className="text-xs text-green-400">✓ Guessed</p>
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
}

    