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
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-card/50 backdrop-blur-sm border-primary/20 shadow-primary/10 shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
            <Compass className="w-16 h-16 text-primary" />
        </div>
        <CardTitle className="text-5xl font-headline tracking-tighter">GeoGuesser</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">Select a continent to begin your adventure!</CardDescription>
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
                className="h-28 flex flex-col justify-center items-center gap-2 text-lg font-semibold transform transition-transform duration-200 hover:scale-105"
                onClick={() => handleSelect(continent)}
                aria-label={isUnlocked ? `Play ${continent.name}` : `${continent.name} (Locked)`}
                disabled={!isUnlocked}
              >
                <Icon className="w-10 h-10 mb-1"/>
                <span>{continent.name}</span>
                {!isUnlocked && <Lock className="w-4 h-4 absolute top-3 right-3 text-muted-foreground" />}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
