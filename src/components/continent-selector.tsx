'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import type { Continent } from '@/lib/continents';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Compass } from './icons';

interface ContinentSelectorProps {
	continents: Continent[];
	unlockedContinents: string[];
	onSelect: (continent: Continent) => void;
}

export function ContinentSelector({
	continents,
	unlockedContinents,
	onSelect,
}: ContinentSelectorProps) {
	const { toast } = useToast();

	const handleSelect = (continent: Continent) => {
		const isUnlocked =
			unlockedContinents.includes(continent.name) ||
			continent.name === 'Whole World' ||
			continent.name === 'Europe';
		if (isUnlocked) {
			onSelect(continent);
		} else {
			toast({
				title: 'Continent Locked',
				description: `Unlock ${continent.name} from the store to play.`,
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="w-full max-w-4xl mx-auto space-y-8">
			{/* Logo and Title Section */}
			<div className="text-center space-y-6">
				<div className="relative inline-block">
					<div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent blur-3xl opacity-30 animate-pulse"></div>
					<div className="relative bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-sm rounded-full p-8 border-4 border-white/20 shadow-2xl">
						<Compass className="w-32 h-32 text-primary animate-pulse" />
					</div>
				</div>
				<div className="space-y-3">
					<h1 className="text-7xl font-bold tracking-tight">
						<span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
							GeoGuesser
						</span>
					</h1>
					<p className="text-xl text-muted-foreground max-w-md mx-auto">
						Test your geography knowledge and explore the world!
					</p>
				</div>
			</div>

			{/* Continent Selection Card */}
			<Card className="border-2 shadow-2xl bg-gradient-to-br from-card to-card/80">
				<CardHeader className="text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
					<CardTitle className="text-3xl flex items-center justify-center gap-3">
						<span className="text-2xl">🌍</span>
						Select Your Challenge
					</CardTitle>
					<CardDescription className="text-lg mt-2">
						Choose a continent and start guessing countries!
					</CardDescription>
				</CardHeader>
				<CardContent className="p-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{continents.map((continent) => {
							const isUnlocked =
								unlockedContinents.includes(continent.name) ||
								continent.name === 'Whole World' ||
								continent.name === 'Europe';
							const Icon = continent.icon;
							return (
								<Button
									key={continent.id}
									variant={
										isUnlocked ? 'default' : 'secondary'
									}
									className={`h-32 flex flex-col justify-center items-center gap-3 text-lg font-bold transform transition-all duration-300 hover:scale-105 shadow-lg ${
										isUnlocked
											? 'bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border-2 border-primary/30'
											: 'bg-muted hover:bg-muted/80'
									}`}
									onClick={() => handleSelect(continent)}
									aria-label={
										isUnlocked
											? `Play ${continent.name}`
											: `${continent.name} (Locked)`
									}
								>
									<Icon className="w-12 h-12 mb-1" />
									<span>{continent.name}</span>
									{!isUnlocked && (
										<Lock className="w-5 h-5 absolute top-4 right-4 text-muted-foreground" />
									)}
								</Button>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Features Info */}
			<div className="hidden grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
				<div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
					<div className="text-4xl mb-2">⏱️</div>
					<h3 className="font-bold text-lg mb-1">Timed Challenge</h3>
					<p className="text-sm text-muted-foreground">
						Race against the clock!
					</p>
				</div>
				<div className="p-6 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
					<div className="text-4xl mb-2">🗺️</div>
					<h3 className="font-bold text-lg mb-1">Interactive Map</h3>
					<p className="text-sm text-muted-foreground">
						See your progress visually
					</p>
				</div>
				<div className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
					<div className="text-4xl mb-2">🏆</div>
					<h3 className="font-bold text-lg mb-1">Track Progress</h3>
					<p className="text-sm text-muted-foreground">
						Master all continents!
					</p>
				</div>
			</div>
		</div>
	);
}
