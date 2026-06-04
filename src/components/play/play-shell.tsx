'use client';

import type { ReactNode } from 'react';
import { MarketingShell } from '@/components/marketing/marketing-shell';

type PlayShellProps = {
	children: ReactNode;
	/** Subtle grid for active game */
	variant?: 'lobby' | 'game';
};

export function PlayShell({ children, variant = 'lobby' }: PlayShellProps) {
	return (
		<MarketingShell showGrid={variant === 'game' || variant === 'lobby'}>
			{children}
		</MarketingShell>
	);
}
