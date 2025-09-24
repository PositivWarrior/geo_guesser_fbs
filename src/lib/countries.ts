export type Country = {
  name: string;
  iso2: string;
  aliases: string[];
  continent: 'Europe' | 'Asia' | 'Africa' | 'North America' | 'South America' | 'Oceania' | 'Antarctica';
  path: string;
};

// NOTE: The 'path' property contains SVG path data. This is a small subset for demonstration.
// A full implementation would have path data for all countries.
// The path data is illustrative and does not represent accurate geographical shapes.

export const countries: Country[] = [
  // Europe
  { name: 'France', iso2: 'FR', aliases: [], continent: 'Europe', path: 'M460 215 L465 220 L460 225 L455 220 Z' },
  { name: 'Germany', iso2: 'DE', aliases: [], continent: 'Europe', path: 'M470 210 L475 215 L470 220 L465 215 Z' },
  { name: 'Spain', iso2: 'ES', aliases: [], continent: 'Europe', path: 'M450 225 L455 230 L450 235 L445 230 Z' },
  { name: 'Italy', iso2: 'IT', aliases: [], continent: 'Europe', path: 'M475 225 L480 230 L475 235 L470 230 Z' },
  { name: 'United Kingdom', iso2: 'GB', aliases: ['UK', 'Great Britain', 'Britain'], continent: 'Europe', path: 'M450 200 L455 205 L450 210 L445 205 Z' },
  { name: 'Portugal', iso2: 'PT', aliases: [], continent: 'Europe', path: 'M440 228 L445 233 L440 238 L435 233 Z' },
  { name: 'Poland', iso2: 'PL', aliases: [], continent: 'Europe', path: 'M485 210 L495 210 L495 220 L485 220 Z' },
  { name: 'Sweden', iso2: 'SE', aliases: [], continent: 'Europe', path: 'M480 190 L490 185 L495 195 L485 200 Z' },
  { name: 'Norway', iso2: 'NO', aliases: [], continent: 'Europe', path: 'M470 185 L480 180 L485 190 L475 195 Z' },
  { name: 'Finland', iso2: 'FI', aliases: [], continent: 'Europe', path: 'M495 185 L505 180 L510 190 L500 195 Z' },
  { name: 'Greece', iso2: 'GR', aliases: [], continent: 'Europe', path: 'M495 240 L505 245 L500 255 L490 250 Z' },
  { name: 'Ukraine', iso2: 'UA', aliases: [], continent: 'Europe', path: 'M510 215 L525 215 L525 230 L510 230 Z' },
  { name: 'Romania', iso2: 'RO', aliases: [], continent: 'Europe', path: 'M500 225 L510 228 L508 238 L498 235 Z' },
  { name: 'Netherlands', iso2: 'NL', aliases: ['Holland'], continent: 'Europe', path: 'M463 207 L468 205 L470 210 L465 212 Z' },
  { name: 'Belgium', iso2: 'BE', aliases: [], continent: 'Europe', path: 'M460 210 L464 208 L466 213 L462 215 Z' },
  { name: 'Switzerland', iso2: 'CH', aliases: [], continent: 'Europe', path: 'M468 220 L472 218 L474 223 L470 225 Z' },
  { name: 'Austria', iso2: 'AT', aliases: [], continent: 'Europe', path: 'M478 220 L482 218 L484 223 L480 225 Z' },
  { name: 'Ireland', iso2: 'IE', aliases: [], continent: 'Europe', path: 'M435 205 L440 200 L445 208 L440 213 Z' },
  { name: 'Czech Republic', iso2: 'CZ', aliases: ['Czechia'], continent: 'Europe', path: 'M478 212 L488 212 L488 218 L478 218 Z' },
  { name: 'Hungary', iso2: 'HU', aliases: [], continent: 'Europe', path: 'M490 222 L498 222 L498 228 L490 228 Z' },

  // Asia
  { name: 'China', iso2: 'CN', aliases: [], continent: 'Asia', path: 'M700 240 L730 250 L720 270 L690 260 Z' },
  { name: 'India', iso2: 'IN', aliases: [], continent: 'Asia', path: 'M650 280 L670 285 L660 300 L640 295 Z' },
  { name: 'Japan', iso2: 'JP', aliases: [], continent: 'Asia', path: 'M800 230 L810 235 L805 245 L795 240 Z' },
  { name: 'Russia', iso2: 'RU', aliases: [], continent: 'Asia', path: 'M550 150 L750 150 L750 200 L550 200 Z' }, // Spans Europe and Asia
  { name: 'Indonesia', iso2: 'ID', aliases: [], continent: 'Asia', path: 'M730 340 L780 350 L770 360 L720 350 Z' },
  { name: 'Pakistan', iso2: 'PK', aliases: [], continent: 'Asia', path: 'M620 270 L640 270 L635 285 L615 285 Z' },
  { name: 'Bangladesh', iso2: 'BD', aliases: [], continent: 'Asia', path: 'M675 290 L685 290 L685 300 L675 300 Z' },
  { name: 'Philippines', iso2: 'PH', aliases: [], continent: 'Asia', path: 'M780 300 L790 310 L780 320 L770 310 Z' },
  { name: 'Vietnam', iso2: 'VN', aliases: [], continent: 'Asia', path: 'M725 305 L735 315 L730 325 L720 315 Z' },
  { name: 'Turkey', iso2: 'TR', aliases: [], continent: 'Asia', path: 'M530 240 L550 240 L545 250 L525 250 Z' },
  { name: 'Iran', iso2: 'IR', aliases: [], continent: 'Asia', path: 'M580 260 L610 260 L600 280 L570 280 Z' },
  { name: 'Thailand', iso2: 'TH', aliases: [], continent: 'Asia', path: 'M710 310 L720 315 L715 325 L705 320 Z' },
  { name: 'South Korea', iso2: 'KR', aliases: [], continent: 'Asia', path: 'M785 250 L795 250 L795 260 L785 260 Z' },
  { name: 'Saudi Arabia', iso2: 'SA', aliases: [], continent: 'Asia', path: 'M560 280 L590 290 L580 310 L550 300 Z' },
  { name: 'Israel', iso2: 'IL', aliases: [], continent: 'Asia', path: 'M535 265 L540 265 L540 270 L535 270 Z' },
  { name: 'United Arab Emirates', iso2: 'AE', aliases: ['UAE'], continent: 'Asia', path: 'M595 295 L605 298 L603 305 L593 302 Z' },

  // Africa
  { name: 'Nigeria', iso2: 'NG', aliases: [], continent: 'Africa', path: 'M470 300 L480 305 L475 315 L465 310 Z' },
  { name: 'Egypt', iso2: 'EG', aliases: [], continent: 'Africa', path: 'M520 270 L530 275 L525 285 L515 280 Z' },
  { name: 'South Africa', iso2: 'ZA', aliases: [], continent: 'Africa', path: 'M510 400 L520 405 L515 415 L505 410 Z' },
  { name: 'Kenya', iso2: 'KE', aliases: [], continent: 'Africa', path: 'M540 320 L550 325 L545 335 L535 330 Z' },
  { name: 'Ethiopia', iso2: 'ET', aliases: [], continent: 'Africa', path: 'M555 310 L565 315 L560 325 L550 320 Z' },
  { name: 'DR Congo', iso2: 'CD', aliases: ['Democratic Republic of the Congo'], continent: 'Africa', path: 'M500 330 L520 330 L510 350 L490 350 Z' },
  { name: 'Tanzania', iso2: 'TZ', aliases: [], continent: 'Africa', path: 'M535 340 L545 345 L540 355 L530 350 Z' },
  { name: 'Algeria', iso2: 'DZ', aliases: [], continent: 'Africa', path: 'M450 260 L480 260 L470 280 L440 280 Z' },
  { name: 'Morocco', iso2: 'MA', aliases: [], continent: 'Africa', path: 'M430 250 L445 255 L440 265 L425 260 Z' },
  { name: 'Ghana', iso2: 'GH', aliases: [], continent: 'Africa', path: 'M450 305 L460 305 L455 315 L445 315 Z' },
  { name: 'Ivory Coast', iso2: 'CI', aliases: ["Côte d'Ivoire"], continent: 'Africa', path: 'M435 300 L445 305 L440 315 L430 310 Z' },
  { name: 'Madagascar', iso2: 'MG', aliases: [], continent: 'Africa', path: 'M570 370 L580 380 L570 395 L560 385 Z' },
  
  // North America
  { name: 'United States', iso2: 'US', aliases: ['USA', 'America'], continent: 'North America', path: 'M180 200 L300 190 L310 240 L190 250 Z' },
  { name: 'Canada', iso2: 'CA', aliases: [], continent: 'North America', path: 'M150 120 L350 110 L350 190 L150 190 Z' },
  { name: 'Mexico', iso2: 'MX', aliases: [], continent: 'North America', path: 'M200 260 L280 260 L270 290 L210 290 Z' },
  { name: 'Guatemala', iso2: 'GT', aliases: [], continent: 'North America', path: 'M220 295 L240 295 L235 305 L215 305 Z' },
  { name: 'Cuba', iso2: 'CU', aliases: [], continent: 'North America', path: 'M260 270 L280 275 L275 280 L255 275 Z' },
  { name: 'Haiti', iso2: 'HT', aliases: [], continent: 'North America', path: 'M285 280 L295 280 L295 285 L285 285 Z' },
  { name: 'Dominican Republic', iso2: 'DO', aliases: [], continent: 'North America', path: 'M298 280 L308 280 L308 285 L298 285 Z' },
  { name: 'Honduras', iso2: 'HN', aliases: [], continent: 'North America', path: 'M245 298 L265 298 L260 308 L240 308 Z' },
  { name: 'Panama', iso2: 'PA', aliases: [], continent: 'North America', path: 'M270 310 L290 315 L285 320 L265 315 Z' },
  { name: 'Costa Rica', iso2: 'CR', aliases: [], continent: 'North America', path: 'M255 310 L265 310 L260 320 L250 320 Z' },

  // South America
  { name: 'Brazil', iso2: 'BR', aliases: [], continent: 'South America', path: 'M320 330 L380 320 L390 380 L330 390 Z' },
  { name: 'Argentina', iso2: 'AR', aliases: [], continent: 'South America', path: 'M290 400 L330 400 L320 450 L290 440 Z' },
  { name: 'Colombia', iso2: 'CO', aliases: [], continent: 'South America', path: 'M280 325 L310 325 L300 345 L270 345 Z' },
  { name: 'Peru', iso2: 'PE', aliases: [], continent: 'South America', path: 'M270 350 L300 350 L290 370 L260 370 Z' },
  { name: 'Venezuela', iso2: 'VE', aliases: [], continent: 'South America', path: 'M300 310 L330 310 L320 325 L290 325 Z' },
  { name: 'Chile', iso2: 'CL', aliases: [], continent: 'South America', path: 'M280 380 L290 380 L285 450 L275 450 Z' },
  { name: 'Ecuador', iso2: 'EC', aliases: [], continent: 'South America', path: 'M265 340 L280 340 L275 350 L260 350 Z' },
  { name: 'Bolivia', iso2: 'BO', aliases: [], continent: 'South America', path: 'M305 360 L335 360 L325 380 L295 380 Z' },
  { name: 'Paraguay', iso2: 'PY', aliases: [], continent: 'South America', path: 'M320 385 L340 385 L335 395 L315 395 Z' },
  { name: 'Uruguay', iso2: 'UY', aliases: [], continent: 'South America', path: 'M335 400 L350 400 L345 410 L330 410 Z' },

  // Oceania
  { name: 'Australia', iso2: 'AU', aliases: [], continent: 'Oceania', path: 'M750 380 L850 370 L860 430 L760 440 Z' },
  { name: 'New Zealand', iso2: 'NZ', aliases: [], continent: 'Oceania', path: 'M880 450 L900 460 L890 470 L870 460 Z' },
  { name: 'Papua New Guinea', iso2: 'PG', aliases: [], continent: 'Oceania', path: 'M840 350 L860 350 L855 360 L835 360 Z' },
  { name: 'Fiji', iso2: 'FJ', aliases: [], continent: 'Oceania', path: 'M910 390 L920 395 L915 405 L905 400 Z' }
];
