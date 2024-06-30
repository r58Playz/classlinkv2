import Home from './routes/home';
import Page404 from './routes/404';
import Dashboard from './routes/dashboard/home';
import { tokens } from './store';
import DLRouter, { Route } from 'dreamland-router';
import { Classes } from './routes/dashboard/classes';
import { Analytics } from './routes/dashboard/analytics';
import { Settings } from './routes/dashboard/settings';

function hasAuth(): boolean {
	return !!tokens.code || !!tokens.token || !!tokens.gws || (new URLSearchParams(location.search)).has("code");
}

const RedirectToIdp: Component<{}, {}> = function() {
	let url = new URL(location.href);
	url.host = "idp.classlink.com:443";
	location.host = "idp.classlink.com:443";
	this.css = `
		padding: 1em;
		overflow-wrap: anywhere;
	`
	return <div><code>{url.href}</code></div>;
}

const routes: Route = {
	path: "/",
	show: Home,

	children: [
		{
			path: "sso.*",
			regex: true,

			show: RedirectToIdp
		},
		{
			path: "dashboard",
			if: hasAuth,
			show: Dashboard,

			children: [
				{
					path: "/classes",
					show: Classes,
				},
				{
					path: "/analytics",
					show: Analytics,
				},
				{
					path: "/settings",
					show: Settings,
				}
			],
		},
		{
			path: "dashboard.*",
			regex: true,
			redirect: "/",
		},
		{
			path: ".*",
			regex: true,
			show: Page404,
		}
	]
}; 

export const Router = new DLRouter(routes);
