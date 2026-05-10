import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const buildOnly = process.argv.includes('--build-only');
const stagingEnvPath = [join(repoRoot, '.env.staging.local'), join(repoRoot, '.env.staging.example')].find(existsSync);

if (!stagingEnvPath) {
  throw new Error('Nenhum arquivo de ambiente de staging encontrado. Use .env.staging.local ou .env.staging.example.');
}

function parseEnvFile(filePath) {
  const env = {};
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    let value = trimmedLine.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function resolveCommand(command) {
  if (process.platform === 'win32' && (command === 'npm' || command === 'npx')) {
    return `${command}.cmd`;
  }

  return command;
}

const stagingEnv = {
  ...process.env,
  ...parseEnvFile(stagingEnvPath),
  CI: process.env.CI ?? 'true',
};

function run(command, args, options = {}) {
  const shouldUseCmdShim = process.platform === 'win32' && (command === 'npm' || command === 'npx');
  const result = shouldUseCmdShim
    ? spawnSync(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', [resolveCommand(command), ...args].join(' ')], {
        cwd: repoRoot,
        env: stagingEnv,
        stdio: 'inherit',
      })
    : spawnSync(resolveCommand(command), args, {
        cwd: repoRoot,
        env: stagingEnv,
        stdio: 'inherit',
        shell: options.shell ?? false,
      });

  if (result.error) {
    process.stderr.write(`${result.error.message}\n`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function hasStorageBucket(bucketName) {
  if (!bucketName) {
    return false;
  }

  const result = process.platform === 'win32'
    ? spawnSync(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', `gsutil ls -b gs://${bucketName}`], {
        cwd: repoRoot,
        env: stagingEnv,
        stdio: 'ignore',
      })
    : spawnSync('gsutil', ['ls', '-b', `gs://${bucketName}`], {
        cwd: repoRoot,
        env: stagingEnv,
        stdio: 'ignore',
      });

  return result.status === 0;
}

process.stdout.write(`Using staging env file: ${stagingEnvPath.replace(`${repoRoot}\\`, '').replace(`${repoRoot}/`, '')}\n`);

run('npm', ['run', 'build']);

if (buildOnly) {
  process.exit(0);
}

const deployTargets = ['hosting', 'firestore:rules', 'firestore:indexes'];

if (hasStorageBucket(stagingEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)) {
  deployTargets.push('storage');
} else {
  process.stdout.write('Skipping staging Storage deploy because the default bucket is not available yet.\n');
}

run('npx', [
  'firebase-tools',
  'deploy',
  '--project',
  'hocapp-staging-44760',
  '--only',
  deployTargets.join(','),
  '--non-interactive',
]);