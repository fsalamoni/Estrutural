import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const args = process.argv.slice(2);
const projectId = args[0] ?? 'hocapp-44760';
const bucket = args[1] ?? `${projectId}.firebasestorage.app`;
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const target = `gs://${bucket}/firestore-backups/${timestamp}`;

const stdout = process.platform === 'win32'
  ? execFileSync(
      process.env.ComSpec ?? 'cmd.exe',
      [
        '/d',
        '/s',
        '/c',
        `gcloud config set project ${projectId} >NUL && gcloud firestore export ${target} --project=${projectId} --async`,
      ],
      {
        cwd: repoRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    )
  : execFileSync(
      'gcloud',
      ['firestore', 'export', target, '--project', projectId, '--async'],
      {
        cwd: repoRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    );

process.stdout.write(`${stdout.trim()}\n`);