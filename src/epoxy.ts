// @ts-ignore
import epoxy_wasm from "@mercuryworkshop/epoxy-tls/minimal-epoxy";
import { settings, tokens } from "./store";

const EPOXY_PATH = "/epoxy/epoxy.wasm";

let cache: Cache;
let initted: boolean = false;

// @ts-ignore
let currentClient;
let currentWispUrl: string;

async function evictEpoxy() {
	if (!cache) cache = await window.caches.open("classlinkv2-epoxy");
	await cache.delete(EPOXY_PATH);
}

async function instantiateEpoxy() {
	if (!cache) cache = await window.caches.open("classlinkv2-epoxy");
	if (!await cache.match(EPOXY_PATH)) {
		await cache.add(EPOXY_PATH);
	}
	const module = await cache.match(EPOXY_PATH);
	await epoxy_wasm(module);
	initted = true;
}

export async function createEpoxy() {
	// @ts-ignore
	let options = new epoxy_wasm.EpoxyClientOptions();
	options.user_agent = navigator.userAgent;
	options.udp_extension_required = false;

	currentWispUrl = settings.wispServer;
	// @ts-ignore
	currentClient = new epoxy_wasm.EpoxyClient(settings.wispServer, options);
}

export async function fetch(url: string, options?: any, retried?: boolean) {
	if (!initted) {
		try {
			await instantiateEpoxy();
		} catch (err) {
			console.log(err);
			// update epoxy wasm if it errors due to an epoxy js update
			await evictEpoxy();
			await instantiateEpoxy();
		}
	}
	if (currentWispUrl !== settings.wispServer) {
		await createEpoxy();
	}
	try {
		let realOptions = options || {};
		// try to fake a real browser
		realOptions.headers = Object.assign(realOptions.headers || {}, {
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
			"Accept-Language": "en-US,en;q=0.9",
			"Cache-Control": "no-cache",
			"Dnt": "1",
			"Pragma": "no-cache",
			"Priority": "u=0, i",
		});
		// @ts-ignore
		return await currentClient.fetch(url, realOptions);
	} catch (err) {
		if (retried) {
			throw err;
		}
		console.log(err);

		if ((err as Error).message.includes("UnexpectedEof")) {
			// retriable, some wisp-server-workers issue?
			// @ts-ignore
			await currentClient.replace_stream_provider();
			await new Promise(r => setTimeout(r, 500));
			return await fetch(url, options, true);
		}
	}
}

export async function fetchBearer(url: string, maybeOptions?: any) {
	let options = maybeOptions || {};
	options.headers = Object.assign(options.headers || {}, { "Authorization": "Bearer " + tokens.token });
	return await fetch(url, options);
}

export async function fetchGws(url: string, maybeOptions?: any) {
	let options = maybeOptions || {};
	options.headers = Object.assign(options.headers || {}, { "Authorization": "gws " + tokens.gws });
	return await fetch(url, options);
}
