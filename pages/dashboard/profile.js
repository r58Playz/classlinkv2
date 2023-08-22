import Classlinkv2Layout from '@/components/dashboard/layout.js';
import NerdStats from '@/components/dashboard/nerdstats.js';
import styles from '@/styles/profile.module.css';
import fetchWithBearer, { uiHelper } from '@/lib/classlink.js';
import { CB } from '@/components/utils.js'

export default function Profile({sd}) {
  const userData = sd.fullData;
  return (
    <Classlinkv2Layout title="Profile">
      <div className={styles.heading}>Profile</div>
      <p>Name: {userData.FirstName} {userData.LastName}</p>
      <p>Display Name: {userData.DisplayName}</p>
      <p>Email: {userData.Email}</p>
      <p>Login ID: {userData.LoginId}</p>
      <p>Language: {userData.Language}</p>
      <p>Profile: {userData.Profile} ({userData.ProfileId})</p>
      <p>Tenant: {userData.Tenant}</p>
      <p>Building: {userData.Building}</p>
      <p>Role: {userData.Role} (level: {userData.Role_Level})</p>
      <hr />
      <NerdStats sd={sd} />
    </Classlinkv2Layout>
  )
}

export async function getServerSideProps({ req, res }) {
  return await uiHelper(req, res, {}, async (req, res, data) => {
    const apps = await fetchWithBearer("https://applications.apis.classlink.com/v1/applicationsPageLoad?", data.cookies.t).then(r=>r.json());
    return {
      fullData: data.userData,
      code: data.cookies.c,
      token: data.cookies.t,
      gws: data.cookies.g,
      apps: apps.apps
    };
  });
}
