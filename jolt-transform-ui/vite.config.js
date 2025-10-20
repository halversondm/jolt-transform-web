import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'path';
import {viteStaticCopy} from 'vite-plugin-static-copy';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        viteStaticCopy({
            targets: [
                {
                    src: 'src/json/**',
                    dest: ''
                }
            ]
        })
    ],
    build: {
        outDir: resolve(__dirname, 'target/classes/static'),
        emptyOutDir: true,
    },
    server: {
        proxy: {
            '/api/v1/jolt/transform': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                secure: false
            },
            '/run': {
                target: 'http://localhost:9300',
                changeOrigin: true,
                secure: false
            },
            '/apps': {
                target: 'http://localhost:9300',
                changeOrigin: true,
                secure: false
            }
        },
    },
});
