import Image from 'next/image';

const AVATARS = [
	{ src: '/avatars/user-1.jpg', alt: 'Geography player smiling' },
	{ src: '/avatars/user-2.jpg', alt: 'Geography fan portrait' },
	{ src: '/avatars/user-3.jpg', alt: 'Student playing GeoGuesser' },
	{ src: '/avatars/user-4.jpg', alt: 'Map quiz enthusiast' },
];

export function SocialProofAvatars() {
	return (
		<div className="flex -space-x-2.5" aria-hidden>
			{AVATARS.map((avatar, i) => (
				<div
					key={avatar.src}
					className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full ring-2 ring-background overflow-hidden shadow-md shadow-black/40"
					style={{ zIndex: AVATARS.length - i }}
				>
					<Image
						src={avatar.src}
						alt={avatar.alt}
						width={40}
						height={40}
						className="h-full w-full object-cover"
						sizes="40px"
						priority
					/>
				</div>
			))}
		</div>
	);
}
