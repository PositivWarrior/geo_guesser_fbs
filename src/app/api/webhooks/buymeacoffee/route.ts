import { createHmac, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { grantPaidRegion } from '@/lib/firebase-admin';
import type { PaidRegion } from '@/lib/bmc';

export const runtime = 'nodejs';

const UNLOCK_CODE = /geo:([a-zA-Z0-9_-]+):(americas|africa)/i;

function verifySignature(rawBody: string, signature: string | null): boolean {
	const secret = process.env.BMC_WEBHOOK_SECRET?.trim();
	if (!secret) return false;
	if (!signature) return false;
	const expected = createHmac('sha256', secret)
		.update(rawBody)
		.digest('hex');
	try {
		return timingSafeEqual(
			Buffer.from(expected),
			Buffer.from(signature),
		);
	} catch {
		return false;
	}
}

function parseUnlockFromNote(note: string): {
	uid: string;
	region: PaidRegion;
} | null {
	const match = note.match(UNLOCK_CODE);
	if (!match) return null;
	return { uid: match[1], region: match[2].toLowerCase() as PaidRegion };
}

function resolveRegionFromExtras(
	extras: unknown,
): PaidRegion | null {
	if (!Array.isArray(extras)) return null;
	for (const item of extras) {
		const title = String(
			(item as { title?: string; name?: string })?.title ??
				(item as { name?: string })?.name ??
				'',
		).toLowerCase();
		if (title.includes('america')) return 'americas';
		if (title.includes('africa') || title.includes('afryk')) return 'africa';
		const id = String((item as { id?: string | number })?.id ?? '');
		if (id && id === process.env.BMC_EXTRA_ID_AMERICAS) return 'americas';
		if (id && id === process.env.BMC_EXTRA_ID_AFRICA) return 'africa';
	}
	return null;
}

function getSupportAmountUsd(data: Record<string, unknown>): number {
	const cents =
		Number(data.amount) ||
		Number(data.support_amount) ||
		Number(data.transaction_amount) ||
		0;
	if (cents > 100) return cents / 100;
	return cents;
}

export async function POST(request: Request) {
	const rawBody = await request.text();
	const signature =
		request.headers.get('x-signature-sha256') ??
		request.headers.get('X-Signature-SHA256');

	if (!verifySignature(rawBody, signature)) {
		return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
	}

	let payload: Record<string, unknown>;
	try {
		payload = JSON.parse(rawBody) as Record<string, unknown>;
	} catch {
		return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const data = (payload.data ?? payload) as Record<string, unknown>;
	const minUsd = Number(process.env.BMC_MIN_SUPPORT_USD ?? '3');
	const amountUsd = getSupportAmountUsd(data);

	if (amountUsd > 0 && amountUsd < minUsd) {
		return NextResponse.json(
			{ ok: false, reason: 'below_minimum' },
			{ status: 200 },
		);
	}

	const note = String(
		data.support_note ?? data.message ?? data.note ?? '',
	);
	const email = String(
		data.supporter_email ?? data.payer_email ?? data.email ?? '',
	);

	let uid: string | null = null;
	let region: PaidRegion | null = null;

	const fromNote = parseUnlockFromNote(note);
	if (fromNote) {
		uid = fromNote.uid;
		region = fromNote.region;
	}

	if (!region) {
		region = resolveRegionFromExtras(data.extras);
	}

	if (!region) {
		const combined = `${note} ${JSON.stringify(data.extras ?? '')}`.toLowerCase();
		if (combined.includes('america')) region = 'americas';
		else if (combined.includes('africa') || combined.includes('afryk'))
			region = 'africa';
	}

	if (!uid && email) {
		// Optional: match by email doc if you add email→uid mapping later
	}

	if (!uid || !region) {
		return NextResponse.json(
			{ ok: false, reason: 'no_unlock_match' },
			{ status: 200 },
		);
	}

	const granted = await grantPaidRegion(uid, region, email || undefined);
	if (!granted) {
		return NextResponse.json(
			{
				error:
					'Grant failed — configure FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY on the server',
			},
			{ status: 503 },
		);
	}

	return NextResponse.json({ ok: true, uid, region });
}
