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
  useEffect(()=>{
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if(searchParams.get("id") && !instantLoginData) {
        const targetId = parseInt(searchParams.get("id"));
        const app = data.filter(({id}) => id === targetId);
        if(app.length) {
          const a = app[0];
          if(a.url && a.url[0]) {
            window.location = a.url[0];
          } else {
            window.location = "https://launchpad.classlink.com/ltisso/"+targetId;
          }
          setInstantLoginData(a.name);
        }
      }
    }catch(err){};
  });
  if(instantLoginData) {
    return (
      <div className={styles.instantLoginView}>
        <div className={styles.instantLoginHeader}>Logging into {instantLoginData}...</div>
      </div>
    )
  }
  return (
    <div className={styles.appsView}>
      { data.map(({ name, icon, url, id }) => {
        return (
          <div className={styles.app} key={name}>
            <img width="48" height="48" src={icon} alt={name} className={styles.appIcon} />
            <div className={styles.appName}>{name}</div>
            <div className={styles.appId}>{id}</div>
            {url && url[0] ? (
              <button onClick={()=>{urlHandler(url[0])}} className={styles.appLogIn}>Log In</button>
            ) : (
              <button onClick={()=>{ltissoHandler(id)}} className={styles.appLogIn}>Log In (LTI)</button>
            )}
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
    window.open("https://myapps.classlink.com", '_blank');
  } 
  const resetRedirect = () => {
    localStorage.removeItem("redirectUri");
    setResetText("Reset!");
  }
  useEffect(()=>{
    const searchParams = new URLSearchParams(window.location.search);
    if(searchParams.get("id") && !currentlyLoggingIn) {
      setCurrentlyLoggingIn(true);
      return;
    }
    if(resetText === "Reset!") {
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
        <p>
          You can remove the redirect when you are not logged in and the jump script is active here.
        </p>
        <button onClick={resetRedirect} className={styles.classlinkButton}>{resetText}</button>
        <hr />
        <div className={styles.medheading}>Apps</div>
        <p className={styles.note}>
          NOTE: Some apps may not launch, there's no documentation for the APIs I'm using so I have no idea if I am doing things properly. There is a button to open ClassLink if any apps don't work below.
        </p>
        <p>
          You can add <CB>?id=&lt;insert app id here&gt;</CB> to the end of this URL to quickly log into an app. This won't work if you have been logged out however, since you will have to use the jump script to log back in. App IDs can be found between the app name and login button in small letters.
        </p>
        <button onClick={classLinkHandler} className={styles.classlinkButton}>Open ClassLink</button>
      </div> }
      <AppsView data={sd.apps} />
    </Layout>
  )
}

export async function getServerSideProps({ req, res }) {
  return await uiHelper(req, res, {}, async (req, res, data) => {
    const userData = await fetchWithBearer("https://nodeapi.classlink.com/v2/my/info", data.cookies.t).then(r=>r.json());
    const apps = await fetchWithBearer("https://applications.apis.classlink.com/v1/applicationsPageLoad?", data.cookies.t).then(r=>r.json());
    return { name: `${userData.FirstName} ${userData.LastName}`, userName: userData.DisplayName, districtName: userData.Tenant, email: userData.Email, apps: apps.apps }
  });
}
