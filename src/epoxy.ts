import epoxy_wasm from "@mercuryworkshop/epoxy-tls/pkg/epoxy-module";
import { settings } from "./store";

const EPOXY_PATH = "/epoxy/epoxy.wasm";
const CERTS_PATH = "/epoxy/certs.js";

let cache: Cache;
let certs: any;

// @ts-ignore
let currentClient;
let currentWispUrl: string;

async function instantiateEpoxy() {
	if (!cache) cache = await window.caches.open("classlinkv2-epoxy");
	if (!await cache.match(EPOXY_PATH)) {
		await cache.add(EPOXY_PATH);
	}
	const module = await cache.match(EPOXY_PATH);
	if (!await cache.match(CERTS_PATH)) {
		await cache.add(CERTS_PATH);
	}
	certs = (new Function("\"use strict\";" + await cache.match(CERTS_PATH).then(r => r?.text()) + "return ROOTS;"))();
	await epoxy_wasm(module);
}

export async function createEpoxy() {
	// @ts-ignore
	let options = new epoxy_wasm.EpoxyClientOptions();
	options.user_agent = navigator.userAgent;
	options.udp_extension_required = false;

	currentWispUrl = settings.wispServer;
	// @ts-ignore
	currentClient = new epoxy_wasm.EpoxyClient(settings.wispServer, certs, options);
}

export async function fetch(url: string, options?: any) {
	if (!certs) {
		await instantiateEpoxy();
	}
	if (currentWispUrl !== settings.wispServer) {
		await createEpoxy();
	}
	// @ts-ignore
	return currentClient.fetch(url, options);
}
