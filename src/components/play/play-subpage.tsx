'use client';

import type { ReactNode } from 'react';

type PlaySubpageProps = {
	title: string;
	titleAccent?: string;
	subtitle?: string;
	children: ReactNode;
};

export function PlaySubpage({
	title,
	titleAccent,
	subtitle,
	children,
}: PlaySubpageProps) {
	return (
		<div className="px-3 sm:px-4 lg:px-6 py-5 sm:py-6 max-w-5xl mx-auto">
			<header className="mb-6 sm:mb-8">
				<h1 className="font-headline font-bold text-2xl sm:text-3xl uppercase tracking-tight italic">
					<span className="text-foreground">{title} </span>
					{titleAccent && (
						<span className="game-headline-accent">{titleAccent}</span>
					)}
				</h1>
				{subtitle && (
					<p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
				)}
			</header>
			{children}
		</div>
	);
}
