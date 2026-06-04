'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useVisualViewport } from '@/hooks/use-visual-viewport';
import { WorldMap } from '@/components/world-map';
import {
	GuessFeedbackPopup,
	type GuessFeedback,
} from '@/components/play/guess-feedback-popup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Compass } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { Continent } from '@/lib/continents';
import type { Country } from '@/lib/types';
import {
	Timer,
	Pause,
	Play,
	Send,
	MapPin,
	X,
	Flame,
	Menu,
	Maximize2,
	Minimize2,
	HelpCircle,
	Lightbulb,
} from 'lucide-react';

type GamePlayScreenProps = {
	continent: Continent;
	timeLeft: number;
	guessedCount: number;
	total: number;
	inputValue: string;
	onInputChange: (value: string) => void;
	gameState: 'playing' | 'paused';
	streak: number;
	countries: Country[];
	guessFeedback?: GuessFeedback | null;
	onSubmit: (e: React.FormEvent) => void;
	onPause: () => void;
	onExit: () => void;
};

export function GamePlayScreen({
	continent,
	timeLeft,
	guessedCount,
	total,
	inputValue,
	onInputChange,
	gameState,
	streak,
	countries,
	guessFeedback,
	onSubmit,
	onPause,
	onExit,
}: GamePlayScreenProps) {
	const { toast } = useToast();
	const { height: vvHeight, offsetTop, keyboardOpen } = useVisualViewport();
	const inputRef = useRef<HTMLInputElement>(null);
	const [mapExpanded, setMapExpanded] = useState(false);
	const [inputFocused, setInputFocused] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	const progressPct = total > 0 ? Math.round((guessedCount / total) * 100) : 0;
	const remaining = total - guessedCount;
	const isUrgent = timeLeft > 0 && timeLeft < 30 && gameState === 'playing';
	const isPaused = gameState === 'paused';

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	};

	/* Collapse hints while typing — keeps map in view above keyboard */
	useEffect(() => {
		if (keyboardOpen) setMapExpanded(false);
	}, [keyboardOpen]);

	const rootStyle =
		typeof window !== 'undefined' && vvHeight > 0
			? {
					height: `${vvHeight}px`,
					marginTop: offsetTop > 0 ? `${offsetTop}px` : undefined,
				}
			: undefined;

	const mapBlock = (
		<div
			className={cn(
				'relative flex-1 min-h-0 w-full rounded-xl overflow-hidden border border-white/10 bg-[#0a1628] game-map-frame',
				mapExpanded && 'fixed inset-0 z-[60] rounded-none border-0 flex-none',
			)}
		>
			<div className="absolute inset-0 overflow-hidden">
				<WorldMap
					countries={countries}
					region={continent.id}
					layout="fill"
				/>
			</div>

			<div className="absolute top-1.5 left-1.5 right-1.5 flex justify-between pointer-events-none z-10">
				<button
					type="button"
					className="pointer-events-auto h-7 w-7 rounded-md game-panel flex items-center justify-center text-muted-foreground"
					onClick={() => setMapExpanded((e) => !e)}
					aria-label={mapExpanded ? 'Exit fullscreen map' : 'Expand map'}
				>
					{mapExpanded ? (
						<Minimize2 className="h-3.5 w-3.5" />
					) : (
						<Maximize2 className="h-3.5 w-3.5" />
					)}
				</button>
				<button
					type="button"
					className="pointer-events-auto h-7 w-7 rounded-md game-panel flex items-center justify-center text-muted-foreground"
					aria-label="How to play"
					onClick={() =>
						toast({
							title: 'How to play',
							description:
								'Type a country name and tap Submit. Correct guesses light up green.',
						})
					}
				>
					<HelpCircle className="h-3.5 w-3.5" />
				</button>
			</div>

			{!keyboardOpen && (
				<div className="absolute bottom-0 inset-x-0 z-10 px-2 py-1 bg-gradient-to-t from-[#050a10] to-transparent">
					<div className="flex items-center justify-center gap-3 text-[8px] font-bold uppercase tracking-wider">
						<span className="inline-flex items-center gap-1 text-primary">
							<span className="h-1.5 w-1.5 rounded-full bg-primary" />
							Guessed ({guessedCount})
						</span>
						<span className="inline-flex items-center gap-1 text-secondary">
							<span className="h-1.5 w-1.5 rounded-full bg-secondary/80" />
							Remaining ({remaining})
						</span>
					</div>
				</div>
			)}

			{guessFeedback && (
				<GuessFeedbackPopup
					key={guessFeedback.id}
					feedback={guessFeedback}
				/>
			)}

			{isPaused && (
				<div className="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-sm">
					<div className="game-panel rounded-xl px-6 py-4 text-center">
						<Pause className="h-8 w-8 text-primary mx-auto mb-1" />
						<p className="font-headline font-bold text-sm">Paused</p>
					</div>
				</div>
			)}
		</div>
	);

	return (
		<div
			className="game-play-root flex flex-col w-full max-w-lg md:max-w-3xl mx-auto bg-[#050a10] overflow-hidden"
			style={rootStyle}
		>
			{/* Minimal header */}
			<header className="flex items-center justify-between gap-2 px-2 py-1.5 border-b border-white/10 shrink-0">
				<Link
					href="/play"
					className="flex items-center gap-1.5 font-headline font-bold text-xs min-w-0"
					onClick={(e) => {
						e.preventDefault();
						onExit();
					}}
				>
					<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/15 border border-primary/30">
						<Compass className="h-4 w-4 text-primary" />
					</span>
					<span className="hidden min-[360px]:inline truncate">
						Geo<span className="text-primary">Guesser</span>
					</span>
				</Link>

				<div className="flex items-center gap-1.5 shrink-0">
					{streak > 0 && (
						<div className="flex items-center gap-0.5 rounded-md border border-accent/30 bg-accent/10 px-1.5 py-0.5">
							<Flame className="h-3 w-3 text-accent" />
							<span className="text-[10px] font-bold text-accent tabular-nums">
								x{streak}
							</span>
						</div>
					)}
					<Sheet open={menuOpen} onOpenChange={setMenuOpen}>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7 game-panel"
								aria-label="Menu"
							>
								<Menu className="h-4 w-4" />
							</Button>
						</SheetTrigger>
						<SheetContent
							side="right"
							className="game-panel border-l border-white/10 w-[min(100vw-2rem,18rem)]"
						>
							<nav className="flex flex-col gap-2 mt-8">
								<Button
									variant="ghost"
									className="justify-start"
									onClick={() => {
										setMenuOpen(false);
										onPause();
									}}
								>
									{isPaused ? (
										<Play className="mr-2 h-4 w-4" />
									) : (
										<Pause className="mr-2 h-4 w-4" />
									)}
									{isPaused ? 'Resume' : 'Pause'}
								</Button>
								<Button
									variant="ghost"
									className="justify-start text-destructive"
									onClick={() => {
										setMenuOpen(false);
										onExit();
									}}
								>
									Exit to lobby
								</Button>
								<Button asChild variant="outline" className="justify-start">
									<Link href="/leaderboard">Leaderboard</Link>
								</Button>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</header>

			{/* Compact HUD — single slim strip above map */}
			<div
				className={cn(
					'shrink-0 px-2 pt-1.5 pb-1 space-y-1 transition-all',
					keyboardOpen && 'py-1 space-y-0.5',
				)}
			>
				<div className="game-panel rounded-lg px-2.5 py-1.5 border border-white/10">
					<div className="flex items-center justify-between gap-2 mb-1">
						<div className="flex items-center gap-1.5 min-w-0 flex-1">
							<span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">
								Mission
							</span>
							<span className="font-headline font-bold text-sm text-foreground truncate">
								{continent.name}
							</span>
						</div>
						<span className="text-xs font-bold text-primary tabular-nums shrink-0">
							{guessedCount}/{total}
						</span>
					</div>
					<div className="relative h-1.5 rounded-full bg-muted/40">
						<div
							className="absolute inset-y-0 left-0 rounded-full bg-primary game-progress-fill"
							style={{ width: `${progressPct}%` }}
						/>
						<span
							className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white game-progress-spark"
							style={{ left: `calc(${progressPct}% - 4px)` }}
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-1.5">
					<div
						className={cn(
							'game-panel rounded-lg px-2 py-1 flex items-center justify-between gap-2 border',
							isUrgent ? 'border-destructive/40' : 'border-accent/20',
						)}
					>
						<div className="flex items-center gap-1 min-w-0">
							<Timer
								className={cn(
									'h-3.5 w-3.5 shrink-0',
									isUrgent ? 'text-destructive' : 'text-accent',
								)}
							/>
							<span className="text-[8px] font-bold uppercase text-muted-foreground">
								Time
							</span>
						</div>
						<span
							className={cn(
								'text-base font-bold font-mono tabular-nums leading-none',
								isUrgent ? 'text-destructive' : 'text-accent',
							)}
						>
							{formatTime(timeLeft)}
						</span>
					</div>
					<div className="game-panel rounded-lg px-2 py-1 flex items-center justify-between gap-2 border border-primary/20">
						<span className="text-[8px] font-bold uppercase text-muted-foreground">
							Found
						</span>
						<span className="text-base font-bold font-mono tabular-nums text-primary leading-none">
							{guessedCount}
							<span className="text-muted-foreground text-xs font-medium">
								/{total}
							</span>
						</span>
					</div>
				</div>
			</div>

			{/* Map — takes all remaining space */}
			<div className="flex-1 min-h-0 flex flex-col px-2 pt-0 pb-0">
				{mapBlock}
			</div>

			{/* Bottom dock — sits above keyboard when viewport shrinks */}
			<div
				className={cn(
					'shrink-0 px-2 border-t border-white/10 bg-[#050a10] space-y-1.5',
					keyboardOpen ? 'pt-1.5 pb-1.5' : 'pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]',
				)}
			>
				<form onSubmit={onSubmit} className="space-y-1.5">
					<div className="relative">
						<MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary pointer-events-none" />
						<Input
							ref={inputRef}
							type="text"
							placeholder="Type a country name..."
							value={inputValue}
							onChange={(e) => onInputChange(e.target.value)}
							onFocus={() => setInputFocused(true)}
							onBlur={() => setInputFocused(false)}
							disabled={gameState !== 'playing'}
							className="h-10 pl-9 pr-9 text-sm rounded-lg border-2 border-primary/40 bg-primary/5 focus:border-primary focus:ring-1 focus:ring-primary/30"
							aria-label="Country guess"
							autoComplete="off"
							autoCorrect="off"
							enterKeyHint="go"
						/>
						{inputValue && (
							<button
								type="button"
								className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground"
								onClick={() => onInputChange('')}
								aria-label="Clear"
							>
								<X className="h-3.5 w-3.5" />
							</button>
						)}
					</div>

					<div className="grid grid-cols-[1fr_1.55fr] gap-1.5">
						<Button
							type="button"
							variant="outline"
							className="h-10 rounded-lg game-panel text-[10px] font-bold uppercase"
							onClick={onPause}
							disabled={gameState !== 'playing' && gameState !== 'paused'}
						>
							{isPaused ? (
								<Play className="h-3.5 w-3.5 mr-1" />
							) : (
								<Pause className="h-3.5 w-3.5 mr-1" />
							)}
							{isPaused ? 'Go' : 'Pause'}
						</Button>
						<Button
							type="submit"
							disabled={gameState !== 'playing' || !inputValue.trim()}
							className="h-10 rounded-lg game-cta text-xs font-bold uppercase"
						>
							Submit
							<Send className="ml-1.5 h-3.5 w-3.5" />
						</Button>
					</div>
				</form>

				{!keyboardOpen && !inputFocused && (
					<button
						type="button"
						className="w-full flex items-center gap-2 rounded-lg game-panel px-2 py-1.5 border border-accent/15 text-left"
						onClick={() =>
							toast({
								title: 'Hints',
								description: 'Hints coming soon.',
							})
						}
					>
						<Lightbulb className="h-3.5 w-3.5 text-accent shrink-0" />
						<span className="text-[10px] text-muted-foreground flex-1">
							Hints · tap for info
						</span>
						<span className="text-[9px] font-bold text-primary px-1 rounded bg-primary/15">
							2
						</span>
					</button>
				)}
			</div>

			{mapExpanded && (
				<button
					type="button"
					className="fixed inset-0 z-[55] bg-black/60"
					aria-label="Close fullscreen"
					onClick={() => setMapExpanded(false)}
				/>
			)}
		</div>
	);
}
