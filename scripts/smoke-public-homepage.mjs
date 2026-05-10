const targetUrl = process.argv[2] ?? process.env.SMOKE_URL;

if (!targetUrl) {
  process.stderr.write('Provide a homepage URL as the first argument or set SMOKE_URL.\n');
  process.exit(1);
}

const cacheBustUrl = new URL(targetUrl);
cacheBustUrl.searchParams.set('ts', Date.now().toString());

const response = await fetch(cacheBustUrl, {
  headers: {
    'cache-control': 'no-cache',
  },
});

if (!response.ok) {
  process.stderr.write(`Homepage smoke check failed: ${response.status} ${response.statusText}\n`);
  process.exit(1);
}

const html = await response.text();
const requiredSnippets = ['SALOMONE', 'Lexio', 'OmniDice'];
const forbiddenSnippets = ['carregar as plataformas'];

for (const snippet of requiredSnippets) {
  if (!html.includes(snippet)) {
    process.stderr.write(`Homepage smoke check failed: missing snippet "${snippet}".\n`);
    process.exit(1);
  }
}

for (const snippet of forbiddenSnippets) {
  if (html.includes(snippet)) {
    process.stderr.write(`Homepage smoke check failed: forbidden snippet "${snippet}" detected.\n`);
    process.exit(1);
  }
}

process.stdout.write(`Homepage smoke check passed for ${cacheBustUrl.origin}${cacheBustUrl.pathname}.\n`);