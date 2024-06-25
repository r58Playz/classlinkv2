import { fetch } from "../../epoxy";
import { tokens } from "../../store";

const Dashboard: Component<{}, {}> = function() {
	this.mount = async () => {
		const searchParams = new URLSearchParams(location.search);
		if (searchParams.has("code")) {
			const resp = await fetch(`https://applications.apis.classlink.com/exchangeCode?code=${searchParams.get("code")}&response_type=code`).then(r => r.json());
			tokens.code = searchParams.get("code");
			tokens.gws = resp.gwsToken;
			tokens.token = resp.token;
			history.replaceState(null, "", location.pathname);
		}
	}

	return (
		<div>
		</div>
	);
}

export default Dashboard;
