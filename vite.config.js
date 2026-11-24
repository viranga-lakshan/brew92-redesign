import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// base './' + HashRouter = works on GitHub Pages or any static host without server rules
export default defineConfig({ plugins: [react()], base: './', server: { port: 5176 } });
