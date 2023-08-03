import { useState, useEffect, useRef } from 'react';
import styles from './loginStageOne.module.css';
import jumpScriptVersion, { CB } from './utils.js';

function JumpScriptInstructions() {
  let [showInstructions, setShowInstructions] = useState(false);
  let [instructionType, setInstructionType] = useState(false);
  
  const handler = (type) => {
    if(instructionType !== type && showInstructions) {
      setInstructionType(type);
    } else if (instructionType === type && showInstructions) {
      setShowInstructions(false);
    } else {
      setShowInstructions(true);
      setInstructionType(type);
    }
  }

  return (
    <div>
      <div className={styles.scriptStatus}>Jump script status: <span className={styles.notInstalled}>not detected</span></div>
      <p>
        Please install the jump script with either uBlock Origin or your favorite userscript manager. If you are using iOS, I recommend <a href="https://apps.apple.com/us/app/userscripts/id1463298887">Userscripts</a> as a userscript manager.
      </p>
      <div className={styles.tile} onClick={()=>{handler(true)}}>{showInstructions && instructionType ? "Hide uBlock Origin instructions" : "Show uBlock Origin instructions"}</div>
      <div className={styles.tile} onClick={()=>{handler(false)}}>{showInstructions && !instructionType ? "Hide userscript (and iOS) instructions" : "Show userscript (and iOS) instructions"}</div>
      { showInstructions && <p>
        Instructions:
      </p> }
      {showInstructions && instructionType && <ol>
        <li>Open uBlock Origin settings.</li>
        <li>Scroll down to <CB>Advanced</CB>.</li>
        <li>Check the <CB>I am an advanced user</CB> checkbox.</li>
        <li>Click on the cog that appears.</li>
        <li>Find <CB>userResourcesLocation</CB> and do either one of these:</li>
        <ul>
          <li>Remove <CB>unset</CB> and replace it with <CB>https://classlink.r58playz.dev/userResources</CB>.</li>
          <li>Append <CB>https://classlink.r58playz.dev/userResources</CB> to the end of the existing URL list.</li>
        </ul>
        <li>Close the <CB>Advanced settings</CB> tab.</li>
        <li>Click on <CB>My filters</CB>.</li>
        <li>Add <CB>myapps.classlink.com##+js(classlinkJumpScript.js)</CB> to a new line.</li>
        <li>Optionally add <CB>launchpad.classlink.com##+js(classlinkJumpScript.js)</CB> to a new line to enable Classlinkv2's Classlink LaunchPad extension emulation feature.</li>
        <li>Add <CB>classlink.r58playz.dev##+js(classlinkJumpScript.js)</CB> to a new line.</li>
        <li>Click <CB>Apply changes</CB>.</li>
        <li>Reload this page.</li>
      </ol> }
      {showInstructions && !instructionType && <div><ol>
        <li>Install the <a href="/classlink.user.js">userscript</a> by clicking on it.</li>
      </ol><p><b>If you are using iOS</b>, please download and copy the userscript into the userscript folder you selected after setting up the <a href="https://apps.apple.com/us/app/userscripts/id1463298887">Userscripts</a> app.</p></div>}
    </div>
  )
}

