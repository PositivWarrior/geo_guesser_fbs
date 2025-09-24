"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Continent } from "@/lib/continents";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Compass } from "./icons";

interface ContinentSelectorProps {
  continents: Continent[];
  unlockedContinents: string[];
  onSelect: (continent: Continent) => void;
}

export function ContinentSelector({ continents, unlockedContinents, onSelect }: ContinentSelectorProps) {
  const { toast } = useToast();

  const handleSelect = (continent: Continent) => {
    if (unlockedContinents.includes(continent.name) || continent.name === 'All World') {
      onSelect(continent);
    } else {
      toast({
        title: "Continent Locked",
        description: `Unlock ${continent.name} from the store to play.`,
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
            <Compass className="w-12 h-12 text-primary" />
        </div>
        <CardTitle className="text-4xl font-headline">Geo Explorer</CardTitle>
        <CardDescription className="text-lg">Select a continent to begin your adventure!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {continents.map((continent) => {
            const isUnlocked = unlockedContinents.includes(continent.name) || continent.name === 'All World';
            const Icon = continent.icon;
            return (
              <Button
                key={continent.id}
                variant={isUnlocked ? "default" : "secondary"}
                className="h-24 flex flex-col justify-center items-center gap-2 text-lg"
                onClick={() => handleSelect(continent)}
                aria-label={isUnlocked ? `Play ${continent.name}` : `${continent.name} (Locked)`}
              >
                <Icon className="w-8 h-8"/>
                <span>{continent.name}</span>
                {!isUnlocked && <Lock className="w-4 h-4 absolute top-2 right-2" />}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
