import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');

const result = spawnSync(process.execPath, ['--no-deprecation', viteBin, 'build'], {
  cwd: root,
  encoding: 'utf8',
});

function cleanBuildOutput(output = '') {
  return output
    .split(/\r?\n/)
    .filter((line) => !line.includes('[crx:content-scripts] Some content-scripts'))
    .filter((line) => !line.includes('/src/runtime/content-main.js'))
    .join('\n');
}

process.stdout.write(cleanBuildOutput(result.stdout));
process.stderr.write(cleanBuildOutput(result.stderr));
process.exit(result.status ?? 1);
