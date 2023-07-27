import fetchWithBearer, { uiHelper } from '@/lib/classlink.js';
import Layout from '@/components/layout.js';
import styles from '@/styles/anal.module.css';
import Link from 'next/link';

export default function Anal({sd}) {
  return (
    <Layout title="Analytics">
      <div className={styles.heading}>Classlinkv2 Analytics</div>
      <div className={styles.subheading}>Hello {sd.name} ({sd.districtName})</div>
      <div>{sd.userName}: {sd.email}</div>
      <div className={styles.margin}></div>
      <Link href="/dashboard" className={styles.classlinkLink}>Return to Classlinkv2</Link>
      <p className={styles.note}>
        Note: The IP associated to the analytics is going to be that of a data center, since Classlinkv2 proxies analytics data.
      </p>
      <hr />
      <div className={styles.medheading}>Records</div>
      <ul>
        <li>Record daily logins: {sd.recordLogins.daily.Logins} on {sd.recordLogins.daily.Date}</li>
        <li>Record weekly logins: {sd.recordLogins.weeks.Logins} from {sd.recordLogins.weeks.startDate} to {sd.recordLogins.weeks.endDate}</li>
        <li>Record monthly logins: {sd.recordLogins.month.Logins} on {sd.recordLogins.month.Date}</li>
        <li>Record yearly logins: {sd.recordLogins.yearly.Logins} from {sd.recordLogins.yearly.startDate} to {sd.recordLogins.yearly.endDate}</li>
        <li>Record apps:</li>
        <ul>
          {sd.recordApps.map(app=>{
            return <li key={app.AppId}>{app.AppName} ({app.AppId}): {app.Count} {app.Count===1 ? 'login' : 'logins'} and {app.activeS} active seconds</li>
          })}
        </ul>
      </ul>
      <hr />
      <div className={styles.medheading}>Last 10 Logins</div>
      <div className={styles.lastLoginsView}>
        {sd.lastLogins.map(login=>{
          return (
            <div key={login.Id} className={styles.lastLogin}>
              <span>{login.Browser} on {login.OS}</span>
              <div className={styles.expand}></div>
              <span>{login.Date}</span>
            </div>
          )
        })}
      </div>
      <hr />
      <div className={styles.medheading}>Last 10 App Logins</div>
      <div className={styles.lastLoginsView}>
        {sd.lastApps.map(app=>{
          return (
            <div key={app.Date} className={styles.lastLogin}>
              <span>{app.AppName} ({app.AppId})</span>
              <div class={styles.expand}></div>
              <span>{app.Date}</span>
            </div>
          )
        })}
      </div>
      <div className={styles.medheading}>Other data</div>
      <ul>
        <li>Daily logins:</li>
        <ul>
          {sd.dailyLogins.map((data)=>{
            return (
              <li key={data.Date}>{data.Date}: {data.Logins}</li>
            )
          })}
        </ul>
        <li>Weekly logins:</li>
        <ul>
          {sd.weeklyLogins.map((data)=>{
            return (
              <li key={data.Date}>{data.Date}: {data.Logins}</li>
            )
          })}
        </ul>
        <li>Monthly logins:</li>
        <ul>
          {sd.monthlyLogins.map((data)=>{
            return (
              <li key={data.Date}>{data.Date}: {data.Logins}</li>
            )
          })}
        </ul>
      </ul>
    </Layout>
  )
}

export async function getServerSideProps({ req, res }) {
  return await uiHelper(req, res, {}, async (req, res, data) => {
    const jf = async (url)=>{return await fetchWithBearer(url, data.cookies.t).then(r=>r.json())}
    const userData = data.userData;
    const lastLogins = await jf("https://analytics-data.classlink.io/my/v1p0/logins?limit=10"); 
    const dailyLogins = await jf("https://analytics-data.classlink.io/my/v1p0/logins/daily");
    const weeklyLogins = await jf("https://analytics-data.classlink.io/my/v1p0/logins/weekly");
    const monthlyLogins = await jf("https://analytics-data.classlink.io/my/v1p0/logins/monthly");
    const recordLogins = await jf("https://analytics-data.classlink.io/my/v1p0/logins/records");
    const lastApps = await jf("https://analytics-data.classlink.io/my/v1p0/apps?limit=10"); 
    const recordApps = await jf("https://analytics-data.classlink.io/my/v1p0/apps/top?order=Count&sort=DESC&limit=5")
    return {
      name: `${userData.FirstName} ${userData.LastName}`,
      userName: userData.DisplayName,
      districtName: userData.Tenant,
      email: userData.Email,
      lastLogins, dailyLogins, weeklyLogins, monthlyLogins, recordLogins,
      lastApps, recordApps
    };
  });
} 
