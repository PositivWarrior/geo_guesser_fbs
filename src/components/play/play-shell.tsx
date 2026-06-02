'use client';

import type { ReactNode } from 'react';

type PlayShellProps = {
	children: ReactNode;
	/** Subtle grid for active game, stronger for lobby */
	variant?: 'lobby' | 'game';
};

export function PlayShell({ children, variant = 'lobby' }: PlayShellProps) {
	return (
		<div className="relative min-h-screen overflow-x-hidden">
			<div className="pointer-events-none fixed inset-0 -z-10">
				<div
					className={`absolute -top-32 left-0 h-80 w-80 rounded-full blur-[100px] animate-landing-drift ${
						variant === 'game' ? 'bg-primary/15' : 'bg-primary/20'
					}`}
				/>
				<div
					className="absolute top-1/2 right-0 h-72 w-72 rounded-full bg-secondary/12 blur-[90px] animate-landing-drift"
					style={{ animationDelay: '1.5s' }}
				/>
				<div
					className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-accent/10 blur-[80px] animate-landing-drift"
					style={{ animationDelay: '3s' }}
				/>
				{variant === 'game' && (
					<div
						className="absolute inset-0 opacity-[0.02]"
						style={{
							backgroundImage: `linear-gradient(hsl(var(--primary)/0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.15) 1px, transparent 1px)`,
							backgroundSize: '48px 48px',
						}}
					/>
				)}
			</div>
			<div className="relative z-10">{children}</div>
		</div>
	);
}
