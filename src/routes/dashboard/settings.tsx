import iconLink from "@ktibow/iconset-material-symbols/link";
import { fetch, createEpoxy } from "../../epoxy";
import Layout from "./layout"
// @ts-ignore
import { TextField, Card, Button, argbFromHex, genScheme, sourceColorFromImage, hexFromArgb } from "m3-dreamland";
import { settings } from "../../store";
import { Router } from "../../router";

const WispTestCard: Component<{}, { res: Response | undefined, body: string | undefined, error: string | undefined }> = function() {
	// TODO: Snackbar that shows that cache was deleted/session was recreated
	this.css = `
		.actions {
			margin-top: 1em;
			display: flex;
			flex-direction: row;
			gap: 1em;
		}
		@media (max-width: 630px) {
			.actions {
				flex-direction: column;
				align-items: center;
			}
		}

		code {
			display: block;
			overflow-wrap: break-word;
		}
	`;
	return (
		<div>
			<Card type="filled">
				<div>
					<div class="m3-font-title-medium">Request URL</div>
					<code>https://applications.apis.classlink.com</code>
				</div>
				{use(this.res, res => res ?
					<div>
						<div class="m3-font-title-medium">Response</div>
						<code>{res.status} {res.statusText}</code>
						{Object.entries((res as any).rawHeaders).map(([k, v]) => <code>{k}: {v}</code>)}
						<br />
						<code>{use(this.body)}</code>
					</div> : null
				)}
				{use(this.error, error => error ?
					<div>
						<div class="m3-font-title-medium">Error</div>
						<code>{error}</code>
					</div> : null
				)}
				<div class="actions">
					<Button type="tonal" on:click={async () => {
						this.res = undefined;
						this.body = undefined;
						this.error = undefined;
						try {
							this.res = await fetch("http://applications.apis.classlink.com");
							this.body = await this.res?.text();
						} catch (err) {
							this.error = "" + err;
							this.res = undefined;
							this.body = undefined;
						}
					}}>Test</Button>
					<Button type="tonal" on:click={async () => {
						await createEpoxy();
					}}>Recreate epoxy client</Button>
					<Button type="tonal" on:click={async () => {
						await window.caches.delete("classlinkv2-epoxy");
					}}>Clear cached epoxy</Button>
				</div>
			</Card>
		</div>
	)
}

export const WispSettings: Component<{}, {}> = function() {
	this.css = `
		.TextField-m3-container {
			width: min(800px, 100%); !important;
		}
		.invalid-url-supporting {
			margin-top: 0.25rem;
			color: rgb(var(--m3-scheme-error));
		}
	`

	const testUrl = (url: string) => {
		try {
			const parsed = new URL(url);
			if (parsed.protocol !== "wss:") return false;
			return true;
		} catch {
			return false;
		}
	};

	return (
		<div>
			<p>
				<TextField
					bind:value={use(settings.wispServer)}
					bind:error={use(settings.wispServer, x => !testUrl(x))}
					name="Wisp Server URL"
					leadingIcon={iconLink}
				/>
				{use(settings.wispServer, x => !testUrl(x) ?
					<div class="m3-font-label-medium invalid-url-supporting">
						Invalid URL. It must have the <code>wss</code> protocol.
					</div>
					: null)}
			</p>
			<p>
				You can send a test request here:
			</p>
			<WispTestCard />
		</div>
	)
}

const transformContrast = function(contrast: number): number {
	return contrast == 0
		? -0.5
		: contrast == 1
			? 0
			: contrast == 2
				? 6 / 12
				: contrast == 3
					? 8 / 12
					: contrast == 4
						? 10 / 12
						: contrast == 5
							? 11 / 12
							: 1
}

export const MaterialSettings: Component<{}, { colorSelector: HTMLElement, fileSelector: HTMLInputElement }> = function() {
	const schemes = ["tonal_spot", "content", "fidelity", "vibrant", "expressive", "neutral", "monochrome"];
	useChange([settings.themeScheme, settings.themeColor, settings.themeContrast], () => {
		const { light, dark } = genScheme(schemes[settings.themeScheme], transformContrast(settings.themeContrast), argbFromHex(settings.themeColor));
		settings.lightTheme = light;
		settings.darkTheme = dark;
	});

	this.css = `
		.picker {
			display: flex;
			flex-direction: column;
		}

		.picker input {
			visibility: hidden;	
			width: 0;
			height: 0;
		}

		.buttons {
			display: flex;
			gap: 1em;
		}

		.titlecase {
			text-transform: capitalize;
		}

		@media (max-width: 630px) {
			.buttons {
				flex-direction: column;
				align-items: center;
			}
		}
	`;

	return (
		<div>
			<Card type="filled">
				<div class="buttons">
					<div class="picker">
						<Button type="tonal" on:click={() => { this.colorSelector.click(); }}>Color: {use(settings.themeColor, x => x.toUpperCase())}</Button>
						<input type="color" bind:value={use(settings.themeColor)} bind:this={use(this.colorSelector)} />
					</div>
					<div class="picker">
						<Button type="tonal" on:click={() => { this.fileSelector.click(); }}>Get color from image</Button>
						<input type="file" accept="image/*" bind:this={use(this.fileSelector)} on:change={() => {
							if (!this.fileSelector.files) return;
							const reader = new FileReader();
							reader.onload = async () => {
								const image = new Image();
								image.src = String(reader.result);
								settings.themeColor = hexFromArgb(await sourceColorFromImage(image));
							};
							reader.readAsDataURL(this.fileSelector.files[0]);
						}} />
					</div>
					<Button type="tonal" on:click={() => { settings.themeScheme = (settings.themeScheme + 1) % 7 }}>
						<span class="titlecase">
							Scheme: {use(settings.themeScheme, x => schemes[x].replace("_", " "))}
						</span>
					</Button>
					<Button type="tonal" on:click={() => { settings.themeContrast = (settings.themeContrast + 1) % 7 }}>
						Contrast: {use(settings.themeContrast, x => x + 1)}
					</Button>
				</div>
			</Card>
		</div>
	)
}

export const Settings: Component<{}, {}> = function() {
	this.css = `
		.buttons {
			display: flex;
			gap: 1em;
		}

		@media (max-width: 325px) {
			.buttons {
				flex-direction: column;
			}
		}
	`;

	return (
		<div>
			<Layout loading={false}>
				<h1 class="m3-font-headline-medium">Settings</h1>
				<div class="buttons">
					<Button type="tonal" on:click={() => { delete localStorage["classlinkv2-tokens"]; Router.route("/"); }}>Log out</Button>
					<Button type="tonal" on:click={() => { settings.starredApps = []; }}>Clear starred apps</Button>
				</div>
				<h2 class="m3-font-title-large">Wisp</h2>
				<WispSettings />
				<h2 class="m3-font-title-large">Material UI</h2>
				<MaterialSettings />
			</Layout>
		</div>
	)
}
