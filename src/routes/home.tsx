import Login from "./home/login";

const Home: Component<{}, {}> = function() {
	this.css = `
		padding: 1em;

		.warning {
			color: rgb(var(--m3-scheme-error))
		}
	`;
	return (
		<div>
			<h1 class="m3-font-display-medium">Classlinkv2</h1>
			<p>
				Classlinkv2 is an alternate frontend for Classlink that was created for quick and easy access to SSO apps without the bloat that is the official Classlink frontend. It's designed to make logins with Classlink faster and easier. It's not filled with bloat like the "seasonal events" or fancy backgrounds; it only includes the bare minimum needed to log into an app with a decent UI. It also includes a "fast login" feature, which allows the user to log into a specific app ID with a direct URL, as well as analytics spoofing to inflate analytics to the point that they are useless.
			</p>
			<p>
				Classlinkv2 is built with the <a href="https://dreamland.js.org" target="_blank" rel="noopener noreferrer">dreamland.js</a> framework. It's lightweight (smaller than preact). Classlinkv2 also uses the <a href="https://github.com/MercuryWorkshop/m3-dreamland" target="_blank" rel="noopener noreferrer">m3-dreamland</a> UI component library which provides Material 3 components. To keep Classlink accounts safe, all API requests are performed end-to-end encrypted and on-browser through <a href="https://github.com/MercuryWorkshop/epoxy-tls" target="_blank" rel="noopener noreferrer">epoxy-tls</a>, which allows performing encrypted HTTP requests through a TCP proxy server that supports the <a href="https://github.com/MercuryWorkshop/wisp-protocol" target="_blank" rel="noopener noreferrer">Wisp protocol</a>.
			</p>
			<Login />
		</div>
	);
};

export default Home;
