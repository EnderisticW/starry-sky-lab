const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const envFile = path.join(projectRoot, '.env.local');
const outputFile = path.join(projectRoot, 'public', 'data', 'apod.json');

function loadLocalEnv() {
  if (!fs.existsSync(envFile)) return;
  const lines = fs.readFileSync(envFile, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match || match[1] in process.env) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

function sourcePage(date) {
  const compact = date.replaceAll('-', '').slice(2);
  return `https://apod.nasa.gov/apod/ap${compact}.html`;
}

async function refresh() {
  loadLocalEnv();
  const apiKey = process.env.NASA_API_KEY;

  if (!apiKey) {
    if (fs.existsSync(outputFile)) {
      console.log('NASA_API_KEY is not configured. Keeping the existing APOD cache.');
      console.log('Copy .env.example to .env.local and add your key to refresh it locally.');
      return;
    }
    throw new Error('NASA_API_KEY is required because no local cache exists.');
  }

  const endpoint = new URL('https://api.nasa.gov/planetary/apod');
  endpoint.searchParams.set('api_key', apiKey);
  endpoint.searchParams.set('thumbs', 'true');

  const response = await fetch(endpoint, {
    headers: { 'User-Agent': 'starry-sky-lab-apod-cache/1.0' },
  });
  if (!response.ok) throw new Error(`NASA APOD request failed: ${response.status}`);

  const data = await response.json();
  const payload = {
    date: data.date,
    title: data.title,
    explanation: data.explanation,
    media_type: data.media_type,
    url: data.url,
    hdurl: data.hdurl || null,
    thumbnail_url: data.thumbnail_url || null,
    copyright: data.copyright || null,
    source_url: sourcePage(data.date),
    service_version: data.service_version || 'v1',
    cache_status: 'fresh',
    synced_at: new Date().toISOString(),
  };

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  const temporaryFile = `${outputFile}.tmp`;
  fs.writeFileSync(temporaryFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.renameSync(temporaryFile, outputFile);
  console.log(`APOD cache updated: ${payload.date} / ${payload.title}`);
}

refresh().catch(error => {
  console.error(error.message);
  console.error('The previous APOD cache was preserved.');
  process.exitCode = 1;
});