function OutOfDateInstructions() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructionType, setInstructionType] = useState(false);
  const [scriptVersion, setScriptVersion] = useState("unknown");
  
  const handler = (type) => {
    if(instructionType !== type && showInstructions) {
      setInstructionType(type);
    } else if (instructionType === type && showInstructions) {
      setShowInstructions(false);
    } else {
      setShowInstructions(true);
      setInstructionType(type);
    }
  }

  useEffect(()=>{
    setScriptVersion(window.jumpScriptInstalled);
  })

  return (
    <div>
      <div className={styles.scriptStatus}>Jump script status: <span className={styles.installed}>detected, </span><span className={styles.outOfDate}>out of date</span></div>
      <p>
        Please update your jump script version. Your version is <CB>{scriptVersion || "unknown"}</CB> and the latest is <CB>{jumpScriptVersion}</CB>.
      </p>
      <div className={styles.tile} onClick={()=>{handler(true)}}>{showInstructions && instructionType ? "Hide uBlock Origin instructions" : "Show uBlock Origin instructions"}</div>
      <div className={styles.tile} onClick={()=>{handler(false)}}>{showInstructions && !instructionType ? "Hide userscript (and iOS) instructions" : "Show userscript (and iOS) instructions"}</div>
      { showInstructions && <p>
        Instructions:
      </p> }
      {showInstructions && instructionType && <ol>
        <li>Open uBlock Origin settings.</li>
        <li>Click on <CB>Filter lists</CB>.</li>
        <li>Click on <CB>Purge all caches</CB>.</li>
        <li>Click on <CB>Update now</CB>.</li>
        <li>Reload this page.</li>
      </ol> }
      {showInstructions && !instructionType && <div><ol>
        <li>Delete the original userscript.</li>
        <li>Install the <a href="/classlink.user.js">userscript</a>.</li>
      </ol><p><b>If you are using iOS</b>, download the <a href="/classlink.user.js">userscript</a> and replace the file in your userscripts folder with this one.</p></div>}
      <hr />
      <p>
        Version-specific announcements:
      </p>
      <p>
        None so far.
      </p>
    </div>
  )
}


function DetectingUI() {
  return (
    <div>
      <div className={styles.scriptStatus}>Jump script status: <span className={styles.detecting}>detecting</span></div>
      <p>
        If the status is stuck here, an error has occurred. Please report it to the email address on <a href="https://r58playz.dev">my site</a>.
      </p>
    </div>
  )
}

function RedirectUI() {
  const ref=useRef(null);
  const [saveText, setSaveText] = useState("Save");
  const setRedirectUri = ()=>{
    localStorage.setItem("redirectUri", ref.current.value);
    setSaveText("Saved!");
  }

  useEffect(()=>{
    if(saveText === "Saved!") setTimeout(()=>{setSaveText("Save")}, 1000);
  })
  return (
    <div>
      <div className={styles.scriptStatus}>Jump script status: <span className={styles.installed}>detected, up to date</span></div>
      <p>
        When you're ready, open your Classlink portal and log in. If you have installed the jump script correctly, you should be redirected to this website, logged in.
      </p>
      <p>
        If you want, you can also automatically redirect to your Classlink login page once the jump script is detected. This can be cleared by clearing site data for this site in your browser settings, or by clicking the <CB>Remove redirect</CB> button once you are logged in. The redirect URL is stored client side and not sent to any servers.
      </p>
      <div className={styles.saveRedirect}><input placeholder="Redirect URL" type="text" autoCorrect="off" autoComplete="off" ref={ref} /><button onClick={setRedirectUri}>{saveText}</button></div>
      <p className={styles.bold}>It is safe to close this tab now.</p>
    </div>
  )
}

export default function LoginStage1() {
  let [hasJumpScript, setHasJumpScript] = useState("detecting");

  const func = ()=>{
    const r = localStorage.getItem("redirectUri")
    if(r && window.jumpScriptInstalled === jumpScriptVersion) {window.location=r} 
    if(window.jumpScriptInstalled === jumpScriptVersion) {
      setHasJumpScript("yes");
    } else if(!window.jumpScriptInstalled) {
      setHasJumpScript("no");
    } else if(window.jumpScriptInstalled !== jumpScriptVersion) {
      setHasJumpScript("outofdate");
    }
  }

  useEffect(()=>{setTimeout(func,1000)},[]);

  let Component = DetectingUI;
  if(hasJumpScript === "yes") {
    Component = RedirectUI;
  } else if(hasJumpScript === "no") {
    Component = JumpScriptInstructions;
  } else if(hasJumpScript === "outofdate") {
    Component = OutOfDateInstructions;
  }
  

  return (
    <div className={styles.container}>
      <div className={styles.header}>Log In</div>
      <Component />
      <button onClick={()=>{
        setHasJumpScript("detecting");
        setTimeout(func,250);
      }}>Try to detect userscript</button>
    </div>
  )
}
