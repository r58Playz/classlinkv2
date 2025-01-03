import { fetchBearer, fetchGws } from "../../epoxy";
import { Router } from "../../router";
import Layout from "./layout";
import { Card } from "m3-dreamland";

function formatWeekends(weekends: string): string {
	return weekends.split(',').map(n => {
		return (["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])[parseInt(n)]
	}).join(', ')
}

const ClassTile: Component<{ class: any }, {}> = function() {
	this.css = `
		h2 {
			margin: 0;
		}
	`;

	return (
		<div>
			<Card type="elevated">
				<h2 class="m3-font-title-medium">{this.class.title}</h2>
				<div class="m3-font-label-medium">{this.class.sourcedId}</div>
				<div>Class size: {this.class.classSize}</div>
				{this.class.teachers.map((x: any) => { return <div>Teacher: {x.givenName} {x.familyName} ({x.sourcedId})</div>; })}
			</Card>
		</div>
	);
}

export const Classes: Component<{ loaded: boolean, error: Error | undefined, }, { disabled: boolean, schoolyear: any, classes: any }> = function() {
	this.loaded = false;
	this.error = undefined;
	this.disabled = false;
	this.schoolyear = { startHour: 0, endHour: 0, weekend: "" };
	this.classes = [];

	this.mount = async () => {
		try {
			const userData = await fetchBearer("https://nodeapi.classlink.com/v2/my/info").then(r => r.json());
			if (typeof userData.status === "number") {
				Router.route("/");
				return;
			}

			const backpack = await fetchBearer("https://nodeapi.classlink.com/tenant/customization/backpack").then(r => r.json());
			this.disabled = backpack.enableStudentbackpack !== "1";

			this.schoolyear = await fetchGws("https://analytics-data.classlink.io/teacherConsole/v1p0/schoolyear").then(r => r.json());
			this.classes = await fetchBearer("https://myclasses.apis.classlink.com/v1/classes").then(r => r.json());

			this.loaded = true;
		} catch (error) {
			this.error = error as Error;
		}
	};

	this.css = `
		.classes {
			display: flex;
			flex-direction: column;
			gap: 1em;
		}
	`;

	return (
		<div>
			<Layout loading={use(this.loaded, x => !x)} error={use(this.error)}>
				<h1 class="m3-font-headline-medium">Classes</h1>
				{$if(use(this.disabled), <p class="disabled">Your admin has disabled viewing of classes data. The APIs are still accessible however.</p>)}
				<p>
					School year: {use(this.schoolyear, x => x.Year)} ({use(this.schoolyear, x => x.startDate)} to {use(this.schoolyear, x => x.endDate)}) {use(this.schoolyear, x => x.startHour.toString().padStart(2, "0"))}:00-{use(this.schoolyear, x => x.endHour.toString().padStart(2, "0"))}:00, weekends on {use(this.schoolyear, x => formatWeekends(x.weekend))}
				</p>
				<div class="classes">
					{use(this.classes, x => x.map((x: any) => { return <ClassTile class={x} /> }))}
				</div>
			</Layout>
		</div>
	);
}
