import { Globe, Leaf, Mountain, Sun, Waves, Zap } from "lucide-react";

export interface Continent {
  id: string;
  name: string;
  time: number; // in seconds
  icon: React.ElementType;
}

export const continents: Continent[] = [
  { id: "europe", name: "Europe", time: 360, icon: Leaf },
  { id: "asia", name: "Asia", time: 600, icon: Mountain },
  { id: "africa", name: "Africa", time: 540, icon: Sun },
  { id: "north-america", name: "North America", time: 420, icon: Zap },
  { id: "south-america", name: "South America", time: 420, icon: Waves },
  { id: "oceania", name: "Oceania", time: 300, icon: Waves },
  { id: "all-world", name: "All World", time: 720, icon: Globe },
];
