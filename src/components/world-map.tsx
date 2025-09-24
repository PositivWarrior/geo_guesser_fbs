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
  mode?: string;
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
      return "hsl(120 60% 45%)";
    }
    
    const isCountryInGame = countries.some(c => c.iso2 === geo.properties.ISO_A2);
    if (!isCountryInGame) {
      return "hsl(var(--muted-foreground) / 0.3)";
    }
    
    return "hsl(var(--card-foreground) / 0.3)";
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
    }
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
    setHoveredCountry(null);
    onCountryHover?.(null);
  };

  const mapConfig = getMapConfig();

  return (
    <div className="w-full h-full bg-card rounded-md border border-border overflow-hidden">
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
                              strokeWidth: 0.5,
                              outline: "none",
                            },
                            hover: {
                              fill: country?.guessed 
                                ? "hsl(120 60% 55%)"
                                : country
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
                      {tooltipContent && hoveredCountry === country?.name && (
                        <TooltipContent>
                          <p className="font-medium">{tooltipContent}</p>
                          {country?.guessed && (
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
}
