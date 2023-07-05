import Layout from '@/components/layout.js';
import styles from '@/styles/dashboard.module.css';
import fetchWithBearer, { uiHelper } from '@/lib/classlink.js';
import { CB } from '@/components/utils.js'
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

function AppsView({ data, alaEnabled }) {
  let [instantLoginData, setInstantLoginData] = useState(false);
  const urlHandler = (url) => {
    window.open(url, '_blank');
  }
  const ltissoHandler = (id) => {
    window.open("https://launchpad.classlink.com/ltisso/"+id, "_blank");
  }
  const browserssoHandler = (id) => {
    window.open("https://launchpad.classlink.com/browsersso/"+id, "_blank");
  }
  const appHandler = (url, id, type, alaEnabled) => {
    switch(type) {
      case 15:
        return <button onClick={()=>{if(alaEnabled){fetch("/api/clAnal/ala?id="+id)};browserssoHandler(id)}} className={styles.appLogIn}>Log In</button>
      case 16:
        return <button onClick={()=>{if(alaEnabled){fetch("/api/clAnal/ala?id="+id)};ltissoHandler(id)}} className={styles.appLogIn}>Log In</button>
      case 30:
      case 31:
        return <button onClick={()=>{if(alaEnabled){fetch("/api/clAnal/ala?id="+id)};urlHandler(url[0])}} className={styles.appLogIn}>Log In</button>
      default:
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
          const a = app[0];
          switch(a.type) {
            case 15:
              if(alaEnabled){fetch("/api/clAnal/ala?id="+a.id)};
              window.location = "https://launchpad.classlink.com/browsersso/"+a.id;
              break;
            case 16:
              if(alaEnabled){fetch("/api/clAnal/ala?id="+a.id)};
              window.location = "https://launchpad.classlink.com/ltisso/"+a.id;
              break;
            case 30:
            case 31:
              if(alaEnabled){fetch("/api/clAnal/ala?id="+a.id)};
              window.location = a.url[0];
              break;
            default:
              setInstantLoginData("__CLASSLINKV2_UNSUPPORTED_APP__");
              return;
          }
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
      { data.map(({ name, icon, url, id, type }) => {
        return (
          <div className={styles.app} key={name}>
            <img width="48" height="48" src={icon} alt={name} className={styles.appIcon} />
            <div className={styles.appName}>{name}</div>
            <div className={styles.appId}>{id}</div>
            {appHandler(url, id, type, alaEnabled)}
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
  const alaInputRef = useRef(null);

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
    await fetch("/api/clAnal/ala?id="+alaInputRef.current.value);
    setAlaSendDisabled(false);
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
          NOTE: Some apps are unsupported, there's no documentation for the APIs I'm using so I have no idea how some app "types" work. There is a button to open ClassLink if any apps are unsupported below. You cannot open Classlink normally, you will need to use this button.
        </p>
        <p>
          You can add <CB>?id=&lt;insert app id here&gt;</CB> to the end of this URL to quickly log into an app. This won't work if you have been logged out however, since you will have to use the jump script to log back in. App IDs can be found between the app name and login button in small letters.
        </p>
        <div className={styles.flexBtns}>
          <button onClick={classLinkHandler} className={styles.classlinkButton}>Open ClassLink</button>
          <Link 
            className={`${backpackData.enableStudentbackpack!=='1' ? styles.classlinkLinkDisabled : ''} ${styles.classlinkLink}`} 
            href="/backpack">
            {backpackData.enableStudentbackpack==='1' ? "Open Backpack Frontend" : "Backpack disabled by admin"}
          </Link>
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
    const userData = await fetchWithBearer("https://nodeapi.classlink.com/v2/my/info", data.cookies.t).then(r=>r.json());
    const apps = await fetchWithBearer("https://applications.apis.classlink.com/v1/applicationsPageLoad?", data.cookies.t).then(r=>r.json());
    const backpackData = await fetchWithBearer("https://nodeapi.classlink.com/tenant/customization/backpack", data.cookies.t).then(r=>r.json());
    return { name: `${userData.FirstName} ${userData.LastName}`, userName: userData.DisplayName, districtName: userData.Tenant, email: userData.Email, apps: apps.apps, fullData: userData, backpackData }
  });
}
