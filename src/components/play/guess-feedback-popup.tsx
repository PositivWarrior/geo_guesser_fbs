'use client';

import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export type GuessFeedbackKind = 'correct' | 'incorrect' | 'duplicate';

export type GuessFeedback = {
	id: number;
	kind: GuessFeedbackKind;
	title: string;
	subtitle?: string;
};

type GuessFeedbackPopupProps = {
	feedback: GuessFeedback;
};

const kindStyles: Record<
	GuessFeedbackKind,
	{ icon: typeof CheckCircle2; ring: string; iconColor: string }
> = {
	correct: {
		icon: CheckCircle2,
		ring: 'border-primary/50 shadow-[0_0_24px_hsl(var(--primary)/0.35)]',
		iconColor: 'text-primary',
	},
	incorrect: {
		icon: XCircle,
		ring: 'border-destructive/50 shadow-[0_0_24px_hsl(var(--destructive)/0.3)]',
		iconColor: 'text-destructive',
	},
	duplicate: {
		icon: RotateCcw,
		ring: 'border-accent/40 shadow-[0_0_20px_hsl(var(--accent)/0.2)]',
		iconColor: 'text-accent',
	},
};

export function GuessFeedbackPopup({ feedback }: GuessFeedbackPopupProps) {
	const style = kindStyles[feedback.kind];
	const Icon = style.icon;

	return (
		<div
			className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none px-4"
			role="status"
			aria-live="polite"
		>
			<div
				className={cn(
					'guess-feedback-popup flex items-center gap-3 rounded-xl border bg-[#0a1628]/95 backdrop-blur-md px-4 py-3 max-w-[min(100%,20rem)]',
					style.ring,
				)}
			>
				<Icon className={cn('h-8 w-8 shrink-0', style.iconColor)} />
				<div className="min-w-0">
					<p className="font-headline font-bold text-sm leading-tight truncate">
						{feedback.title}
					</p>
					{feedback.subtitle && (
						<p className="text-[11px] text-muted-foreground mt-0.5 truncate">
							{feedback.subtitle}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
