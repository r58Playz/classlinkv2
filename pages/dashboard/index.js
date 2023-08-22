import Classlinkv2Layout from '@/components/dashboard/layout.js';
import styles from '@/styles/dashboard.module.css';
import fetchWithBearer, { uiHelper, app2url } from '@/lib/classlink.js';
import { CB } from '@/components/utils.js'
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

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


export default function Dashboard({sd}) {
  let [currentlyLoggingIn, setCurrentlyLoggingIn] = useState(false);
  let [enableAppLaunchAnalytics, setEnableAppLaunchAnalytics] = useState(false);
  const backpackData = sd.backpackData;
  const classLinkHandler = () => {
    window.open("/api/login/openClasslink", '_blank');
  } 
  useEffect(()=>{
    const searchParams = new URLSearchParams(window.location.search);
    if(searchParams.get("id") && !currentlyLoggingIn) {
      setCurrentlyLoggingIn(true);
      return;
    }
    if(localStorage.getItem("alaEnabled")) setEnableAppLaunchAnalytics(true);
  })

  return (
    <Classlinkv2Layout title="Dashboard">
      { !currentlyLoggingIn && <div>
        <div className={styles.heading}>Apps</div>
        <p className={styles.note}>
          NOTE: There is a button to open ClassLink if any apps are unsupported below. You cannot open Classlink normally, you will need to use this button. If you get redirected here, regular Classlink did not fully log in, and it should work after another try.
        </p>
        <p>
          You can add <CB>?id=&lt;insert app id here&gt;</CB> to the end of this URL to quickly log into an app. This won't work if you have been logged out however, since you will have to use the jump script to log back in. App IDs can be found between the app name and login button in small letters.
        </p>
        <button onClick={classLinkHandler} className={styles.classlinkButton}>Open ClassLink</button>
      </div> }
      <AppsView data={sd.apps} alaEnabled={enableAppLaunchAnalytics} />
    </Classlinkv2Layout>
  )
}

export async function getServerSideProps({ req, res }) {
  return await uiHelper(req, res, {}, async (req, res, data) => {
    const apps = await fetchWithBearer("https://applications.apis.classlink.com/v1/applicationsPageLoad?", data.cookies.t).then(r=>r.json());
    return {
      apps: apps.apps,
    };
  });
}
