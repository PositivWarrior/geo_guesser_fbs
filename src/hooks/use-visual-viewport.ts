'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks the visible viewport when the mobile keyboard opens so the game
 * layout can shrink instead of the keyboard covering the map.
 */
export function useVisualViewport() {
	const [height, setHeight] = useState<number | null>(null);
	const [offsetTop, setOffsetTop] = useState(0);

	useEffect(() => {
		const vv = window.visualViewport;
		if (!vv) return;

		const update = () => {
			setHeight(vv.height);
			setOffsetTop(vv.offsetTop);
		};

		update();
		vv.addEventListener('resize', update);
		vv.addEventListener('scroll', update);
		window.addEventListener('orientationchange', update);

		return () => {
			vv.removeEventListener('resize', update);
			vv.removeEventListener('scroll', update);
			window.removeEventListener('orientationchange', update);
		};
	}, []);

	const keyboardOpen =
		height != null &&
		typeof window !== 'undefined' &&
		height < window.innerHeight * 0.85;

	return {
		height: height ?? (typeof window !== 'undefined' ? window.innerHeight : 0),
		offsetTop,
		keyboardOpen,
	};
}
