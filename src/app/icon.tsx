import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/** Compass favicon matching the in-app logo */
export default function Icon() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: 'linear-gradient(135deg, #1e3a2f 0%, #2d5a47 100%)',
					borderRadius: 6,
				}}
			>
				<svg
					width="22"
					height="22"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#2ECC71"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="12" cy="12" r="10" />
					<polygon
						points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
						fill="#F39C12"
						stroke="#F39C12"
					/>
				</svg>
			</div>
		),
		{ ...size },
	);
}
