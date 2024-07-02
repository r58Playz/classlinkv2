import { fetch, fetchBearer } from "../../epoxy";
// @ts-ignore
import { CardClickable, Button, Icon } from "m3-dreamland";
import { settings, tokens } from "../../store";
import Layout from "./layout";
import { Router } from "../../router";
import { app2url } from "../../classlink";
import iconStar from "@ktibow/iconset-material-symbols/star";
import iconStarOutline from "@ktibow/iconset-material-symbols/star-outline";
import iconError from "@ktibow/iconset-material-symbols/error";

const AppTile: Component<{ app: any, starred: boolean }, { url: string | null}> = function() {
	this.css = `
		.CardClickable-m3-container {
			width: 100%;
		}

		.info {
			width: 100%;
			display: flex;
			gap: 1em;
			position: relative;
		}
		.info img {
			width: 4em;
			height: 4em;
		}
		.info .right {
			min-width: 0;
		}
		.info .right .m3-font-title-medium {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.info .action {
			position: absolute;
			bottom: 0;
			right: 0;
		}
		.info .unsupported {
			color: rgb(var(--m3-scheme-error));
			display: flex;
			align-items: center;
			gap: 0.25rem;
		}
	`;
	this.url = app2url(this.app);
	const currentAppLogin = new URLSearchParams(location.search).get("app");
	if (currentAppLogin && +currentAppLogin === this.app.id) {
		if (this.url) location.href = this.url;
	}
	return (
		<div>
			<CardClickable type="elevated" on:click={() => {
				const url = app2url(this.app);
				if (url) window.open(url);
			}}>
				<div class="info">
					<img src={this.app.icon} />
					<div class="right">
						<div class="m3-font-title-medium">{this.app.name}</div>
						<div class="m3-font-label-medium">{this.app.id}</div>
						{!this.url ? <div class="m3-font-label-medium unsupported"><Icon icon={iconError} />Unsupported</div> : null}
					</div>
					<div class="action">
						<Button type="tonal" iconType="full" on:click={(e: Event) => {
							e.stopPropagation();
							if (this.starred) {
								settings.starredApps = settings.starredApps.filter(x => x !== this.app.id);
							} else {
								settings.starredApps = [...settings.starredApps, this.app.id];
							}
						}}>
							<Icon icon={this.starred ? iconStar : iconStarOutline} />
						</Button>
					</div>
				</div>
			</CardClickable>
		</div>
	)
}

const Dashboard: Component<{}, { loaded: boolean, userData: any, applications: any, unstarred: any, starred: any }> = function() {
	this.loaded = false;
	this.applications = [];
	this.unstarred = [];
	this.starred = [];

	this.css = `
		.applications {
			margin-top: 1em;
			display: grid;
			gap: 1em;
			grid-auto-rows: auto;
			grid-template-columns: repeat(auto-fill, 20em)
		}

		@media (max-width: 37.5rem) {
			.applications {
				display: flex;
				flex-direction: column;
			}
		}
	`;

	this.mount = async () => {
		const searchParams = new URLSearchParams(location.search);
		if (searchParams.has("code")) {
			const resp = await fetch(`https://applications.apis.classlink.com/exchangeCode?code=${searchParams.get("code")}&response_type=code`).then(r => r.json());
			tokens.code = searchParams.get("code");
			tokens.gws = resp.gwsToken;
			tokens.token = resp.token;
			history.replaceState(null, "", location.pathname);
		} else if (searchParams.has("nofetch")) {
			return;
		}

		const userData = await fetchBearer("https://nodeapi.classlink.com/v2/my/info").then(r => r.json());
		if (typeof userData.status === "number") {
			Router.route("/");
			return;
		}
		this.userData = userData;
		this.applications = await fetchBearer("https://applications.apis.classlink.com/v1/v3/applications").then(r => r.json());

		this.loaded = true;
	}

	useChange([this.applications, settings.starredApps], () => {
		this.unstarred = this.applications.filter((x: any) => !settings.starredApps.includes(x.id));
		this.starred = this.applications.filter((x: any) => settings.starredApps.includes(x.id));
	});

	return (
		<div>
			<Layout bind:loading={use(this.loaded, x => !x)}>
				<div>
					<h1 class="m3-font-headline-medium">Home</h1>
					<div class="m3-font-title-medium">Logged in as {use(this.userData.DisplayName)} ({use(this.userData.Email)})</div>
					{$if(use(this.starred, x => !!x.length),
						<div>
							<h2 class="m3-font-title-large">Starred</h2>
							<div class="applications">
								{use(this.starred, x => x.map((x: any) => { return <AppTile app={x} starred={true} /> }))}
							</div>
							<h2 class="m3-font-title-large">Applications</h2>
						</div>
					)}
					<div class="applications">
						{use(this.unstarred, x => x.map((x: any) => { return <AppTile app={x} starred={false} /> }))}
					</div>
				</div>
			</Layout>
		</div>
	);
}

export default Dashboard;
