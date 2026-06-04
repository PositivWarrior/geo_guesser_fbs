import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import PlayPageClient from './play-client';

function PlayLoading() {
	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
			<Loader2 className="h-12 w-12 animate-spin text-primary" />
			<p className="text-muted-foreground text-sm">Preparing game…</p>
		</div>
	);
}

export default function PlayPage() {
	return (
		<Suspense fallback={<PlayLoading />}>
			<PlayPageClient />
		</Suspense>
	);
}
