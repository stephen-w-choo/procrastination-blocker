import { defineConfig } from "vite"

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                content: "./src/entry-points/content.tsx",
            },
            output: {
                // Remove the hash from the file names
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`,
                inlineDynamicImports: true,
            },
        },
        outDir: "./build/content",
        assetsDir: "./",
    }
})
