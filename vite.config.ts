import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Respeita a porta indicada pelo ambiente (PORT); sem ela, usa a padrão do Vite.
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    server: { port: env.PORT ? Number(env.PORT) : 5173 },
  };
});
