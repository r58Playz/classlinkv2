import { defineConfig } from 'vite';
import { dreamlandPlugin } from 'vite-plugin-dreamland';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
	plugins: [
		dreamlandPlugin(),
		viteStaticCopy({
			targets: [
				{ src: "node_modules/@mercuryworkshop/epoxy-tls/minimal/epoxy.wasm", dest: "epoxy" },
			]
		})
	],
	build: {
		target: "es2015",
		rollupOptions: {
			input: ["index.html", "404.html"],
		}
	},
});
