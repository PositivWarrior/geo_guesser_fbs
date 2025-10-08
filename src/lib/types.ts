export interface Country {
	name: {
		common: string;
		official: string;
	};
	cca2: string; // ISO 3166-1 alpha-2
	cca3: string; // ISO 3166-1 alpha-3
	region: string; // Continent
	subregion: string;
	translations: {
		[key: string]: {
			official: string;
			common: string;
		};
	};
	demonyms: {
		[key: string]: {
			f: string;
			m: string;
		};
	};
	guessed?: boolean;
}
