import Home from './routes/home';
import Page404 from './routes/404';
import Dashboard from './routes/dashboard/home';
import { tokens } from './store';
import DLRouter, { Route } from 'dreamland-router';

function hasAuth(): boolean {
	return !!tokens.code || !!tokens.token || !!tokens.gws || (new URLSearchParams(location.search)).has("code");
}

const routes: Route = {
	path: "/",
	show: Home,

	children: [
		{
			path: "dashboard",
			if: hasAuth,
			show: Dashboard,

			children: [

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
