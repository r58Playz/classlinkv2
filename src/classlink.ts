// most of this taken from the chrome extension
export function app2url(app: any): string | null {
	const urlList = app.url || [];
	const launchpad = "https://launchpad.classlink.com";
	const id = app.id;
	const eId = encodeURIComponent(id);
	let url;
	if (urlList[0]) {
		const parsedUrl = new URL(urlList[0]);
		parsedUrl.protocol = parsedUrl.protocol || "https";
		url = parsedUrl.toString();
	} else {
		url = "";
	}

	switch (app.type) {
		case 1:
		case 25:
		case 26:
		case 30:
		case 31:
		case 32:
		case 37:
			return url;
		case 7:
		case 8:
			// window.CloudApp.MyApps.Controller.openRDPClient 
			return null;
		case 9:
			return `${launchpad}/clsso/${eId}`;
		case 14:
			return url;
		case 15:
			return `${launchpad}/browsersso/${eId}`;
		case 16:
		case 36:
			return `${launchpad}/ltisso/${id}`;
		case 17:
			return `${launchpad}/focussso/${id}`;
		case 18:
			return `${launchpad}/pearson/mathxl/${id}`;
		case 19:
			return `${launchpad}/pearson/mymathlab/${id}`;
		case 20:
			return `${launchpad}/custom/certification/${id}`;
		case 21:
			return `${launchpad}/oneroster/${id}`;
		case 22:
			return `${launchpad}/phonebook/${id}`;
		case 23:
			return `${launchpad}/onerosterlti/${id}`;
		case 24:
			return `${launchpad}/assignapplication/${id}`;
		case 3:
		case 27:
			// window.CloudApp.MyApps.Controller.launchLocalApp
			return null;
		case 28:
			return `${launchpad}/custom/genericoneroster/ltilaunch/${id}`;
		case 29:
		case 33:
			return `${launchpad}/custom/pearsonapapp/${id}`;
		case 34:
			return `${launchpad}/custom/naviancestudentsso/${id}`;
		case 35:
			return `${launchpad}/oneroster/manage/class/${id}`;
		default:
			return null;
	}
}
