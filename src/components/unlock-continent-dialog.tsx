'use client';

import { useState } from 'react';
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
import {
	BMC_MIN_SUPPORT_USD,
	BMC_PROFILE_URL,
	buildUnlockNote,
	getBmcUrlForRegion,
	getRegionDisplayName,
	type PaidRegion,
} from '@/lib/bmc';
import { Copy, Check, ExternalLink, Coffee, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SignInDialog } from '@/components/sign-in-dialog';

type UnlockContinentDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	region: PaidRegion;
	onUnlocked?: () => void;
};

export function UnlockContinentDialog({
	open,
	onOpenChange,
	region,
	onUnlocked,
}: UnlockContinentDialogProps) {
	const { user, isLoggedIn, refreshEntitlements, unlockedAmericas, unlockedAfrica } =
		useAuth();
	const { toast } = useToast();
	const [copied, setCopied] = useState(false);
	const [signInOpen, setSignInOpen] = useState(false);

	const alreadyUnlocked =
		region === 'americas' ? unlockedAmericas : unlockedAfrica;

	const unlockNote =
		user?.uid != null ? buildUnlockNote(user.uid, region) : '';

	const handleCopy = async () => {
		if (!unlockNote) return;
		await navigator.clipboard.writeText(unlockNote);
		setCopied(true);
		toast({ title: 'Copied', description: 'Paste this in the Buy Me a Coffee message field.' });
		setTimeout(() => setCopied(false), 2000);
	};

	const handleRefresh = async () => {
		const ent = await refreshEntitlements();
		const unlocked = region === 'americas' ? ent.americas : ent.africa;
		if (unlocked) {
			toast({ title: 'Unlocked!', description: `${getRegionDisplayName(region)} is ready.` });
			onOpenChange(false);
			onUnlocked?.();
		} else {
			toast({
				title: 'Not unlocked yet',
				description:
					'Complete payment with your unlock code in the message, then try again.',
			});
		}
	};

	if (!isLoggedIn) {
		return (
			<>
				<Dialog open={open} onOpenChange={onOpenChange}>
					<DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Sign in first</DialogTitle>
							<DialogDescription>
								Paid regions are linked to your Google account so we can unlock them
								after your support on Buy Me a Coffee.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button onClick={() => setSignInOpen(true)}>
								<LogIn className="mr-2 h-4 w-4" />
								Sign in with Google
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				<SignInDialog
					open={signInOpen}
					onOpenChange={setSignInOpen}
					title="Sign in to unlock"
				/>
			</>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Coffee className="h-5 w-5 text-accent" />
						Unlock {getRegionDisplayName(region)}
					</DialogTitle>
					<DialogDescription asChild>
						<div className="space-y-3 text-left text-sm text-muted-foreground">
							<p>
								Support from{' '}
								<strong className="text-foreground">${BMC_MIN_SUPPORT_USD}+</strong>{' '}
								on{' '}
								<a
									href={BMC_PROFILE_URL}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary underline"
								>
									Buy Me a Coffee
								</a>{' '}
								unlocks this region for your account.
							</p>
							<ol className="list-decimal list-inside space-y-1">
								<li>Copy your unlock code below</li>
								<li>Open Buy Me a Coffee and paste it in the message field</li>
								<li>After payment, click &quot;I&apos;ve paid — refresh&quot;</li>
							</ol>
						</div>
					</DialogDescription>
				</DialogHeader>

				{alreadyUnlocked ? (
					<p className="text-sm text-primary font-medium">Already unlocked on this account.</p>
				) : (
					<div className="rounded-lg border bg-muted/40 p-3 space-y-2">
						<p className="text-xs font-medium text-muted-foreground">Your unlock code</p>
						<code className="block text-xs sm:text-sm break-all font-mono bg-background p-2 rounded border">
							{unlockNote}
						</code>
						<Button variant="outline" size="sm" className="w-full" onClick={handleCopy}>
							{copied ? (
								<Check className="mr-2 h-4 w-4" />
							) : (
								<Copy className="mr-2 h-4 w-4" />
							)}
							Copy unlock code
						</Button>
					</div>
				)}

				<DialogFooter className="flex-col gap-2 sm:flex-col">
					<Button asChild className="w-full">
						<a href={getBmcUrlForRegion(region)} target="_blank" rel="noopener noreferrer">
							<ExternalLink className="mr-2 h-4 w-4" />
							Open Buy Me a Coffee
						</a>
					</Button>
					<Button variant="secondary" className="w-full" onClick={handleRefresh}>
						I&apos;ve paid — refresh access
					</Button>
					<Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
