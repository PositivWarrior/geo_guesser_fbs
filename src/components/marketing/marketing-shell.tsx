'use client';

import type { ReactNode } from 'react';

type MarketingShellProps = {
	children: ReactNode;
	/** Stronger grid on marketing pages */
	showGrid?: boolean;
};

export function MarketingShell({
	children,
	showGrid = true,
}: MarketingShellProps) {
	return (
		<div className="relative min-h-screen overflow-x-hidden bg-background">
			<div className="pointer-events-none fixed inset-0 -z-10">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-30%,hsl(var(--primary)/0.18),transparent_55%)]" />
				<div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/12 blur-[100px] animate-landing-drift" />
				<div
					className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/10 blur-[90px] animate-landing-drift"
					style={{ animationDelay: '2.5s' }}
				/>
				{showGrid && <div className="game-grid absolute inset-0" aria-hidden />}
			</div>
			<div className="relative z-10">{children}</div>
		</div>
	);
}
