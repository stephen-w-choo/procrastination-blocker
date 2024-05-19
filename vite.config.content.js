import { defineConfig } from "vite"

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                content: "./src/entryPoints/content.tsx",
            },
            output: {
                // Remove the hash from the file names
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`,
                inlineDynamicImports: true,
            },
            onwarn(warning, warn) {
                if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
                  return
                }
                warn(warning)
            }
        },
        outDir: "./build/content",
        assetsDir: "./",
        target: "ES2022"
    }
})
