'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { Loader2, LogIn, LogOut } from 'lucide-react';

type AuthButtonProps = {
	variant?: 'default' | 'outline' | 'ghost' | 'secondary';
	size?: 'default' | 'sm' | 'lg';
	className?: string;
	showLabel?: boolean;
};

export function AuthButton({
	variant = 'outline',
	size = 'sm',
	className,
	showLabel = true,
}: AuthButtonProps) {
	const { user, loading, authReady, signInWithGoogle, signOut } = useAuth();

	if (!authReady) {
		return null;
	}

	if (loading) {
		return (
			<Button variant={variant} size={size} disabled className={className}>
				<Loader2 className="h-4 w-4 animate-spin" />
			</Button>
		);
	}

	if (user) {
		const label = user.displayName ?? user.email ?? 'Account';
		return (
			<Button
				variant={variant}
				size={size}
				onClick={() => signOut()}
				className={className}
				title={`Signed in as ${label}`}
			>
				<LogOut className="h-4 w-4 shrink-0" />
				{showLabel && (
					<span className="max-w-[120px] truncate hidden sm:inline ml-2">
						{label}
					</span>
				)}
			</Button>
		);
	}

	return (
		<Button
			variant={variant}
			size={size}
			onClick={() => signInWithGoogle()}
			className={className}
		>
			<LogIn className="h-4 w-4 shrink-0" />
			{showLabel && <span className="ml-2">Sign in</span>}
		</Button>
	);
}
