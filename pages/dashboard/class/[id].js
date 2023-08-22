import Classlinkv2Layout from '@/components/dashboard/layout.js';
import fetchWithBearer, { uiHelper } from '@/lib/classlink.js';
import styles from '@/styles/class.module.css';
import Link from 'next/link';

export default function Class({ id, sd }) {
  return (
    <Classlinkv2Layout title={sd.classData.title}>
      <div className={styles.heading}>{sd.classData.title}</div>
      <p>
        Teachers:
      </p>
      <ul>
        {sd.classData.teacher.length ? sd.classData.teacher.map(teacher=>{
          return <li key={teacher.name}>{teacher.name}</li>
        }) : <li>No Teachers</li>}
      </ul>
      <p>
        Periods:
      </p>
      <ul>
        {sd.classData.periods.map(period=>{
          return <li key={period}>{period}</li>
        })}
      </ul>
      <hr />
      <div className={styles.medheading}>Apps</div>
      <div className={styles.appView}>
        {sd.classData.orApplications.map(app=>{
          return (
            <Link href={`/dashboard?id=${app.LPApplicationId}`} className={styles.app}>
              <span>{app.ApplicationName}</span>
              <div className={styles.expand}></div>
              <span className={styles.id}>{app.LPApplicationId}</span>
            </Link>
          )
        })}
      </div>
    </Classlinkv2Layout>
  )
}

export async function getServerSideProps({ params, req, res }) {
  return await uiHelper(req, res, {}, async (req, res, data) => {
    const id = params.id;
    const classData = await fetchWithBearer("https://myclasses.apis.classlink.com/v1/classes/"+id, data.cookies.t);
    if(classData.status!==200) return {redirect: {permanent: false, destination: "/dashboard/backpack"}}
    const classDataJson = await classData.json();
    return {
      classData: classDataJson,
    };
  })
}
