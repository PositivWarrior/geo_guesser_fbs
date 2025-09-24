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
  { name: 'France', iso2: 'FR', aliases: [], continent: 'Europe', path: 'M458.4 219.5l-3.3-2.8-1.5-4-3.1.2-2.3-1.8-1.8 1.9-2.5 1.2-.5 3.1 1.5 2.5 1.3 2.1 3.3.4 2.5 2.1.2 2.3-2.3-1-3.2-2.5-3z' },
  { name: 'Germany', iso2: 'DE', aliases: [], continent: 'Europe', path: 'M476.2 212.7l-4.1-1.6-2.5 2.3-1.2 3.2.9 2.9 2.3 1.9 3.4.3 3.1-2 .5-3.3-2.4-3.7z' },
  { name: 'Spain', iso2: 'ES', aliases: [], continent: 'Europe', path: 'M445.3 232.8l-7.3-1.2-2.6 3.9-1.3 3.9.7 2.4 3.7 1.2 5.3-.2 4-2.8.2-3.1-2.7-4.1z' },
  { name: 'Italy', iso2: 'IT', aliases: [], continent: 'Europe', path: 'M477.5 229.4l-.5 4.5-1.5 3.2-1.9 3.5.7 1.8 1.8.4 3.1-2.2 2-3 .5-3.8.3-2.3-4.1-5.4z' },
  { name: 'United Kingdom', iso2: 'GB', aliases: ['UK', 'Great Britain', 'Britain'], continent: 'Europe', path: 'M452.8 201.2l-3.2 2.8-1.5 4.7-.7 3.2.9 2.9 2.5.3 3.8-1.9 2.3-3.1.3-4.2-4.9-4.7z' },
  { name: 'Portugal', iso2: 'PT', aliases: [], continent: 'Europe', path: 'M437.1 228.8l-3.3.7-1.5 4.1.2 3.1 2.3 2.5 3.1.2 1.8-2.3.2-4.3-2.8-4.2z' },
  { name: 'Poland', iso2: 'PL', aliases: [], continent: 'Europe', path: 'M490.1 211.3l-2.6 3.1-1.3 4.2.9 3.2 3.1.9 4.3-.5 3.2-2.1.3-3.7-7.9-5.1z' },
  { name: 'Sweden', iso2: 'SE', aliases: [], continent: 'Europe', path: 'M483.3 189.6l-2.1 4.5-1.1 5.3.7 3.9 2.6 1.8 4.3.4 5.3-1.8 2.5-4.1-.2-6.3-12-3.7z' },
  { name: 'Norway', iso2: 'NO', aliases: [], continent: 'Europe', path: 'M471.2 186.4l-1.3 5.4.2 4.1 1.9 3.2 3.7 1.9 4.8.4 3.3-2.6-1.1-6.7-11.5-5.9z' },
  { name: 'Finland', iso2: 'FI', aliases: [], continent: 'Europe', path: 'M499.2 184.7l-2.9 4.6-1.1 4.9.7 3.7 2.5 2.1 4.1.5 4.9-1.3 2-3.8-.3-5.7-9.9-5z' },
  { name: 'Greece', iso2: 'GR', aliases: [], continent: 'Europe', path: 'M498.4 243.2l-4.1 1.9-1.8 3.2.4 2.9 2.3 2.1 3.9.7 4.1-1.5 1.5-3.4-.7-3.9-5.6-2z' },
  { name: 'Ukraine', iso2: 'UA', aliases: [], continent: 'Europe', path: 'M514.9 216.3l-3.7 4.5-1.5 4.9.9 3.9 3.3 2.1 5.1.7 5.3-2.1 2.1-4.3-.7-5.9-10.8-4.8z' },
  { name: 'Romania', iso2: 'RO', aliases: [], continent: 'Europe', path: 'M501.1 227.3l-2.3 3.7.2 3.4 2.1 2.8 3.9 1.1 4.3-.9 2.5-2.8-.2-3.7-10.5-3.6z' },
  { name: 'Netherlands', iso2: 'NL', aliases: ['Holland'], continent: 'Europe', path: 'M464.2 207.8l-1.8 2.3.1 2.5 1.5 1.9 2.3.2 2-1.3-.1-2.3-5-3.3z' },
  { name: 'Belgium', iso2: 'BE', aliases: [], continent: 'Europe', path: 'M460.8 211.2l-.5 2.7 1.3 2.3 2.1.7 2.3-.5 1.1-1.9-.5-2.6-5.8-1.4z' },
  { name: 'Switzerland', iso2: 'CH', aliases: [], continent: 'Europe', path: 'M469.3 221.1l-.9 2.8 1.1 2.3 2.1.9 2.3-.7.9-2.1-.9-2.6-4.6-2.6z' },
  { name: 'Austria', iso2: 'AT', aliases: [], continent: 'Europe', path: 'M479.5 220.8l-1.3 2.5.7 2.3 2.1 1.5 2.8.2 2.3-1.3.2-2.3-7.8-2.9z' },
  { name: 'Ireland', iso2: 'IE', aliases: [], continent: 'Europe', path: 'M437.5 204.9l-2.3 3.1.2 3.3 2.1 2.8 3.1.5 2.8-2.1-.2-3.3-8-4.3z' },
  { name: 'Czech Republic', iso2: 'CZ', aliases: ['Czechia'], continent: 'Europe', path: 'M480.2 213.1l-1.8 2.1.5 2.3 1.9 1.5 2.8.2 2.3-1.3.2-2.3-6.9-2.5z' },
  { name: 'Hungary', iso2: 'HU', aliases: [], continent: 'Europe', path: 'M491.3 223.4l-1.1 2.3.9 2.1 2.1 1.3 2.8.2 2.1-1.3.2-2.1-7-2.5z' },

  // Asia
  { name: 'China', iso2: 'CN', aliases: [], continent: 'Asia', path: 'M698.3 245.9l-9.1 12.2-6.3 11.5 4.3 9.8 11.5 7.1 15.2-3.3 10.1-9.3-2.1-14.8-23.6-13.2z' },
  { name: 'India', iso2: 'IN', aliases: [], continent: 'Asia', path: 'M648.7 283.4l-4.5 9.1.9 11.3 7.8 8.1 12.3 2.1 9.8-6.3 3.1-10.8-29.4-13.5z' },
  { name: 'Japan', iso2: 'JP', aliases: [], continent: 'Asia', path: 'M802.1 233.9l-2.1 7.3.9 5.8 4.1 3.9 5.6.9 4.3-3.1 1.1-5.6-16.9-9.2z' },
  { name: 'Russia', iso2: 'RU', aliases: [], continent: 'Asia', path: 'M548.1 153.2l23.4-4.1 31.2 1.1 45.3 6.3 41.2 5.8 33.4-1.3 28.7 5.4-11.3 43.1-48.7 11.2-61.3 3.4-53.1-5.6-32.5-8.1-1.3-55.2z' }, // Spans Europe and Asia
  { name: 'Indonesia', iso2: 'ID', aliases: [], continent: 'Asia', path: 'M728.5 342.1l11.3 5.6 8.7 6.3 2.1 8.7-7.6 5.4-13.2 1.8-10.3-4.5-5.6-9.1z' },
  { name: 'Pakistan', iso2: 'PK', aliases: [], continent: 'Asia', path: 'M621.3 272.1l-5.6 7.8.9 9.3 6.3 7.1 9.8 1.1 7.3-5.4-1.3-10.1-23.7-10.8z' },
  { name: 'Bangladesh', iso2: 'BD', aliases: [], continent: 'Asia', path: 'M676.8 291.2l-1.8 4.3.7 3.9 3.1 3.2 4.1.7 3.2-1.9-.7-3.7-8.6-6.5z' },
  { name: 'Philippines', iso2: 'PH', aliases: [], continent: 'Asia', path: 'M781.3 301.9l-4.1 6.3.9 5.8 4.5 4.3 5.8.9 4.1-3.3 1.1-5.6-17.3-9.4z' },
  { name: 'Vietnam', iso2: 'VN', aliases: [], continent: 'Asia', path: 'M726.8 307.2l-4.5 7.1.9 6.3 4.8 4.5 6.1.9 4.3-3.3 1.1-5.8-17.6-10.7z' },
  { name: 'Turkey', iso2: 'TR', aliases: [], continent: 'Asia', path: 'M532.1 241.9l-8.7 2.1-3.4 6.3.9 5.8 5.6 4.3 8.1.9 6.3-3.7 1.8-5.6-16.5-12.1z' },
  { name: 'Iran', iso2: 'IR', aliases: [], continent: 'Asia', path: 'M582.1 263.2l-10.1 3.4-5.6 8.7.9 7.8 7.3 6.3 11.5 1.8 9.8-5.6 3.1-8.7-27-12.1z' },
  { name: 'Thailand', iso2: 'TH', aliases: [], continent: 'Asia', path: 'M711.5 312.1l-4.3 6.3.9 5.8 4.5 4.3 5.8.9 4.1-3.3 1.1-5.6-17.1-9.4z' },
  { name: 'South Korea', iso2: 'KR', aliases: [], continent: 'Asia', path: 'M786.8 251.2l-1.8 4.3.7 3.9 3.1 3.2 4.1.7 3.2-1.9-.7-3.7-8.6-6.5z' },
  { name: 'Saudi Arabia', iso2: 'SA', aliases: [], continent: 'Asia', path: 'M562.1 283.4l-7.1 10.1-3.4 11.5 2.1 9.8 9.3 7.1 13.5 1.8 11.5-6.3 4.1-10.8-31-23.2z' },
  { name: 'Israel', iso2: 'IL', aliases: [], continent: 'Asia', path: 'M536.1 266.2l-.7 2.3.5 1.8 1.5 1.3 2.1.2 1.5-1.1-.5-1.8-5.4-3.7z' },
  { name: 'United Arab Emirates', iso2: 'AE', aliases: ['UAE'], continent: 'Asia', path: 'M596.3 297.1l-3.1 1.5.4 2.8 2.3 2.3 3.2.5 2.8-1.5-.4-2.8-5.2-5.3z' },

  // Africa
  { name: 'Nigeria', iso2: 'NG', aliases: [], continent: 'Africa', path: 'M471.2 301.9l-5.4 4.3.9 7.1 5.8 5.6 8.1 1.1 6.3-4.5 1.8-6.9-23.3-13.7z' },
  { name: 'Egypt', iso2: 'EG', aliases: [], continent: 'Africa', path: 'M521.5 272.1l-6.3 3.7-2.6 7.8.9 6.3 5.4 5.1 8.1.9 6.3-4.1 1.8-6.3-19.8-12.5z' },
  { name: 'South Africa', iso2: 'ZA', aliases: [], continent: 'Africa', path: 'M512.1 401.9l-6.3 8.7.9 10.1 7.1 8.7 11.5 3.4 9.8-6.3 3.1-10.1-32.4-23.2z' },
  { name: 'Kenya', iso2: 'KE', aliases: [], continent: 'Africa', path: 'M541.3 321.9l-5.6 5.4.9 6.3 5.8 4.8 7.3.9 5.6-4.1 1.5-6.3-21-12.2z' },
  { name: 'Ethiopia', iso2: 'ET', aliases: [], continent: 'Africa', path: 'M556.5 311.9l-5.8 6.3.9 7.1 6.3 5.4 8.7.9 6.3-4.5 1.8-6.9-25.3-15.5z' },
  { name: 'DR Congo', iso2: 'CD', aliases: ['Democratic Republic of the Congo'], continent: 'Africa', path: 'M502.1 332.1l-11.5 4.3-4.5 10.1 2.1 9.8 9.3 7.1 13.5 1.8 11.5-6.3 4.1-10.8-30.5-20.3z' },
  { name: 'Tanzania', iso2: 'TZ', aliases: [], continent: 'Africa', path: 'M536.5 341.9l-5.8 6.3.9 7.1 6.3 5.4 8.7.9 6.3-4.5 1.8-6.9-25.3-15.5z' },
  { name: 'Algeria', iso2: 'DZ', aliases: [], continent: 'Africa', path: 'M452.1 261.9l-11.5 3.4-4.5 9.1 2.1 8.7 9.3 6.3 13.5 1.8 11.5-6.3 4.1-9.8-30.5-18.3z' },
  { name: 'Morocco', iso2: 'MA', aliases: [], continent: 'Africa', path: 'M431.5 251.9l-7.1 4.3-2.6 7.8.9 6.3 5.4 5.1 8.1.9 6.3-4.1 1.8-6.3-18.7-14.9z' },
  { name: 'Ghana', iso2: 'GH', aliases: [], continent: 'Africa', path: 'M451.3 306.9l-5.6 1.8-1.8 5.4.9 4.3 4.1 3.4 5.8.7 4.5-2.1 1.1-4.3-14.7-9.2z' },
  { name: 'Ivory Coast', iso2: 'CI', aliases: ["Côte d'Ivoire"], continent: 'Africa', path: 'M436.5 301.9l-5.8 4.3.9 6.3 5.4 4.8 7.3.9 5.6-4.1 1.5-6.3-20.8-11.1z' },
  { name: 'Madagascar', iso2: 'MG', aliases: [], continent: 'Africa', path: 'M571.3 371.9l-4.1 7.1.9 8.7 5.6 7.3 8.1.9 6.3-5.4 1.8-8.1-24.5-17.8z' },
  
  // North America
  { name: 'United States', iso2: 'US', aliases: ['USA', 'America'], continent: 'North America', path: 'M178.5 203.2l21.3-11.5 33.4-2.1 41.2 8.7 23.4 10.1-5.6 28.7-15.2 18.3-28.7 11.5-41.2-4.3-31.2-15.2-1.3-45.5z' },
  { name: 'Canada', iso2: 'CA', aliases: [], continent: 'North America', path: 'M148.7 121.9l28.7-10.1 41.2-4.3 51.2 6.3 48.7 5.4 15.2-1.3-11.5 35.4-33.4 21.3-45.3 11.5-58.7 2.1-41.2-11.5-4.5-55.6z' },
  { name: 'Mexico', iso2: 'MX', aliases: [], continent: 'North America', path: 'M201.3 261.9l15.2 0 21.3 5.4 18.3 8.7 3.4 11.5-11.5 10.1-23.4 3.4-28.7-5.4-8.7-13.5-3.4-20.2z' },
  { name: 'Guatemala', iso2: 'GT', aliases: [], continent: 'North America', path: 'M221.3 296.9l5.4 0 4.3 2.1 2.6 3.4-2.1 3.4-5.4 1.1-4.8-1.8-2.3-4.5.9-3.7z' },
  { name: 'Cuba', iso2: 'CU', aliases: [], continent: 'North America', path: 'M261.3 271.9l8.7 2.1 5.4 1.8 2.3 2.1-3.4 2.6-7.3 1.1-5.6-1.8-1.8-3.7.9-4.2z' },
  { name: 'Haiti', iso2: 'HT', aliases: [], continent: 'North America', path: 'M286.3 281.2l3.4.7 1.8 1.5.7 1.8-1.5 1.8-3.4.5-2.1-1.1-.5-2.1.7-2.6z' },
  { name: 'Dominican Republic', iso2: 'DO', aliases: [], continent: 'North America', path: 'M299.3 281.2l3.4.7 1.8 1.5.7 1.8-1.5 1.8-3.4.5-2.1-1.1-.5-2.1.7-2.6z' },
  { name: 'Honduras', iso2: 'HN', aliases: [], continent: 'North America', path: 'M246.3 299.9l6.3.7 4.3 2.1 2.3 3.4-2.6 3.4-6.3.7-4.5-2.1-2.1-3.9.7-5.3z' },
  { name: 'Panama', iso2: 'PA', aliases: [], continent: 'North America', path: 'M271.3 311.9l5.4 1.8 3.4 2.1 1.8 2.6-2.1 3.4-5.4 1.1-3.7-1.8-1.5-3.4.7-4.8z' },
  { name: 'Costa Rica', iso2: 'CR', aliases: [], continent: 'North America', path: 'M256.3 311.9l4.5.7 3.4 2.1 1.8 2.6-2.1 3.4-4.5.7-2.8-1.8-1.5-3.4.7-4.8z' },

  // South America
  { name: 'Brazil', iso2: 'BR', aliases: [], continent: 'South America', path: 'M321.3 331.9l15.2-8.7 21.3-4.3 18.3 5.4 8.7 11.5 2.1 15.2-10.1 21.3-20.2 11.5-28.7 3.4-11.5-20.2-5.4-28.7z' },
  { name: 'Argentina', iso2: 'AR', aliases: [], continent: 'South America', path: 'M291.3 401.9l8.7 0 11.5 8.7 8.7 13.5 2.1 15.2-8.7 11.5-15.2 2.1-11.5-13.5-3.4-21.3.9-35.4z' },
  { name: 'Colombia', iso2: 'CO', aliases: [], continent: 'South America', path: 'M281.3 326.9l8.7 0 5.4 8.7 2.1 10.1-5.4 8.7-8.7-2.1-3.4-11.5-1.8-13.9z' },
  { name: 'Peru', iso2: 'PE', aliases: [], continent: 'South America', path: 'M271.3 351.9l8.7 0 5.4 8.7 2.1 10.1-5.4 8.7-8.7-2.1-3.4-11.5-1.8-13.9z' },
  { name: 'Venezuela', iso2: 'VE', aliases: [], continent: 'South America', path: 'M301.3 311.9l8.7 0 5.4 5.4 2.1 8.7-5.4 8.7-8.7-2.1-3.4-8.7-1.8-10.1z' },
  { name: 'Chile', iso2: 'CL', aliases: [], continent: 'South America', path: 'M281.3 381.9l2.1 0 .9 21.3.9 23.4-2.1 11.5-3.4-1.1-1.8-18.3-.9-21.3 3.4-15.5z' },
  { name: 'Ecuador', iso2: 'EC', aliases: [], continent: 'South America', path: 'M266.3 341.9l4.5.7 3.4 2.1 1.8 2.6-2.1 3.4-4.5.7-2.8-1.8-1.5-3.4.7-4.8z' },
  { name: 'Bolivia', iso2: 'BO', aliases: [], continent: 'South America', path: 'M306.3 361.9l8.7 0 5.4 8.7 2.1 10.1-5.4 8.7-8.7-2.1-3.4-11.5-1.8-13.9z' },
  { name: 'Paraguay', iso2: 'PY', aliases: [], continent: 'South America', path: 'M321.3 386.9l5.4.7 3.4 2.1 1.8 2.6-2.1 3.4-5.4.7-3.4-1.8-1.5-3.4.7-4.8z' },
  { name: 'Uruguay', iso2: 'UY', aliases: [], continent: 'South America', path: 'M336.3 401.9l5.4.7 3.4 2.1 1.8 2.6-2.1 3.4-5.4.7-3.4-1.8-1.5-3.4.7-4.8z' },

  // Oceania
  { name: 'Australia', iso2: 'AU', aliases: [], continent: 'Oceania', path: 'M751.3 381.9l21.3-10.1 31.2-2.1 28.7 11.5 11.5 21.3 0 28.7-18.3 15.2-28.7 5.4-33.4-8.7-15.2-21.3-3.4-31.2 5.4-8.7z' },
  { name: 'New Zealand', iso2: 'NZ', aliases: [], continent: 'Oceania', path: 'M881.3 451.9l5.4 3.4 3.4 5.4 1.8 8.7-4.3 6.3-6.3.7-4.5-4.3-1.8-7.3.9-8.7z' },
  { name: 'Papua New Guinea', iso2: 'PG', aliases: [], continent: 'Oceania', path: 'M841.3 351.9l5.4.7 3.4 2.1 1.8 2.6-2.1 3.4-5.4.7-3.4-1.8-1.5-3.4.7-4.8z' },
  { name: 'Fiji', iso2: 'FJ', aliases: [], continent: 'Oceania', path: 'M911.3 391.9l4.3.7 2.3 2.1 1.1 3.4-1.8 3.4-4.3.5-3.2-1.8-1.1-3.2.7-5.1z' }
];
