export let settings = $store(
	{
		lastLoginStep: "wisp",
		lastJumpScriptMethod: false,
		wispServer: "wss://wisp-server-workers.r58playz.workers.dev",
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
