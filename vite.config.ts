import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue2 from "@vitejs/plugin-vue2";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue2()],
	base : "/yugioh-deck-tool/",
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			/*
			 * SCSS rewrites
			 */
			"~bootstrap": fileURLToPath(
				new URL("./node_modules/bootstrap", import.meta.url)
			),
			"~bootstrap-vue": fileURLToPath(
				new URL("./node_modules/bootstrap-vue", import.meta.url)
			),
			"~vue-select": fileURLToPath(
				new URL("./node_modules/vue-select", import.meta.url)
			),
		},
	},
	build: {
		rollupOptions: {
			input: {
				tooltip: "./src/tooltip/main.ts", // Tooltip, can be used on its own.
				app: "./index.html", // Standalone and embeddable application.
			},
		},
	},
});
