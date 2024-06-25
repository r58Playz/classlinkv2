import 'dreamland/dev';
import { Router } from './router';
import { Styles } from 'm3-dreamland';

//Used to style anything outside of components
import './index.css';

// typescript syntax for defining components
const App: Component<
    {
        // component properties. if you had a component that took a property like `<Button text="..." /> you would use a type like the one in the following line
        // text: string
    },
    {
        // types for internal state
		renderRoot: HTMLElement,
    }
> = function () {
	this.mount = () => {
		Router.render(this.renderRoot);
	};

	return (
		<div id="app">
			<Styles
				light={{ "primary": 4287450666, "onPrimary": 4294967295, "primaryContainer": 4294958026, "onPrimaryContainer": 4281536768, "inversePrimary": 4294948495, "secondary": 4285945928, "onSecondary": 4294967295, "secondaryContainer": 4294958026, "onSecondaryContainer": 4281013770, "tertiary": 4284768306, "onTertiary": 4294967295, "tertiaryContainer": 4293649835, "onTertiaryContainer": 4280163328, "error": 4290386458, "onError": 4294967295, "errorContainer": 4294957782, "onErrorContainer": 4282449922, "background": 4294965494, "onBackground": 4280424981, "surface": 4294965494, "onSurface": 4280424981, "surfaceVariant": 4294237908, "onSurfaceVariant": 4283581501, "inverseSurface": 4281871913, "inverseOnSurface": 4294962662, "outline": 4286936171, "outlineVariant": 4292330169, "shadow": 4278190080, "scrim": 4278190080, "surfaceDim": 4293449679, "surfaceBright": 4294965494, "surfaceContainerLowest": 4294967295, "surfaceContainerLow": 4294963691, "surfaceContainer": 4294765283, "surfaceContainerHigh": 4294370781, "surfaceContainerHighest": 4293976024, "surfaceTint": 4287450666 }}
				dark={{ "primary": 4294948495, "onPrimary": 4283638273, "primaryContainer": 4285544212, "onPrimaryContainer": 4294958026, "inversePrimary": 4287450666, "secondary": 4293312171, "onSecondary": 4282592029, "secondaryContainer": 4284236082, "onSecondaryContainer": 4294958026, "tertiary": 4291741841, "onTertiary": 4281610504, "tertiaryContainer": 4283123741, "onTertiaryContainer": 4293649835, "error": 4294948011, "onError": 4285071365, "errorContainer": 4287823882, "onErrorContainer": 4294957782, "background": 4279898637, "onBackground": 4293976024, "surface": 4279898637, "onSurface": 4293976024, "surfaceVariant": 4283581501, "onSurfaceVariant": 4292330169, "inverseSurface": 4293976024, "inverseOnSurface": 4281871913, "outline": 4288646532, "outlineVariant": 4283581501, "shadow": 4278190080, "scrim": 4278190080, "surfaceDim": 4279898637, "surfaceBright": 4282464050, "surfaceContainerLowest": 4279503881, "surfaceContainerLow": 4280424981, "surfaceContainer": 4280753689, "surfaceContainerHigh": 4281477155, "surfaceContainerHighest": 4282200878, "surfaceTint": 4294948495 }} />
			<div bind:this={use(this.renderRoot)} />
		</div>
	);
};

window.addEventListener('load', () => {
    document.getElementById('app')!.replaceWith(<App />);
});
