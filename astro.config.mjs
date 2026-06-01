// @ts-check
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import AstroPWA from "@vite-pwa/astro";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
    integrations: [
        react(),
        tailwind({
            applyBaseStyles: false,
        }),
        partytown({
            config: {
                forward: ["dataLayer.push"],
            },
        }),
        AstroPWA({
            registerType: "autoUpdate",
            manifest: {
                name: "Jet Lag Verstoppertje Kaartgenerator",
                short_name: "Verstoppertje",
                description:
                    "Genereer automatisch kaarten voor Jet Lag The Game: Hide and Seek. Stel vragen in en zie hoe de kaart honderden mogelijkheden in seconden uitsluit.",
                lang: "nl",
                start_url: "/",
                scope: "/",
                display: "standalone",
                orientation: "any",
                theme_color: "#1F2F3F",
                background_color: "#1F2F3F",
                icons: [
                    {
                        src: "/android-chrome-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                    {
                        src: "/apple-touch-icon.png",
                        sizes: "180x180",
                        type: "image/png",
                    },
                    {
                        src: "/JLIcon.png",
                        sizes: "1080x1080",
                        type: "image/png",
                    },
                ],
            },
            workbox: {
                globPatterns: [
                    "**/*.{js,css,html,svg,png,webp,woff,woff2,json,geojson}",
                ],
                navigateFallback: "/",
                navigateFallbackDenylist: [/^\/_/, /^\/api\//],
                maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
                // Cache cross-origin map tiles so the app stays usable when
                // playing outside on flaky 4G or fully offline (PWA on iPad).
                // Tile providers serve immutable content per z/x/y URL, so
                // StaleWhileRevalidate is safe: instantly show the cached tile,
                // refresh in the background when online.
                runtimeCaching: [
                    {
                        urlPattern: ({ url }) =>
                            url.hostname.endsWith("basemaps.cartocdn.com") ||
                            url.hostname === "tile.openstreetmap.org" ||
                            url.hostname.endsWith("tile.thunderforest.com"),
                        handler: "StaleWhileRevalidate",
                        options: {
                            cacheName: "map-tiles",
                            expiration: {
                                maxEntries: 500,
                                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                ],
            },
        }),
    ],
    devToolbar: {
        enabled: false,
    },
    // Deployed at the root of a Netlify site. To switch back to GitHub Pages
    // (where it lives under /JetLagHideAndSeek/), set base: "JetLagHideAndSeek"
    // and update the manifest start_url/scope/icon paths accordingly.
    base: "/",
});
