import 'dreamland/dev';
import { Router } from './router';

import { StyleFromParams } from 'm3-dreamland';

import './index.css';
import { settings } from './store';


export const schemes = ["tonal_spot", "content", "fidelity", "vibrant", "expressive", "neutral", "monochrome"] as const;
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
			<StyleFromParams
				scheme={use(settings.themeScheme, x => schemes[x])}
				color={use(settings.themeColor)}
				contrast={use(settings.themeContrast, transformContrast)}
			/>
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
