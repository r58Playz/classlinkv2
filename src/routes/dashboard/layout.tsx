import { NavList, NavListButton, LinearProgressIndeterminate } from "m3-dreamland";
import type { IconifyIcon } from "@iconify/types";

import iconHome from "@ktibow/iconset-material-symbols/home";
import iconHomeOutline from "@ktibow/iconset-material-symbols/home-outline";
import iconSchool from "@ktibow/iconset-material-symbols/school";
import iconSchoolOutline from "@ktibow/iconset-material-symbols/school-outline";
import iconInsertChart from "@ktibow/iconset-material-symbols/insert-chart";
import iconInsertChartOutline from "@ktibow/iconset-material-symbols/insert-chart-outline";
import iconSettings from "@ktibow/iconset-material-symbols/settings";
import iconSettingsOutline from "@ktibow/iconset-material-symbols/settings-outline";
import { Router } from "../../router";

const Layout: Component<{ loading: boolean }, { routes: { path: string, sicon: IconifyIcon, icon: IconifyIcon, label: string }[], children: Element[] }> = function() {
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
		}

		.DashboardLayout-content:has(.DashboardLayout-loading) {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.DashboardLayout-loading {
			display: flex;
			flex-direction: column;
			align-items: center;
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

	// @ts-ignore
	this._leak = true;
	return (
		<div class={cssClass}>
			<div class="DashboardLayout-navbar">
				<NavList type="auto">
					<div class="DashboardLayout-items">
						{this.routes.map(x => {
							return (
								<NavListButton
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
				{$if(use(this.loading), <div class="DashboardLayout-loading">Fetching data<LinearProgressIndeterminate /></div>, this.children)}
			</div>
		</div >
	)
};

export default Layout;
