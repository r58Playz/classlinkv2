// ==UserScript==
// @name Classlinkv2 Jump Script
// @author r58Playz
// @description Classlink jump script to intercept login
// @include *myapps.classlink.com*
// @include *launchpad.classlink.com*
// @run-at document-end
// @inject-into page
// @version 3.0
// @grant none
// ==/UserScript==
const params = new URLSearchParams(location.search);
const dev = false;
if (
	(location.hostname === "myapps.classlink.com" || location.hostname === "stagingmyapps.classlink.com")
	&& location.pathname.includes("oauth")
	&& params.get("code")
) {
	document.open();
	document.write("");
	document.close();
	window.location = (dev ? "http://localhost:5173/" : "https://classlink.r58playz.dev/") + "dashboard?code=" + params.get("code")
} else if (
	(location.hostname === "launchpad.classlink.com" || location.hostname === "stagingclouddesktop.classlink.com")
	&& location.pathname.includes("browsersso")
) {
	// spoof detection for browsersso - copied straight from the extension, except with giant version
	const el = document.createElement("div");
	el.setAttribute("id", "sCLExtInstalled");
	el.innerText = "1";
	el.setAttribute("data-version", "99.9");
	el.style.display = "none";
	document.body.appendChild(el)

	// then automatically redirect to the target url
	let fired = false;
	let observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.target.classList.value.includes("box1") && !fired) {
				fired = true;
				console.log("classlinkv2-jumpscript: browsersso loaded");
				mutation.target.style.display = "none";
				let box = document.createElement("div");
				box.classList.add("box1");
				box.innerHTML = `<h2 class="box-title">Logging into ${window.IdConfig.appResponse.name}</h2><p>Classlinkv2 jump script is redirecting you to the login page...</p>`;
				document.querySelector(".container").appendChild(box);
				window.location.href = window.IdConfig.appResponse.login_url;
			}
		})
	})
	observer.observe(document.querySelector(".container"), { attributeFilter: ["style"], subtree: true });
	// or in some cases...
	document.documentElement.addEventListener("classlink-extension-msg", (e) => { window.location.href = (JSON.parse(e.detail)).appResponse.login_url });
}
