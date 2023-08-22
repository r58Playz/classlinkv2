import styles from './settings.module.css';
import { useState, useEffect, useRef } from 'react';
import { CB } from '@/components/utils.js';

function Utilities() {
  const [startSession, setStartSession] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(false)
  const [endSession, setEndSession] = useState(false)

  const [alaSendDisabled, setAlaSendDisabled] = useState(false);
  const [currentLaunchToken, setCurrentLaunchToken] = useState(null);
  const alaInputRef = useRef(null);

  const [apptimerSendDisabled, setApptimerSendDisabled] = useState(true);
  const [apptimerActiveS, setApptimerActiveS] = useState(0);

  const startSessionHandler = async () => {
    setStartSession(true);
    await fetch("/api/clAnal/startSession");
    setStartSession(false);
  }

  const sessionTimeoutHandler = async () => {
    setSessionTimeout(true);
    await fetch("/api/clAnal/resetSessionTimeout");
    setSessionTimeout(false);
  }

  const endSessionHandler = async () => {
    setEndSession(true);
    await fetch("/api/clAnal/endSession");
    setEndSession(false);
  }

  const alaInputHandler = () => {
    if(alaSendDisabled !== !alaInputRef.current.value) setAlaSendDisabled(!alaInputRef.current.value)
    if(!Number.isFinite(+alaInputRef.current.value)) setAlaSendDisabled(true);
  }
  
  const alaSendHandler = async () => {
    setAlaSendDisabled(true);
    const json = await fetch("/api/clAnal/ala?id="+alaInputRef.current.value).then(r=>r.json());
    setCurrentLaunchToken(json.launchToken);
    setAlaSendDisabled(false);
    setApptimerSendDisabled(false);
  }

  const apptimerSendActivity = async () => {
    setApptimerSendDisabled(true);
    const json = await fetch(`/api/apptimer/activity?launchToken=${currentLaunchToken}&time=300`).then(r=>r.json());
    setApptimerActiveS(json.activeS);
    setApptimerSendDisabled(false);
  }

  const apptimerSendClose = async () => {
    setApptimerSendDisabled(true);
    const json = await fetch(`/api/apptimer/close?launchToken=${currentLaunchToken}&time=300`).then(r=>r.json());
    setApptimerActiveS(json.activeS)
    setCurrentLaunchToken("");
  }

  return (
    <div>
      <div className={styles.medheading}>Utilities</div>
      <p>Start and end sessions, and also reset your Classlink token expire timeout (you need an active session to reset timeout). Useful to inflate analytics.</p>
      <div className={styles.flexBtns}>
        <button disabled={startSession} className={styles.classlinkButton} onClick={startSessionHandler}>Start Session</button>
        <button disabled={sessionTimeout} className={styles.classlinkButton} onClick={sessionTimeoutHandler}>Reset Timeout</button>
        <button disabled={endSession} className={styles.classlinkButton} onClick={endSessionHandler}>End Session</button>
      </div>
      <p>Send an app launch analytics event for a specified app ID. Useful to inflate analytics.</p>
      <div className={styles.flexBtns}>
        <input placeholder="App ID" onChange={alaInputHandler} ref={alaInputRef} className={`${styles.inputEl} ${styles.expand}`} />
        <button disabled={alaSendDisabled} className={styles.classlinkButton} onClick={alaSendHandler}>Send</button>
      </div>
      <p>The pinnacle of trolling: Send an "apptimer" event to spoof how long an app has been active for. Requires a launch token acquired from the app launch event above.</p>
      <div className={styles.flexBtns}>
        <input placeholder="Launch token" disabled value={currentLaunchToken ?? undefined} className={`${styles.inputEl} ${styles.expand}`}/>
      </div>
      <p>Server sent active seconds: {apptimerActiveS}</p>
      <div className={styles.flexBtns}>
        <button disabled={apptimerSendDisabled} className={styles.classlinkButton} onClick={apptimerSendActivity}>Activity event</button>
        <button disabled={apptimerSendDisabled} className={styles.classlinkButton} onClick={apptimerSendClose}   >Close event</button>
      </div>
      <p>
        You can also use <a href="/trollAPI.py">the trollAPI python script</a> which will automatically spam analytics for you. You need to install the <CB>requests</CB> library and then edit the configuration at the top of the file. To run, just pass your bearer and GWS token on the command line like so:
      </p>
      <p>
        <CB>python3 trollAPI.py bearerToken gwsToken</CB>
      </p>
      <p>
        Your bearer and GWS tokens are available in the Stats for nerds section below.
      </p>
    </div>
  )
}

export default function Settings() {
  let [resetText, setResetText] = useState("Remove redirect");
  let [enableAppLaunchAnalytics, setEnableAppLaunchAnalytics] = useState(false);

  const resetRedirect = () => {
    localStorage.removeItem("redirectUri");
    setResetText("Removed!");
  }
  const enableALA = () => {
    localStorage.setItem("alaEnabled", "femboy");
    setEnableAppLaunchAnalytics(true);
  }
  const disableALA = () => {
    localStorage.removeItem("alaEnabled");
    setEnableAppLaunchAnalytics(false);
  }
  useEffect(()=>{
    if(resetText === "Removed!") {
      setTimeout(()=>{setResetText("Remove redirect")}, 1000);
    }
    if(localStorage.getItem("alaEnabled")) setEnableAppLaunchAnalytics(true);
  })

  return <div>
    <p>
      Remove the redirect when you are not logged in and the jump script is active:
    </p>
    <button onClick={resetRedirect} className={styles.classlinkButton}>{resetText}</button>
    <p>
      Send an app launch analytics message to Classlink servers when you launch an app:
    </p>
    <div className={styles.flexBtns}>
      <span>{enableAppLaunchAnalytics ? "Enabled" : "Disabled"}</span>
      <button onClick={enableALA} className={styles.classlinkButton}>Enable</button>
      <button onClick={disableALA} className={styles.classlinkButton}>Disable</button>
    </div>
    <hr />
    <Utilities />
  </div>
}
