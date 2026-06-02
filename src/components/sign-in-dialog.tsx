'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { Loader2, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

type SignInDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	description?: string;
};

export function SignInDialog({
	open,
	onOpenChange,
	title = 'Sign in to continue',
	description = 'Asia & Oceania requires a free Google account. Europe stays free without signing in.',
}: SignInDialogProps) {
	const { signInWithGoogle } = useAuth();
	const { toast } = useToast();
	const [pending, setPending] = useState(false);

	const handleSignIn = async () => {
		setPending(true);
		try {
			await signInWithGoogle();
			onOpenChange(false);
		} catch (err) {
			toast({
				title: 'Sign in failed',
				description:
					err instanceof Error
						? err.message
						: 'Could not sign in with Google.',
				variant: 'destructive',
			});
		} finally {
			setPending(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter className="flex-col gap-2 sm:flex-col">
					<Button
						className="w-full"
						onClick={handleSignIn}
						disabled={pending}
					>
						{pending ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<LogIn className="mr-2 h-4 w-4" />
						)}
						Continue with Google
					</Button>
					<Button
						variant="ghost"
						className="w-full"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
