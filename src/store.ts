import { epoxyVersion } from "./epoxy";

export let settings: Stateful<{
	lastLoginStep: string,
	lastJumpScriptMethod: boolean,

	wispServer: string,
	starredApps: number[],

	themeScheme: number,
	themeColor: string,
	themeContrast: number,

	epoxyVersion: string,
}> = $store(
	{
		lastLoginStep: "wisp",
		lastJumpScriptMethod: false,
		wispServer: "wss://wisp-server-workers.r58-factories.workers.dev",
		starredApps: [],
		themeScheme: 0,
		themeColor: "#CBA6F7",
		themeContrast: 1,
		epoxyVersion: epoxyVersion,
	},
	{ ident: "classlinkv2-settings", backing: "localstorage", autosave: "auto" },
);

export let tokens: Stateful<{
	code: string | null,
	token: string | null,
	gws: string | null,
}> = $store(
	{
		code: null,
		token: null,
		gws: null,
	},
	{ ident: "classlinkv2-tokens", backing: "localstorage", autosave: "auto" },
);
