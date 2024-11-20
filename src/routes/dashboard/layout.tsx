import type { IconifyIcon } from "@iconify/types";
import { NavList, NavListButton, LinearProgressIndeterminate, Card } from "m3-dreamland";

import iconHome from "@ktibow/iconset-material-symbols/home";
import iconHomeOutline from "@ktibow/iconset-material-symbols/home-outline";
import iconSchool from "@ktibow/iconset-material-symbols/school";
import iconSchoolOutline from "@ktibow/iconset-material-symbols/school-outline";
import iconInsertChart from "@ktibow/iconset-material-symbols/insert-chart";
import iconInsertChartOutline from "@ktibow/iconset-material-symbols/insert-chart-outline";
import iconSettings from "@ktibow/iconset-material-symbols/settings";
import iconSettingsOutline from "@ktibow/iconset-material-symbols/settings-outline";
import { Router } from "../../router";

const Layout: Component<{ 
	loading?: boolean,
	error?: Error
}, { 
	routes: { path: string, sicon: IconifyIcon, icon: IconifyIcon, label: string }[],

	displayError: boolean,
	displayLoading: boolean,
	displayChildren: boolean

	children: Element[],

	_leak: true,
}> = function() {
	this.displayError = false;
	this.displayLoading = false;
	this.displayChildren = false;
	const cssClass = css`
		display: flex;
		min-height: 100vh;

		.DashboardLayout-navbar {
			position: sticky;
			align-self: flex-start;
			display: flex;
			width: 5rem;
			flex-shrink: 0;
		}

		.DashboardLayout-content {
			padding: 1rem;
			min-width: 0;
		}

		.DashboardLayout-content:has(.DashboardLayout-loading),
		.DashboardLayout-content:has(.DashboardLayout-error) {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.DashboardLayout-loading,
		.DashboardLayout-error {
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.DashboardLayout-error {
			min-width: 0;
		}
		.DashboardLayout-error pre {
			white-space: pre-wrap;
			word-break: break-all;
			overflow-wrap: anywhere;
		}

		@media (width < 37.5rem) {
			& {
				flex-direction: column-reverse;
				--m3-util-bottom-offset: 5rem;
			}
			.DashboardLayout-navbar {
				bottom: 0;
				width: 100%;
				z-index: 3;
			}
			.DashboardLayout-content {
				flex: 1;
			}
			.DashboardLayout-items {
				display: contents;
			}
		}

		@media (min-width: 37.5rem) {
			.DashboardLayout-content {
				flex-grow: 1;
				padding: 1.5rem;
			}
			.DashboardLayout-navbar {
				top: 0;
				left: 0;
				flex-direction: column;
				min-height: 100vh;
			}
			.DashboardLayout-items {
				display: flex;
				flex-direction: column;
				gap: 0.75rem;
				justify-content: center;
			}
		}
	`;

	this.routes = [
		{
			path: "/dashboard",
			icon: iconHomeOutline,
			sicon: iconHome,
			label: "Home",
		},
		{
			path: "/dashboard/classes",
			icon: iconSchoolOutline,
			sicon: iconSchool,
			label: "Classes",
		},
		{
			path: "/dashboard/analytics",
			icon: iconInsertChartOutline,
			sicon: iconInsertChart,
			label: "Analytics",
		},
		{
			path: "/dashboard/settings",
			icon: iconSettingsOutline,
			sicon: iconSettings,
			label: "Settings",
		}
	];

	this._leak = true;

	useChange([this.error, this.loading], () => {
		if (this.error) {
			this.displayChildren = false;
			this.displayLoading = false;
			this.displayError = true;
			console.log(this.error);
		} else if (this.loading) {
			this.displayChildren = false;
			this.displayLoading = true;
			this.displayError = false;
		} else {
			this.displayChildren = true;
			this.displayLoading = false;
			this.displayError = false;
		}
	});
	return (
		<div class={cssClass}>
			<div class="DashboardLayout-navbar">
				<NavList type="auto">
					<div class="DashboardLayout-items">
						{this.routes.map(x => {
							return (
								<NavListButton
									type="auto"
									icon={location.pathname === x.path ? x.sicon : x.icon}
									selected={location.pathname === x.path}
									on:click={() => Router.route(x.path)}
								>
									{x.label}
								</NavListButton>
							);
						})}
					</div>
				</NavList>
			</div>
			<div class="DashboardLayout-content">
				{$if(use(this.displayError),
					<div class="DashboardLayout-error">
						<Card type="filled">
							<pre>
								{use(this.error)}
							</pre>
						</Card>
					</div>
				)}
				{$if(use(this.displayLoading),
					<div class="DashboardLayout-loading">Fetching data<LinearProgressIndeterminate /></div>
				)}
				{$if(use(this.displayChildren),
					<div>{this.children}</div>
				)}
			</div>
		</div >
	)
};

export default Layout;
