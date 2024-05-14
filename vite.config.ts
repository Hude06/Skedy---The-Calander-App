import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist', // Make sure this directory matches the "webDir" in capacitor.config.json
    minify: false,
    emptyOutDir: true,
  },
});
