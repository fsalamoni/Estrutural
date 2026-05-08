#!/usr/bin/env node
/**
 * Seeds Firestore com as 11 plataformas declaradas em platforms-data.ts.
 *
 * Pré-requisitos:
 *   1. npm install --save-dev firebase-admin tsx
 *   2. Baixe a service account JSON do Firebase Console:
 *      Project Settings → Service accounts → Generate new private key
 *   3. Salve como ./service-account.json na raiz (já está no .gitignore)
 *
 * Uso:
 *   node scripts/seed-platforms.mjs                # cria/atualiza pelo slug
 *   node scripts/seed-platforms.mjs --dry-run      # mostra o plano sem escrever
 *   node scripts/seed-platforms.mjs --reset        # apaga tudo antes (CUIDADO)
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { register } from 'node:module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SA_PATH = resolve(ROOT, 'service-account.json');

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const RESET = args.has('--reset');

if (!existsSync(SA_PATH)) {
  console.error(
    `\n❌ service-account.json não encontrado em ${SA_PATH}\n` +
      `   Baixe em: Firebase Console → Project Settings → Service accounts\n`
  );
  process.exit(1);
}

let tsxLoaded = false;
try {
  register('tsx/esm', pathToFileURL('./'));
  tsxLoaded = true;
} catch {
  // tsx não disponível — fallback abaixo
}

let PLATFORMS;
if (tsxLoaded) {
  ({ PLATFORMS } = await import('./platforms-data.ts'));
} else {
  console.error(
    '\n❌ tsx não está instalado. Rode: npm install --save-dev tsx firebase-admin\n'
  );
  process.exit(1);
}

const { initializeApp, cert } = await import('firebase-admin/app');
const { getFirestore, FieldValue } = await import('firebase-admin/firestore');

const sa = JSON.parse(readFileSync(SA_PATH, 'utf-8'));
initializeApp({ credential: cert(sa) });
const db = getFirestore();
const col = db.collection('platforms');

console.log(`\n🌱 Seeding ${PLATFORMS.length} plataformas no projeto ${sa.project_id}\n`);

if (RESET) {
  console.log('⚠️  --reset: apagando todos os documentos existentes...');
  if (!DRY_RUN) {
    const snap = await col.get();
    const batch = db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    console.log(`   ${snap.size} docs apagados.\n`);
  }
}

const existing = DRY_RUN ? [] : (await col.get()).docs;
const bySlug = new Map(
  existing
    .filter((d) => d.data().slug)
    .map((d) => [d.data().slug, d])
);

let created = 0;
let updated = 0;
for (const p of PLATFORMS) {
  const existingDoc = bySlug.get(p.slug);
  const action = existingDoc ? 'UPDATE' : 'CREATE';
  console.log(`  ${action.padEnd(7)} ${p.slug.padEnd(20)} ${p.name}`);

  if (DRY_RUN) continue;

  if (existingDoc) {
    await existingDoc.ref.update({ ...p, updatedAt: FieldValue.serverTimestamp() });
    updated++;
  } else {
    await col.add({
      ...p,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    created++;
  }
}

console.log(
  DRY_RUN
    ? `\n📋 Dry-run: ${PLATFORMS.length} plataformas seriam processadas. Rode sem --dry-run para aplicar.\n`
    : `\n✅ Done: ${created} criadas, ${updated} atualizadas.\n`
);
