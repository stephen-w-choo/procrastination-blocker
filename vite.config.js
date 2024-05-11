import { defineConfig } from "vite"

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                content: "./src/content.tsx",
                background: "./src/background.ts"
            },
            output: {
                // Remove the hash from the file names
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`
            }
        },
        outDir: "./build",
        assetsDir: "./",
    }
})
