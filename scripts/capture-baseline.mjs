import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const args = process.argv.slice(2);
const projectId = args[0] ?? 'hocapp-44760';
const hostingUrl = args[1] ?? 'https://fsalomone.web.app';
const storageBucket = args[2] ?? `${projectId}.firebasestorage.app`;
const webAppId = args[3] ?? '1:143237037612:web:58b7018afb008c92031b89';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputDir = join(repoRoot, 'artifacts', 'baseline', timestamp);

mkdirSync(outputDir, { recursive: true });

function runCommand(command, commandArgs) {
  if (process.platform === 'win32') {
    const shellCommand = [command, ...commandArgs].join(' ');

    return execFileSync(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', shellCommand], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  }

  return execFileSync(command, commandArgs, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function captureCommand(command, commandArgs) {
  try {
    const stdout = runCommand(command, commandArgs);

    return {
      ok: true,
      command: [command, ...commandArgs].join(' '),
      stdout,
      stderr: '',
    };
  } catch (error) {
    return {
      ok: false,
      command: [command, ...commandArgs].join(' '),
      stdout: error.stdout?.toString() ?? '',
      stderr: error.stderr?.toString() ?? error.message,
      exitCode: typeof error.status === 'number' ? error.status : 1,
    };
  }
}

function writeJson(fileName, value) {
  writeFileSync(join(outputDir, fileName), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function writeText(fileName, value) {
  writeFileSync(join(outputDir, fileName), value, 'utf8');
}

async function captureHttp(url) {
  try {
    const response = await fetch(url, { redirect: 'follow' });
    const body = await response.text();

    return {
      ok: true,
      url,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body,
    };
  } catch (error) {
    return {
      ok: false,
      url,
      error: error instanceof Error ? error.message : 'Unknown HTTP error',
    };
  }
}

async function captureFirestorePlatforms() {
  const tokenResult = captureCommand('gcloud', ['auth', 'print-access-token']);

  if (!tokenResult.ok || !tokenResult.stdout.trim()) {
    return {
      ok: false,
      error: 'Nao foi possivel obter access token do gcloud.',
      details: tokenResult,
    };
  }

  const token = tokenResult.stdout.trim();
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/platforms?pageSize=200`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      url,
      documents: json.documents ?? [],
      raw: json,
    };
  } catch (error) {
    return {
      ok: false,
      url,
      error: error instanceof Error ? error.message : 'Unknown Firestore error',
    };
  }
}

async function main() {
  const captures = {
    gitHead: captureCommand('git', ['rev-parse', 'HEAD']),
    gitStatus: captureCommand('git', ['status', '--short', '--branch']),
    firebaseTargets: captureCommand('npx', ['firebase-tools', 'target', '--project', projectId]),
    firebaseApps: captureCommand('npx', ['firebase-tools', 'apps:list', 'WEB', '--project', projectId, '--json']),
    firebaseIndexes: captureCommand('npx', ['firebase-tools', 'firestore:indexes', '--project', projectId, '--pretty']),
    firebaseSites: captureCommand('npx', ['firebase-tools', 'hosting:sites:list', '--project', projectId]),
    gcloudAuth: captureCommand('gcloud', ['auth', 'list']),
    gcloudProject: captureCommand('gcloud', ['config', 'get-value', 'project']),
    gsutilBuckets: captureCommand('gsutil', ['ls', '-p', projectId]),
    storageCors: captureCommand('gsutil', ['cors', 'get', `gs://${storageBucket}`]),
    storageIcons: captureCommand('gsutil', ['ls', '-l', `gs://${storageBucket}/platform-icons/**`]),
    firebaseSdkConfig: captureCommand('npx', ['firebase-tools', 'apps:sdkconfig', 'WEB', webAppId, '--project', projectId, '--json']),
  };

  writeJson('manifest.json', {
    generatedAt: new Date().toISOString(),
    projectId,
    storageBucket,
    hostingUrl,
    webAppId,
    outputDir,
  });

  for (const [name, result] of Object.entries(captures)) {
    writeJson(`${name}.json`, result);
  }

  const liveRoot = await captureHttp(`${hostingUrl}/`);
  const liveRobots = await captureHttp(`${hostingUrl}/robots.txt`);
  const liveSitemap = await captureHttp(`${hostingUrl}/sitemap.xml`);
  const firestorePlatforms = await captureFirestorePlatforms();

  writeJson('live-root.json', liveRoot);
  writeJson('live-robots.json', liveRobots);
  writeJson('live-sitemap.json', liveSitemap);
  writeJson('firestore-platforms.json', firestorePlatforms);

  writeText(
    'SUMMARY.md',
    [
      '# Baseline Capture',
      '',
      `- Generated at: ${new Date().toISOString()}`,
      `- Project: ${projectId}`,
      `- Hosting URL: ${hostingUrl}`,
      `- Storage bucket: ${storageBucket}`,
      `- Web app: ${webAppId}`,
      '',
      'Generated files:',
      '- manifest.json',
      '- gitHead.json',
      '- gitStatus.json',
      '- firebaseTargets.json',
      '- firebaseApps.json',
      '- firebaseIndexes.json',
      '- firebaseSites.json',
      '- gcloudAuth.json',
      '- gcloudProject.json',
      '- gsutilBuckets.json',
      '- storageCors.json',
      '- storageIcons.json',
      '- firebaseSdkConfig.json',
      '- live-root.json',
      '- live-robots.json',
      '- live-sitemap.json',
      '- firestore-platforms.json',
      '',
    ].join('\n'),
  );

  process.stdout.write(`${outputDir}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exit(1);
});