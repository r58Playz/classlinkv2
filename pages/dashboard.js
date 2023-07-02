import Layout from '@/components/layout.js';
import styles from '@/styles/dashboard.module.css';
import fetchWithBearer, { uiHelper } from '@/lib/classlink.js';
import { CB } from '@/components/utils.js'
import { useEffect, useState } from 'react';

function AppsView({ data }) {
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
  const appHandler = (url, id, type) => {
    switch(type) {
      case 15:
        return <button onClick={()=>{browserssoHandler(id)}} className={styles.appLogIn}>Log In</button>
      case 16:
        return <button onClick={()=>{ltissoHandler(id)}} className={styles.appLogIn}>Log In</button>
      case 30:
      case 31:
        return <button onClick={()=>{urlHandler(url[0])}} className={styles.appLogIn}>Log In</button>
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
              window.location = "https://launchpad.classlink.com/browsersso/"+a.id;
              break;
            case 16:
              window.location = "https://launchpad.classlink.com/ltisso/"+a.id;
            case 30:
            case 31:
              window.location = a.url[0];
            default:
              setInstantLoginData("__CLASSLINKV2_UNSUPPORTED_APP__");
              return;
          }
          setInstantLoginData(a.name);
        }
      }
    }catch(err){};
  });

  if(instantLoginData && instantLoginData !== "__CLASSLINKV2_UNSUPPORTED_APP__") {
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
  }

  return (
    <div className={styles.appsView}>
      { data.map(({ name, icon, url, id, type }) => {
        return (
          <div className={styles.app} key={name}>
            <img width="48" height="48" src={icon} alt={name} className={styles.appIcon} />
            <div className={styles.appName}>{name}</div>
            <div className={styles.appId}>{id}</div>
            {appHandler(url, id, type)}
          </div>
        )
      }) }
    </div>
  )
}

export default function Dashboard({sd}) {
  let [resetText, setResetText] = useState("Remove redirect");
  let [currentlyLoggingIn, setCurrentlyLoggingIn] = useState(false);
  const classLinkHandler = () => {
    window.open("/api/login/openClasslink", '_blank');
  } 
  const resetRedirect = () => {
    localStorage.removeItem("redirectUri");
    setResetText("Removed!");
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
        <button onClick={classLinkHandler} className={styles.classlinkButton}>Open ClassLink</button>
      </div> }
      <AppsView data={sd.apps} />
      {!currentlyLoggingIn && <div>
        <hr />
        <div className={styles.medheading}>Settings</div>
        <p>
          Remove the redirect when you are not logged in and the jump script is active:
        </p>
        <button onClick={resetRedirect} className={styles.classlinkButton}>{resetText}</button>
        <hr />
        <div className={styles.medheading}>Stats for nerds</div>
        <p>
          Like the YouTube option.
        </p>
        <p>Your user data:</p>
        <ul>
        {Object.entries(sd.fullData).map(([key, value])=>{
          return <li><CB>{key}</CB>: <CB>{JSON.stringify(value)}</CB></li>
        })}
        </ul>
        <p>Your app data:</p>
        <ul>
          {sd.apps.map((app, id)=>{
            return <div>
              <li>{id}</li>
              <ul>{Object.entries(app).map(([key, value])=>{
                return <li><CB>{key}</CB>: <CB>{JSON.stringify(value)}</CB></li>
              })}</ul>
            </div>
          })}
        </ul>
      </div>}
    </Layout>
  )
}

export async function getServerSideProps({ req, res }) {
  return await uiHelper(req, res, {}, async (req, res, data) => {
    const userData = await fetchWithBearer("https://nodeapi.classlink.com/v2/my/info", data.cookies.t).then(r=>r.json());
    const apps = await fetchWithBearer("https://applications.apis.classlink.com/v1/applicationsPageLoad?", data.cookies.t).then(r=>r.json());
    return { name: `${userData.FirstName} ${userData.LastName}`, userName: userData.DisplayName, districtName: userData.Tenant, email: userData.Email, apps: apps.apps, fullData: userData }
  });
}
