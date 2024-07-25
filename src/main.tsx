import 'dreamland/dev';
import { Router } from './router';

// @ts-ignore
import { Styles } from 'm3-dreamland';

import './index.css';
import { settings } from './store';

const App: Component<
	{
	},
	{
		renderRoot: HTMLElement,
	}
> = function() {
	this.mount = () => {
		Router.render(this.renderRoot);
	};

	return (
		<div id="app">
			<Styles
				bind:light={use(settings.lightTheme)}
				bind:dark={use(settings.darkTheme)} />
			<div bind:this={use(this.renderRoot)} />
		</div>
	);
};

window.addEventListener('load', () => {
	try {
		document.getElementById('app')!.replaceWith(<App />);
	} catch (err) {
		document.getElementById('app')!.replaceWith(document.createTextNode("Error while rendering (this is usually because of an old browser): " + err));
		console.error(err);
	}
});
