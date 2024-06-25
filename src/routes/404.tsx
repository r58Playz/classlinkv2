import { Card, Button } from "m3-dreamland";
import { Router } from "../router";

const Page404: Component<{}, {}> = function() {
	this.css = `
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		.Card-m3-container {
			display: flex;
			align-items: center;
		}
		.Button-m3-container {
			margin-top: 1em;
		}
	`
	return (
		<div>
			<Card type="filled">
				<div class="m3-font-headline-large">404</div>
				<Button type="tonal" on:click={()=>{Router.route("/")}}>Back home</Button>
			</Card>
		</div>
	)
}

export default Page404;
