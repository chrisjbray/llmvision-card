import { defineConfig } from "vite";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(
    readFileSync(new URL("./package.json", import.meta.url), "utf8")
);

export default defineConfig({
    define: {
        __LLMVISION_VERSION__: JSON.stringify(packageJson.version),
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                "llmvision-card": "src/llmvision-card.js",
                "llmvision-preview-card": "src/llmvision-preview-card.js",
                "llmvision-horizontal-card": "src/llmvision-horizontal-card.js",
            },
            output: {
                entryFileNames: "[name].js",
                // ponytail: stable asset names, no content hash. A hashed rename
                // 404s any cached entry chunk that imports the old name, and the
                // whole card then dies as "Configuration Error" (2026-09-12).
                // HACS cache-busts via the resource ?hacstag query instead.
                chunkFileNames: "assets/[name].js",
                format: "es",
                // ponytail: card-base.js is imported by all entries; without
                // manualChunks each entry inlines its own stale copy of
                // showPopup, so a base fix ships in one chunk but not the other
                manualChunks: (id) => {
                    if (id.includes('src/card-base.js')) return 'card-base';
                },
            },
        },
    },
});