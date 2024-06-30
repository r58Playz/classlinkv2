import { Tabs, SegmentedButtonContainer, SegmentedButtonItem, Card, ButtonLink } from "m3-dreamland";
import { settings } from "../../store";

import iconDns from "@ktibow/iconset-material-symbols/dns";
import iconCodeBlocks from "@ktibow/iconset-material-symbols/code-blocks";
import iconSchool from "@ktibow/iconset-material-symbols/school";
import iconShield from "@ktibow/iconset-material-symbols/shield";
import { WispSettings } from "../dashboard/settings";

const WispLoginStep: Component<{}, {}> = function() {
	return (
		<div>
			<p>
				A Wisp server is required to access the Classlink API. It provides a way to create TCP sockets in the browser so that TLS-encrypted HTTP requests can be sent from the browser. Your API tokens will be sent in HTTPS requests through the server you set here. See <a href="https://github.com/MercuryWorkshop/wisp-server-workers" target="_blank" rel="noopener noreferrer">wisp-server-workers</a> for an easy way to selfhost a Wisp server.
			</p>
			<WispSettings />
		</div>
	)
}

const UblockJumpScript: Component<{}, {}> = function() {
	this.css = `
		code {
			overflow-wrap: break-word;
		}
	`
	return (
		<p>
			<ol>
				<li>Open uBlock Origin settings.</li>
				<li>Scroll down to <code>Advanced</code>.</li>
				<li>Check the <code>I am an advanced user</code> checkbox.</li>
				<li>Click on the cog that appears.</li>
				<li>Find <code>userResourcesLocation</code> and do either one of these:</li>
				<ul>
					<li>Remove <code>unset</code> and replace it with <code>https://classlink.r58playz.dev/userResources</code>.</li>
					<li>Append <code>https://classlink.r58playz.dev/userResources</code> to the end of the existing URL list.</li>
				</ul>
				<li>Close the <code>Advanced settings</code> tab.</li>
				<li>Click on <code>My filters</code>.</li>
				<li>Add <code>myapps.classlink.com##+js(classlinkJumpScript.js)</code> to a new line.</li>
				<li>Optionally add <code>launchpad.classlink.com##+js(classlinkJumpScript.js)</code> to a new line to enable Classlinkv2's Classlink LaunchPad extension emulation feature.</li>
				<li>Add <code>classlink.r58playz.dev##+js(classlinkJumpScript.js)</code> to a new line.</li>
				<li>Click <code>Apply changes</code>.</li>
				<li>Reload this page.</li>
			</ol>
		</p>
	)
}

const UserscriptJumpScript: Component<{}, {}> = function() {
	return (
		<p>
			Install the <a href="/classlink.user.js">userscript</a> by clicking on it.
		</p>
	)
}

const JumpScriptLoginStep: Component<{}, { ublockInput: HTMLInputElement }> = function() {
	return (
		<div>
			<p>
				A jump script is required to intercept the Classlink login process and bring you to Classlinkv2. It will redirect you once it detects a "login code" during the login process. There's two ways to install it, using either uBlock Origin or a userscript manager.
			</p>
			<div on:change={() => { settings.lastJumpScriptMethod = this.ublockInput.checked }}>
				<SegmentedButtonContainer>
					<SegmentedButtonItem
						type="radio"
						name="jumpscript"
						input="jumpscript-userscript"
						checked={!settings.lastJumpScriptMethod}
						icon={iconCodeBlocks}>
						Userscript manager
					</SegmentedButtonItem>
					<SegmentedButtonItem
						type="radio"
						name="jumpscript"
						input="jumpscript-ublock"
						bind:inner={use(this.ublockInput)}
						checked={settings.lastJumpScriptMethod}
						icon={iconShield}>
						uBlock Origin
					</SegmentedButtonItem>
				</SegmentedButtonContainer>
			</div>
			{$if(use(settings.lastJumpScriptMethod), <UblockJumpScript />, <UserscriptJumpScript />)}
		</div>
	);
}

const SignInLoginStep: Component<{}, {}> = function() {
	this.css = `
		.actions {
			display: flex;
			flex-direction: row;
			gap: 1em;
			justify-content: center;
		}
		@media (max-width: 650px) {
			.actions {
				flex-direction: column;
				align-items: center;
			}
		}
	`;
	return (
		<div>
			<p>
				Username and password login is not currently supported. You can manually go to your login page and log in from there instead if you log in with a username and password.
			</p>
			<Card type="filled">
				<div class="actions">
					<ButtonLink type="tonal" href="https://launchpad.classlink.com/signinwith/google">Sign in with Google</ButtonLink>
					<ButtonLink type="tonal" href="https://launchpad.classlink.com/signinwith/windowslive">Sign in with Microsoft</ButtonLink>
					<ButtonLink type="tonal" href="https://launchpad.classlink.com/quickcard">Sign in with QuickCard</ButtonLink>
				</div>
			</Card>
		</div>
	);
}

const Login: Component<{}, {}> = function() {
	const tabs = [
		{ name: "Wisp Server", value: "wisp", icon: iconDns },
		{ name: "Jump Script", value: "jump", icon: iconCodeBlocks },
		{ name: "Log In", value: "login", icon: iconSchool },
	];
	return (
		<div>
			<h2 class="m3-font-display-small">Log In</h2>
			<p>
				Go through each tab to set up Classlinkv2.
			</p>
			<Tabs primary={true} items={tabs} bind:tab={use(settings.lastLoginStep)} />
			{use(settings.lastLoginStep, x => (x === "wisp" ? <WispLoginStep /> : (x === "jump" ? <JumpScriptLoginStep /> : <SignInLoginStep />)))}
		</div>
	)
}

export default Login;
export { WispLoginStep };
