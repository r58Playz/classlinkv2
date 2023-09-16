import fetchWithBearer, { uiHelper } from '@/lib/classlink.js';
import Classlinkv2Layout from '@/components/dashboard/layout.js';
import styles from '@/styles/anal.module.css';
import Link from 'next/link';

export default function Anal({sd}) {
  return (
    <Classlinkv2Layout title="Analytics">
      <div className={styles.heading}>Analytics</div>
      <p className={styles.note}>
        Note: The IP associated to the analytics is going to be that of a data center, since Classlinkv2 proxies analytics data.
      </p>
      <hr />
      <div className={styles.medheading}>Records</div>
      <ul>
        <li>Record daily logins: {sd.recordLogins.daily.Logins.toLocaleString()} on {sd.recordLogins.daily.Date}</li>
        <li>Record weekly logins: {sd.recordLogins.weeks.Logins.toLocaleString()} from {sd.recordLogins.weeks.startDate} to {sd.recordLogins.weeks.endDate}</li>
        <li>Record monthly logins: {sd.recordLogins.month.Logins.toLocaleString()} on {sd.recordLogins.month.Date}</li>
        <li>Record yearly logins: {sd.recordLogins.yearly.Logins.toLocaleString()} from {sd.recordLogins.yearly.startDate} to {sd.recordLogins.yearly.endDate}</li>
        <li>Record apps:</li>
        <ul>
          {sd.recordApps.map(app=>{
            return <li key={app.AppId}>{app.AppName} ({app.AppId}): {app.Count.toLocaleString()} {app.Count===1 ? 'login' : 'logins'} and {app.activeS.toLocaleString()} active seconds</li>
          })}
        </ul>
      </ul>
      <hr />
      <div className={styles.medheading}>Last 10 Logins</div>
      <div className={styles.lastLoginsView}>
        {sd.lastLogins.map(login=>{
          return (
            <div key={login.Id} className={styles.lastLogin}>
              <span>{login.Browser==="MobileApp"?"Mobile app":login.Browser}{login.OS?` on ${login.OS}`:""}</span>
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
              <li key={data.Date}>{data.Date}: {data.Logins.toLocaleString()}</li>
            )
          })}
        </ul>
        <li>Weekly logins:</li>
        <ul>
          {sd.weeklyLogins.map((data)=>{
            return (
              <li key={data.Date}>{data.Date}: {data.Logins.toLocaleString()}</li>
            )
          })}
        </ul>
        <li>Monthly logins:</li>
        <ul>
          {sd.monthlyLogins.map((data)=>{
            return (
              <li key={data.Date}>{data.Date}: {data.Logins.toLocaleString()}</li>
            )
          })}
        </ul>
      </ul>
    </Classlinkv2Layout>
  )
}

export async function getServerSideProps({ req, res }) {
  return await uiHelper(req, res, {}, async (req, res, data) => {
    const jf = async (url)=>{return await fetchWithBearer(url, data.cookies.t).then(r=>r.json())}
    const userData = data.userData;
    const [lastLogins, dailyLogins, weeklyLogins, monthlyLogins, recordLogins, lastApps, recordApps] = await Promise.all([
      jf("https://analytics-data.classlink.io/my/v1p0/logins?limit=10"), 
      jf("https://analytics-data.classlink.io/my/v1p0/logins/daily"),
      jf("https://analytics-data.classlink.io/my/v1p0/logins/weekly"),
      jf("https://analytics-data.classlink.io/my/v1p0/logins/monthly"),
      jf("https://analytics-data.classlink.io/my/v1p0/logins/records"),
      jf("https://analytics-data.classlink.io/my/v1p0/apps?limit=10"), 
      jf("https://analytics-data.classlink.io/my/v1p0/apps/top?order=Count&sort=DESC&limit=5&startDate=0001-01-01")
    ]);
    return {
      lastLogins, dailyLogins, weeklyLogins, monthlyLogins, recordLogins,
      lastApps, recordApps
    };
  });
} 
