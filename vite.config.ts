import { defineConfig } from 'vite';
import { dreamlandPlugin } from 'vite-plugin-dreamland';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
	plugins: [
		dreamlandPlugin(),
		viteStaticCopy({
			targets: [
				{ src: "node_modules/@mercuryworkshop/epoxy-tls/minimal/epoxy.wasm", dest: "epoxy" },
				{ src: "node_modules/@mercuryworkshop/epoxy-tls/minimal/certs.js", dest: "epoxy" }
			]
		})
	],
	server: {
		headers: {
			"Cross-Origin-Opener-Policy": "same-origin",
			"Cross-Origin-Embedder-Policy": "credentialless",
		}
	}
});
