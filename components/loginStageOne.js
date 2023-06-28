import styles from './loginStageOne.module.css';
import { useState, useEffect } from 'react';

function CB({ children }) {
  return <span className={styles.inlineCode} children={children}></span>
}

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
        Please install the jump script with either uBlock Origin or your favorite userscript manager.
        If you are using a userscript manager, you will need to manually populate a new userscript with the code and inject rules.
      </p>
      <div className={styles.tile} onClick={()=>{handler(true)}}>{showInstructions && instructionType ? "Hide uBlock Origin instructions" : "Show uBlock Origin instructions"}</div>
      <div className={styles.tile} onClick={()=>{handler(false)}}>{showInstructions && !instructionType ? "Hide userscript instructions" : "Show userscript instructions"}</div>
      { showInstructions && <p>
        Instructions:
      </p> }
      {showInstructions && instructionType && <ol>
        <li>Open uBlock Origin settings.</li>
        <li>Scroll down to <CB>Advanced</CB></li>
        <li>Check the <CB>I am an advanced user</CB> checkbox</li>
        <li>Click on the cog that appears</li>
        <li>Find <CB>userResourcesLocation</CB> and do either one of these:</li>
        <ul>
          <li>Remove <CB>unset</CB> and replace it with <CB>https://classlink.r58playz.dev/userResources</CB></li>
          <li>Append <CB>https://classlink.r58playz.dev/userResources</CB> to the end of the existing URL list</li>
        </ul>
        <li>Close the <CB>Advanced settings</CB> tab</li>
        <li>Click on <CB>My filters</CB></li>
        <li>Add <CB>myapps.classlink.com##+js(classlinkJumpScript.js)</CB> to a new line</li>
        <li>Add <CB>classlink.r58playz.dev##+js(classlinkJumpScript.js)</CB> to a new line</li>
        <li>Click <CB>Apply changes</CB></li>
        <li>Reload this page</li>
      </ol> }
      {showInstructions && !instructionType && <ol>
        <li>Create a new userscript</li>
        <li>Set it to inject into <CB>classlink.r58playz.dev</CB> and <CB>myapps.classlink.com</CB></li>
        <li>Copy the latest code from in the uBlock Origin scriptlet at <CB>https://classlink.r58playz.dev/userResources</CB></li>
        <li>Paste it into the userscript</li>
        <li>Save the userscript</li>
        <li>Reload this page</li>
      </ol>}
    </div>
  )
}

function RedirectUI() {
  return (
    <div>
      <div className={styles.scriptStatus}>Jump script status: <span className={styles.installed}>detected</span></div>
      <p>
        When you're ready, open your Classlink portal and log in. If you have installed the jump script correctly, you should be redirected to this website, logged in.
      </p>
      <p className={styles.bold}>It is safe to close this tab now.</p>
    </div>
  )
}

export default function LoginStage1() {
  let [hasJumpScript, setHasJumpScript] = useState(false);

  useEffect(()=>{
    setHasJumpScript(!!window.jumpScriptInstalled);
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>Log In</div>
      { hasJumpScript ? <RedirectUI /> : <JumpScriptInstructions /> }
    </div>
  )
}
