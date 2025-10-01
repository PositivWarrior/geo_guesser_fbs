
"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type Country } from "@/lib/types";

interface WorldMapProps {
  countries: Country[];
  onCountryHover?: (countryName: string | null) => void;
  region?: string | null;
}

const geoUrl = "https://unpkg.com/world-atlas@2/countries-110m.json";

export function WorldMap({
  countries,
  onCountryHover,
  region = "all-world"
}: WorldMapProps) {
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const getCountryFromGeo = (geo: any) => {
    // Use a few different properties to identify the country, as the map data is inconsistent.
    const geoCode = geo.properties.ISO_A2 || geo.properties.ADM0_A3 || geo.properties.WB_A2;
    return countries.find(c => c.cca2 === geoCode);
  };
  
  const getCountryColor = (geo: any) => {
    const country = getCountryFromGeo(geo);
    
    if (country?.guessed) {
      return "hsl(142 71% 47%)"; // A vibrant green for guessed countries
    }

    const isCountryInGame = !!country;
    if (!isCountryInGame && region !== 'all-world') {
        return "hsl(var(--muted-foreground) / 0.1)"; // Very faint for out-of-play countries
    }
    
    return "hsl(var(--card-foreground) / 0.2)"; // Default for unguessed countries
  };

  const getMapConfig = () => {
    const configs = {
      europe: { center: [15, 54] as [number, number], scale: 600 },
      'asia-oceania': { center: [100, 30] as [number, number], scale: 400 },
      africa: { center: [20, 2] as [number, number], scale: 400 },
      'americas': { center: [-80, 20] as [number, number], scale: 300 },
      'all-world': { center: [10, 20] as [number, number], scale: 150 }
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
                  const countryName = country?.name.common || geo.properties.NAME;
                  
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
                                ? "hsl(142 71% 57%)"
                                : country
                                ? "hsl(var(--accent))"
                                : "hsl(var(--muted-foreground) / 0.2)",
                              stroke: "hsl(var(--ring))",
                              strokeWidth: 1,
                              outline: "none",
                            },
                            pressed: {
                              fill: country?.guessed
                                ? "hsl(142 71% 57%)"
                                : country
                                ? "hsl(var(--accent))"
                                : "hsl(var(--muted-foreground) / 0.2)",
                              stroke: "hsl(var(--ring))",
                              strokeWidth: 1,
                              outline: "none",
                            },
                          }}
                        />
                      </TooltipTrigger>
                      {tooltipContent && hoveredCountry === countryName && (
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
