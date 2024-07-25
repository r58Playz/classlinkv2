import { fetchBearer } from "../../epoxy";
import { Router } from "../../router";
import Layout from "./layout";
// @ts-ignore
import { Card } from "m3-dreamland";

export const Analytics: Component<{}, { loaded: boolean, error: Error | undefined, logins: any[], loginRecords: any, apps: any, appRecords: any }> = function() {
	this.loaded = false;
	this.error = undefined;
	this.logins = [];
	this.loginRecords = { daily: {}, month: {}, weeks: {}, yearly: {} };
	this.apps = [];
	this.appRecords = [];

	this.mount = async () => {
		try {
			const userData = await fetchBearer("https://nodeapi.classlink.com/v2/my/info").then(r => r.json());
			if (typeof userData.status === "number") {
				Router.route("/");
				return;
			}

			this.logins = await fetchBearer("https://analytics-data.classlink.io/my/v1p0/logins?limit=10").then(r => r.json());
			this.loginRecords = await fetchBearer("https://analytics-data.classlink.io/my/v1p0/logins/records").then(r => r.json());
			this.apps = await fetchBearer("https://analytics-data.classlink.io/my/v1p0/apps?limit=10").then(r => r.json());
			this.appRecords = await fetchBearer(`https://analytics-data.classlink.io/my/v1p0/apps/top?order=Count&sort=DESC&limit=5&startDate=0001-01-01`).then(r => r.json());
			this.loaded = true;
		} catch (error) {
			this.error = error as Error;
		}
	};

	this.css = `
		.list {
			display: flex;
			flex-direction: column;
			gap: 1em;
		}
	`;

	return (
		<div>
			<Layout bind:loading={use(this.loaded, x => !x)} bind:error={use(this.error)}>
				<h1 class="m3-font-headline-medium">Analytics</h1>
				<h2 class="m3-font-title-large">Logins</h2>
				<div class="list">
					{use(this.logins, x => x.map(x => {
						return (
							<Card type="elevated">
								<div>{x.Browser.trim() || "Unknown Browser"} on {x.OS.trim() || "Unknown OS"} ({x.Date})</div>
								<div class="m3-font-label-medium">{x.IP}</div>
							</Card>
						)
					}))}
				</div>
				<h2 class="m3-font-title-large">Login Records</h2>
				<div>Daily: {use(this.loginRecords.daily.Logins)} logins on {use(this.loginRecords.daily.Date)}</div>
				<div>Weekly: {use(this.loginRecords.weeks.Logins)} logins starting on {use(this.loginRecords.weeks.startDate)} and ending on {use(this.loginRecords.weeks.endDate)}</div>
				<div>Monthly: {use(this.loginRecords.month.Logins)} logins on {use(this.loginRecords.month.Date)}</div>
				<div>Yearly: {use(this.loginRecords.yearly.Logins)} logins starting on {use(this.loginRecords.yearly.startDate)} and ending on {use(this.loginRecords.yearly.endDate)}</div>
				<h2 class="m3-font-title-large">App Logins</h2>
				<div class="list">
					{use(this.apps, x => x.map((x: any) => {
						return (
							<Card type="elevated">
								<div>{x.AppName} ({x.AppId}) on {x.Date}</div>
								<div class="m3-font-label-medium">{x.IPAddress}</div>
							</Card>
						)
					}))}
				</div>
				<h2 class="m3-font-title-large">App Login Records</h2>
				<div class="list">
					{use(this.appRecords, x => x.map((x: any) => {
						return (
							<Card type="elevated">
								<div>{x.AppName} ({x.AppId}): {x.Count} logins, {x.activeS} active seconds</div>
							</Card>
						)
					}))}
				</div>
			</Layout>
		</div >
	);
}
