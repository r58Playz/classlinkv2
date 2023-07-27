import fetchWithBearer, { uiHelper, fetchWithGws } from '@/lib/classlink.js';
import Layout from '@/components/layout.js';
import styles from '@/styles/backpack.module.css';
import Link from 'next/link';

export default function Backpack({sd}) {
  return (
    <Layout title="Backpack">
      {sd.backpackData.enableStudentbackpack!=='1' ? <div><div className={styles.note}>Backpack has been disabled by admin.</div><div className={styles.margin}></div><Link href="/dashboard" className={styles.classlinkLink}>Return to Classlinkv2</Link></div> : <div>
        <div className={styles.heading}>Classlinkv2 Backpack</div>
        <div className={styles.subheading}>Hello {sd.name} ({sd.districtName})</div>
        <div>{sd.userName}: {sd.email}</div>
        <div className={styles.margin}></div>
        <Link href="/dashboard" className={styles.classlinkLink}>Return to Classlinkv2</Link>
        <hr />
        <div className={styles.medheading}>School Year Info</div>
        <p>
          School year: {sd.schoolyearData.Year} ({sd.schoolyearData.startDate} - {sd.schoolyearData.endDate})
        </p>
        <p>
          From {String(sd.schoolyearData.startHour).padStart(2,'0')}:00 to {String(sd.schoolyearData.endHour).padStart(2,'0')}:00, weekends are {
            sd.schoolyearData.weekend.split(',').map(n=>{
              return (["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"])[parseInt(n)]
            }).join(', ')
          }
        </p>
        <hr />
        <div className={styles.medheading}>Classes</div>
        <p>Click on a class to view more info about it.</p>
        <div className={styles.classView}>
          {sd.classesData.map((classData)=>{
            return (
              <Link href={`/class/${classData.sourcedId}`} key={classData.sourcedId} className={styles.classItem}>
                <span>{classData.title}</span>
                <div className={styles.expand}></div>
                <span>{classData.teachers.length ? classData.teachers.map(d=>d.familyName).join(', ') : "No Teachers"}</span>
              </Link>
            )
          })}
        </div>
      </div>}
    </Layout>
  )
}

export async function getServerSideProps({ req, res }) {
  return await uiHelper(req, res, {}, async (req, res, data) => {
    const userData = data.userData;
    const backpackData = await fetchWithBearer("https://nodeapi.classlink.com/tenant/customization/backpack", data.cookies.t).then(r=>r.json());
    const schoolyearData = await fetchWithGws("https://analytics-data.classlink.io/teacherConsole/v1p0/schoolyear", data.cookies.g).then(r=>r.json());
    const classesData = await fetchWithBearer("https://myclasses.apis.classlink.com/v1/classes", data.cookies.t).then(r=>r.json());
    return { name: `${userData.FirstName} ${userData.LastName}`, userName: userData.DisplayName, districtName: userData.Tenant, email: userData.Email, backpackData, schoolyearData, classesData }
  });
} 
