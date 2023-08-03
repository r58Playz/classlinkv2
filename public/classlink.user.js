// ==UserScript==
// @name Classlinkv2 Jump Script
// @author r58Playz
// @description Classlink jump script to intercept login
// @include *classlink.r58playz.dev*
// @include *myapps.classlink.com*
// @include *launchpad.classlink.com*
// @run-at document-end
// @inject-into page
// @version 1.3-1
// ==/UserScript==
const h = window.location.hostname;
const p = window.location.pathname;
const s = new URLSearchParams(window.location.search);
const r = ()=>{const d = document;d.open();d.write("");d.close()};
const dev = false;
if(h === "classlink.r58playz.dev" || h === "localhost") {
  window.jumpScriptInstalled = "nya~1.3~patch"; 
} else if ((h === "myapps.classlink.com" || h === "stagingmyapps.classlink.com") && p.includes("oauth") && s.get("code") && !s.get("skipIntercept")) {
  // Intercept login
  r();
  window.location=`${dev ? 'http://localhost:3000' : 'https://classlink.r58playz.dev'}/api/login/stage2?code=${s.get("code")}`
} else if ((h === "launchpad.classlink.com" || h === "stagingclouddesktop.classlink.com") && p.includes("browsersso")) {
  // spoof detection for browsersso - copied straight from the extension, except with giant version
  var _div=document.createElement("div");_div.setAttribute("id","sCLExtInstalled");_div.innerText="1";_div.setAttribute("data-version","99.9");_div.style.display="none";document.body.appendChild(_div)
  // then automatically redirect to the target url
  let fired = false;
  let observer = new MutationObserver((mutations)=>{
    mutations.forEach((mutation)=>{
      if(mutation.target.classList.value.includes("box1") && !fired) {
        fired = true;
        console.log("classlinkv2-jumpscript: browsersso loaded");
        mutation.target.style.display = "none";
        let box = document.createElement("div");
        box.classList.add("box1");
        box.innerHTML=`<h2 class="box-title">Logging into ${window.IdConfig.appResponse.name}</h2><p>Classlinkv2 jump script is redirecting you to the login page...</p>`;
        document.querySelector(".container").appendChild(box);
        window.location.href = window.IdConfig.appResponse.login_url;
      }
    })
  })
  observer.observe(document.querySelector(".container"), {attributeFilter:["style"],subtree:true});
}

