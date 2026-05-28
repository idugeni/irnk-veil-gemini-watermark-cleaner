import { defineConfig, createLogger, type Plugin } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

const logger = createLogger();
const originalWarn = logger.warn;
const runtimeEntry = path.resolve(__dirname, 'src/runtime/content-main.js');
const runtimeManifest = path.resolve(__dirname, 'src/runtime/modules/manifest.json');

function composeRuntimeContent(): string {
  const moduleManifest = JSON.parse(fs.readFileSync(runtimeManifest, 'utf8')) as { files?: string[] };
  const moduleFiles = Array.isArray(moduleManifest.files) ? moduleManifest.files : [];

  if (moduleFiles.length === 0) {
    throw new Error(`Runtime module manifest has no files: ${runtimeManifest}`);
  }

  const body = moduleFiles
    .map((relativeFile) => {
      const absoluteFile = path.resolve(__dirname, relativeFile);
      const content = fs.readFileSync(absoluteFile, 'utf8').trimEnd();
      return `  // ---- ${relativeFile} ----\n${content}`;
    })
    .join('\n\n');

  return `(() => {\n${body}\n})();\n`;
}

function runtimeComposer(): Plugin {
  return {
    name: 'gwc-runtime-composer',
    enforce: 'pre',
    load(id) {
      if (path.resolve(id) === runtimeEntry) {
        return composeRuntimeContent();
      }
      return null;
    },
  };
}

logger.warn = (msg, options) => {
  // Suppress warnings about rollupOptions and rolldownOptions conflict
  if (msg.includes('Both `rollupOptions` and `rolldownOptions` were specified')) return;
  // MAIN-world content scripts cannot use HMR; this is expected for MV3 extensions.
  if (msg.includes("Some content-scripts don't support HMR")) return;
  originalWarn(msg, options);
};

export default defineConfig({
  plugins: [runtimeComposer(), react(), tailwindcss(), crx({ manifest })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  customLogger: logger,
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  build: {
    // The content runtime is intentionally bundled as one MAIN-world script for Chrome MV3.
    chunkSizeWarningLimit: 900,
  },
});
