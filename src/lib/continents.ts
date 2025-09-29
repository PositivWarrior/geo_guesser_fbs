
import { Globe, Leaf, Mountain, Sun, Waves, Zap, LandPlot } from "lucide-react";

export interface Continent {
  id: string;
  name: string;
  time: number; // in seconds
  icon: React.ElementType;
}

export const continents: Continent[] = [
  { id: "europe", name: "Europe", time: 360, icon: Leaf },
  { id: "asia-oceania", name: "Asia & Oceania", time: 720, icon: Mountain },
  { id: "americas", name: "The Americas", time: 600, icon: LandPlot },
  { id: "africa", name: "Africa", time: 540, icon: Sun },
  { id: "all-world", name: "Whole World", time: 900, icon: Globe },
];
