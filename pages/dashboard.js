import Layout from '@/components/layout.js';
import styles from '@/styles/dashboard.module.css';
import fetchWithBearer, { uiHelper, app2url } from '@/lib/classlink.js';
import { CB } from '@/components/utils.js'
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import ClampLines from 'react-clamp-lines';

function AppsView({ data, alaEnabled }) {
  let [instantLoginData, setInstantLoginData] = useState(false);
  const urlHandler = (url) => {
    window.open(url, '_blank');
  }
  const appHandler = (app, alaEnabled) => {
    const url = app2url(app);
    if(url !== null) {
      return <button onClick={()=>{if(alaEnabled){fetch("/api/clAnal/ala?id="+id)};urlHandler(url)}} className={styles.appLogIn}>Log In</button>
    } else {
      return <button disabled className={styles.appLogIn}>Unsupported</button>
    }
  }

  useEffect(()=>{
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if(searchParams.get("id") && !instantLoginData) {
        const targetId = parseInt(searchParams.get("id"));
        const app = data.filter(({id}) => id === targetId);
        if(app.length) {
          const url = app2url(app[0]);
          if(url !== null) {
            window.location = a.url[0];
          } else {
            setInstantLoginData("__CLASSLINKV2_UNSUPPORTED_APP__");
            return;
          }
          if(alaEnabled){fetch("/api/clAnal/ala?id="+a.id)};
          setInstantLoginData(a.name);
        } else {
          setInstantLoginData("__CLASSLINKV2_NOT_FOUND__");
        }
      }
    }catch(err){};
  });

  if(instantLoginData && instantLoginData !== "__CLASSLINKV2_UNSUPPORTED_APP__" && instantLoginData !=="__CLASSLINKV2_NOT_FOUND__") {
    return (
      <div className={styles.instantLoginView}>
        <div className={styles.instantLoginHeader}>Logging into {instantLoginData}...</div>
      </div>
    )
  } else if(instantLoginData === "__CLASSLINKV2_UNSUPPORTED_APP__") {
    return  (
      <div className={styles.instantLoginView}>
        <div className={styles.instantLoginHeader}>Unsupported</div>
        <p>The app you tried to log into is unsupported by Classlinkv2. Remove <CB>?id=&lt;id&gt;</CB> from the URL to go back to Classlinkv2.</p>
      </div>
    )
  } else if(instantLoginData === "__CLASSLINKV2_NOT_FOUND__") {
    return (
      <div className={styles.instantLoginView}>
        <div className={styles.instantLoginHeader}>Not Found</div>
        <p>The app you tried to log into was not found. Remove <CB>?id=&lt;id&gt;</CB> from the URL to go back to Classlinkv2.</p>
      </div>
    )
  }

  return (
    <div className={styles.appsView}>
      { data.map((app) => {
        const name = app.name; 
        const icon = app.icon;
        const id = app.id;

        return (
          <div className={styles.app} key={name}>
            <img width="48" height="48" src={icon} alt={name} className={styles.appIcon} />
            <div className={styles.appName}>{name}</div>
            <div className={styles.expand}></div>
            <div className={styles.appId}>{id}</div>
            <div className={styles.expand}></div>
            {appHandler(app, alaEnabled)}
          </div>
        )
      }) }
    </div>
  )
}


function NerdStats({sd}) {
  return (
    <div>
      <div className={styles.medheading}>Stats for nerds</div>
      <p>
        Like the YouTube option.
      </p>
      <p>Your tokens:</p>
      <ul>
        <li>Classlink "login code": <CB>{sd.code}</CB></li>
        <li>Bearer token: <CB>{sd.token}</CB></li>
        <li>GWS token (analytics): <CB>{sd.gws}</CB></li>
      </ul>
      <p>Your user data:</p>
      <ul>
      {Object.entries(sd.fullData).map(([key, value])=>{
        return <li key={key}><CB>{key}</CB>: <CB>{JSON.stringify(value)}</CB></li>
      })}
      </ul>
      <p>Your app data:</p>
      <ul>
        {sd.apps.map((app, id)=>{
          return <div key={id}>
            <li>{id}</li>
            <ul>{Object.entries(app).map(([key, value])=>{
              return <li key={key}><CB>{key}</CB>: <CB>{JSON.stringify(value)}</CB></li>
            })}</ul>
          </div>
        })}
      </ul>
    </div>
  )
}

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

export default function Dashboard({sd}) {
  let [resetText, setResetText] = useState("Remove redirect");
  let [currentlyLoggingIn, setCurrentlyLoggingIn] = useState(false);
  let [enableAppLaunchAnalytics, setEnableAppLaunchAnalytics] = useState(false);
  const backpackData = sd.backpackData;
  const classLinkHandler = () => {
    window.open("/api/login/openClasslink", '_blank');
  } 
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
    const searchParams = new URLSearchParams(window.location.search);
    if(searchParams.get("id") && !currentlyLoggingIn) {
      setCurrentlyLoggingIn(true);
      return;
    }
    if(resetText === "Removed!") {
      setTimeout(()=>{setResetText("Remove redirect")}, 1000);
    }
    if(localStorage.getItem("alaEnabled")) setEnableAppLaunchAnalytics(true);
  })

  return (
    <Layout title="Dashboard">
      <div className={styles.heading}>Classlinkv2</div>
      <div className={styles.subheading}>Hello {sd.name} ({sd.districtName})</div>
      <div>{sd.userName}: {sd.email}</div>
      <hr />
      { !currentlyLoggingIn && <div>
        <div className={styles.medheading}>Apps</div>
        <p className={styles.note}>
          NOTE: There is a button to open ClassLink if any apps are unsupported below. You cannot open Classlink normally, you will need to use this button.
        </p>
        <p>
          You can add <CB>?id=&lt;insert app id here&gt;</CB> to the end of this URL to quickly log into an app. This won't work if you have been logged out however, since you will have to use the jump script to log back in. App IDs can be found between the app name and login button in small letters.
        </p>
        <p>Open:</p>
        <div className={styles.flexBtns}>
          <button onClick={classLinkHandler} className={styles.classlinkButton}>Classlink</button>
          <Link className={styles.classlinkLink} href="/backpack">Backpack</Link>
          <Link className={styles.classlinkLink} href="/anal">Analytics</Link>
        </div>
      </div> }
      <AppsView data={sd.apps} alaEnabled={enableAppLaunchAnalytics} />
      {!currentlyLoggingIn && <div>
        <hr />
        <Utilities />
        <hr />
        <div className={styles.medheading}>Settings</div>
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
        <NerdStats sd={sd} />
      </div>}
    </Layout>
  )
}

export async function getServerSideProps({ req, res }) {
  return await uiHelper(req, res, {}, async (req, res, data) => {
    const userData = data.userData;
    const apps = await fetchWithBearer("https://applications.apis.classlink.com/v1/applicationsPageLoad?", data.cookies.t).then(r=>r.json());
    return {
      name: `${userData.FirstName} ${userData.LastName}`,
      userName: userData.DisplayName,
      districtName: userData.Tenant,
      email: userData.Email,
      apps: apps.apps,
      fullData: userData,
      token: data.cookies.t,
      code: data.cookies.c,
      gws: data.cookies.g,
    };
  });
}
