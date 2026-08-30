import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.tsx'),
        rsc: resolve(__dirname, 'src/rsc.tsx'),
      },
      name: 'ServerlessGithubCalendar',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'fs', 'path'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
