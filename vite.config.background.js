import { defineConfig } from "vite"

export default defineConfig({
    plugins: [],
    build: {
        rollupOptions: {
            input: {
                background: "./src/entry-points/background.ts",
                popup: "./src/entry-points/pop-up.html"
            },
            output: {
                // Remove the hash from the file names
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`,
            },
        },
        outDir: "./build/background",
        assetsDir: "./",
    }
})
