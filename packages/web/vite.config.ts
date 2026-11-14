import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite"
import path from "path";
import runableAnalyticsPlugin from "./vite/plugins/runable-analytics-plugin";
import honoDevPlugin from "./vite/plugins/hono-dev-plugin";
import { getLatestEdition } from "./src/web/data/editions";

const root = path.resolve(__dirname, "../..");

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, root, '');
	Object.assign(process.env, env);
	const latestCoverUrl = new URL(getLatestEdition().cover, "https://pioneer.rhemanigeria.com").href;
	const latestCoverMeta = (html: string) => html
		.replace(/(<meta property="og:image" content=")[^"]*("\s*\/>)/, `$1${latestCoverUrl}$2`)
		.replace(/(<meta name="twitter:image" content=")[^"]*("\s*\/>)/, `$1${latestCoverUrl}$2`);

	return {
		plugins: [
			honoDevPlugin(),
			react(),
			runableAnalyticsPlugin(),
			tailwind(),
			{
				name: "latest-edition-social-preview",
				transformIndexHtml: {
					order: "pre",
					handler: latestCoverMeta,
				},
			},
		],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src/web"),
			},
		},
		server: {
			allowedHosts: true,
			hmr: { overlay: false, },
			cors: false
		}
	};
});
