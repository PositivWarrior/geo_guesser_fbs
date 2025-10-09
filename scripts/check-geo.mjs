// Node 18+ ESM script to validate that every Natural Earth country geometry
// maps to a REST Countries entry using the same heuristics as the app.

const normalize = (str) =>
  (str ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const aliasMap = {
  'czech republic': 'czechia',
  swaziland: 'eswatini',
  'cape verde': 'cabo verde',
  burma: 'myanmar',
  macedonia: 'north macedonia',
  'ivory coast': "cote d'ivoire",
  'congo (kinshasa)': 'congo (democratic republic of the)',
  'dem. rep. congo': 'congo (democratic republic of the)',
  'congo, dem. rep.': 'congo (democratic republic of the)',
  'congo (brazzaville)': 'congo',
  'congo, rep.': 'congo',
  bolivia: 'bolivia (plurinational state of)',
  iran: 'iran (islamic republic of)',
  laos: "lao people's democratic republic",
  moldova: 'moldova, republic of',
  palestine: 'palestine, state of',
  russia: 'russian federation',
  syria: 'syrian arab republic',
  tanzania: 'tanzania, united republic of',
  'the bahamas': 'bahamas',
  'the gambia': 'gambia',
  'vatican city': 'holy see',
  vietnam: 'viet nam',
  'north korea': "korea (democratic people's republic of)",
  'south korea': 'korea (republic of)',
  micronesia: 'micronesia (federated states of)',
  'northern cyprus': 'cyprus',
  somaliland: 'somalia',
};

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  return res.json();
};

const buildCountryIndex = (list) => {
  const byCca2 = new Map();
  const byCca3 = new Map();
  const byName = new Map();
  const pushName = (n, c) => {
    const k = normalize(n);
    if (!k) return;
    if (!byName.has(k)) byName.set(k, c);
  };
  for (const c of list) {
    if (c.cca2) byCca2.set(c.cca2.toUpperCase(), c);
    if (c.cca3) byCca3.set(c.cca3.toUpperCase(), c);
    pushName(c.name?.common, c);
    pushName(c.name?.official, c);
    for (const t of Object.values(c.translations || {})) {
      pushName(t?.common, c);
      pushName(t?.official, c);
    }
    for (const d of Object.values(c.demonyms || {})) {
      pushName(d?.m, c);
      pushName(d?.f, c);
    }
  }
  return { byCca2, byCca3, byName };
};

const resolveCountry = (props, idx) => {
  const code2 = props.ISO_A2 || props.WB_A2 || props.iso_a2 || props.wb_a2;
  const code3 = props.ISO_A3 || props.ADM0_A3 || props.iso_a3 || props.adm0_a3;
  const nameRaw = props.NAME || props.NAME_LONG || props.ADMIN || props.BRK_NAME || props.FORMAL_EN || props.name || props.name_long;

  const try2 = code2 && code2 !== '-99' && idx.byCca2.get(String(code2).toUpperCase());
  if (try2) return try2;
  const try3 = code3 && code3 !== '-99' && idx.byCca3.get(String(code3).toUpperCase());
  if (try3) return try3;

  const norm = normalize(String(nameRaw || ''));
  if (idx.byName.get(norm)) return idx.byName.get(norm);

  const alias = aliasMap[norm];
  if (alias && idx.byName.get(normalize(alias))) return idx.byName.get(normalize(alias));

  return undefined;
};

const main = async () => {
  const topo = await fetchJson('https://unpkg.com/world-atlas@2/countries-110m.json');
  const geoms = topo?.objects?.countries?.geometries || [];
  const [africa, americas, asia, europe, oceania] = await Promise.all([
    fetchJson('https://restcountries.com/v3.1/region/africa'),
    fetchJson('https://restcountries.com/v3.1/region/americas'),
    fetchJson('https://restcountries.com/v3.1/region/asia'),
    fetchJson('https://restcountries.com/v3.1/region/europe'),
    fetchJson('https://restcountries.com/v3.1/region/oceania'),
  ]);
  const map = new Map();
  for (const c of [...africa, ...americas, ...asia, ...europe, ...oceania]) map.set(c.cca3, c);
  const countries = Array.from(map.values());
  const idx = buildCountryIndex(countries);

  const unmatched = [];
  for (const g of geoms) {
    const props = g.properties || {};
    const resolved = resolveCountry(props, idx);
    if (!resolved) {
      const name = props.NAME || props.ADMIN || props.BRK_NAME || props.NAME_LONG || props.FORMAL_EN || 'UNKNOWN';
      unmatched.push({ name, props });
    }
  }
  if (unmatched.length > 0) {
    console.error(`Unmatched geographies: ${unmatched.length}`);
    for (const u of unmatched) console.error(` - ${u.name}`);
    process.exit(1);
  }
  console.log('All geographies matched to guessable countries.');
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

