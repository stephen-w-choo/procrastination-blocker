import { defineConfig } from "vite"

export default defineConfig({
    base: "./",
    plugins: [],
    build: {
        rollupOptions: {
            input: {
                background: "./src/entryPoints/background.ts",
                popup: "./src/entryPoints/pop-up.html",
                popupRoot: "./src/entryPoints/popUpRoot.tsx",
            },
            output: {
                // Remove the hash from the file names
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`,
            },
            onwarn(warning, warn) {
                if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
                  return
                }
                warn(warning)
            }
        },
        outDir: "./build",
        assetsDir: "./",
        target: "ES2022"
    }
})
