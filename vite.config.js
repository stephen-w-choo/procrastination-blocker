import { defineConfig } from "vite"

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                content: "./src/content.tsx",
                background: "./src/background.ts"
            },
        },
        outDir: "dist"
    }
})