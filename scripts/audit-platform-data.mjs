import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const artifactsRoot = join(repoRoot, 'artifacts', 'baseline');

const CATEGORY_SET = new Set(['Trabalho', 'IA', 'RPG', 'Jogos', 'Outros']);
const AUTH_METHOD_SET = new Set(['email', 'google', 'ambos', 'nenhum']);

function findLatestBaselineDir() {
  const dirs = readdirSync(artifactsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  if (dirs.length === 0) {
    throw new Error('Nenhum baseline encontrado em artifacts/baseline.');
  }

  return join(artifactsRoot, dirs.at(-1));
}

function parseFirestoreValue(fieldValue) {
  if (!fieldValue || typeof fieldValue !== 'object') {
    return null;
  }

  if ('stringValue' in fieldValue) {
    return fieldValue.stringValue;
  }

  if ('integerValue' in fieldValue) {
    return Number(fieldValue.integerValue);
  }

  if ('booleanValue' in fieldValue) {
    return fieldValue.booleanValue;
  }

  if ('timestampValue' in fieldValue) {
    return fieldValue.timestampValue;
  }

  return null;
}

function validateHttpsUrl(value) {
  if (typeof value !== 'string' || !value) {
    return false;
  }

  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

function auditPlatform(platformDocument) {
  const fields = Object.fromEntries(
    Object.entries(platformDocument.fields ?? {}).map(([key, fieldValue]) => [key, parseFirestoreValue(fieldValue)])
  );
  const id = platformDocument.name?.split('/').at(-1) ?? 'unknown';
  const issues = [];

  if (typeof fields.name !== 'string' || fields.name.trim().length === 0 || fields.name.length > 120) {
    issues.push('Nome fora da politica esperada.');
  }

  if (typeof fields.description !== 'string' || fields.description.length > 1000) {
    issues.push('Descricao fora da politica esperada.');
  }

  if (!CATEGORY_SET.has(fields.category)) {
    issues.push(`Categoria nao canonica: ${String(fields.category)}`);
  }

  if (!AUTH_METHOD_SET.has(fields.authMethod)) {
    issues.push(`Metodo de acesso invalido: ${String(fields.authMethod)}`);
  }

  if (!Number.isInteger(fields.order) || fields.order < 0) {
    issues.push(`Ordem invalida: ${String(fields.order)}`);
  }

  if (typeof fields.visible !== 'boolean') {
    issues.push('Campo visible invalido.');
  }

  if (!validateHttpsUrl(fields.accessUrl)) {
    issues.push(`URL de acesso invalida: ${String(fields.accessUrl)}`);
  }

  if (typeof fields.iconUrl !== 'string') {
    issues.push('Campo iconUrl invalido.');
  } else if (fields.iconUrl !== '' && !validateHttpsUrl(fields.iconUrl)) {
    issues.push(`URL de icone invalida: ${String(fields.iconUrl)}`);
  }

  if (typeof fields.createdAt !== 'string' || typeof fields.updatedAt !== 'string') {
    issues.push('Timestamps ausentes ou invalidos.');
  }

  return {
    id,
    name: fields.name,
    category: fields.category,
    order: fields.order,
    visible: fields.visible,
    accessUrl: fields.accessUrl,
    iconUrl: fields.iconUrl,
    authMethod: fields.authMethod,
    usesExternalIcon: typeof fields.iconUrl === 'string' && fields.iconUrl.startsWith('https://'),
    issues,
  };
}

function main() {
  const baselineDir = process.argv[2] ? resolve(process.argv[2]) : findLatestBaselineDir();
  const firestorePath = join(baselineDir, 'firestore-platforms.json');
  const storageCorsPath = join(baselineDir, 'storageCors.json');
  const rawFirestore = JSON.parse(readFileSync(firestorePath, 'utf8'));
  const rawStorageCors = JSON.parse(readFileSync(storageCorsPath, 'utf8'));
  const documents = Array.isArray(rawFirestore.documents) ? rawFirestore.documents : [];
  const auditedPlatforms = documents.map(auditPlatform);
  const orderMap = new Map();

  for (const platform of auditedPlatforms) {
    const orderKey = String(platform.order);
    const list = orderMap.get(orderKey) ?? [];
    list.push(platform.name ?? platform.id);
    orderMap.set(orderKey, list);
  }

  const duplicateOrders = [...orderMap.entries()]
    .filter(([, values]) => values.length > 1)
    .map(([order, values]) => ({ order: Number(order), values }));

  const categoryCounts = auditedPlatforms.reduce((acc, platform) => {
    const key = typeof platform.category === 'string' ? platform.category : 'INVALID';
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const issues = auditedPlatforms.filter((platform) => platform.issues.length > 0);
  const externalIconCount = auditedPlatforms.filter((platform) => platform.usesExternalIcon).length;

  const auditReport = {
    generatedAt: new Date().toISOString(),
    baselineDir,
    platformCount: auditedPlatforms.length,
    categoryCounts,
    duplicateOrders,
    invalidPlatforms: issues,
    externalIconCount,
    storageCorsSummary: rawStorageCors,
  };

  writeFileSync(join(baselineDir, 'platform-audit.json'), `${JSON.stringify(auditReport, null, 2)}\n`, 'utf8');

  const markdown = [
    '# Platform Audit',
    '',
    `- Generated at: ${auditReport.generatedAt}`,
    `- Baseline: ${baselineDir}`,
    `- Total platforms: ${auditReport.platformCount}`,
    `- Platforms with issues: ${issues.length}`,
    `- Platforms using external icon URLs: ${externalIconCount}`,
    `- Duplicate order slots: ${duplicateOrders.length}`,
    '',
    '## Category counts',
    ...Object.entries(categoryCounts).map(([category, count]) => `- ${category}: ${count}`),
    '',
    '## Duplicate order slots',
    ...(duplicateOrders.length > 0
      ? duplicateOrders.map((entry) => `- ${entry.order}: ${entry.values.join(', ')}`)
      : ['- None']),
    '',
    '## Invalid platforms',
    ...(issues.length > 0
      ? issues.map((platform) => `- ${platform.name ?? platform.id}: ${platform.issues.join(' | ')}`)
      : ['- None']),
    '',
    '## Storage CORS summary',
    `- ${typeof rawStorageCors.stdout === 'string' ? rawStorageCors.stdout.trim() || 'No output' : 'Unavailable'}`,
    '',
  ].join('\n');

  writeFileSync(join(baselineDir, 'platform-audit.md'), `${markdown}\n`, 'utf8');
  process.stdout.write(`${join(baselineDir, 'platform-audit.md')}\n`);
}

main();