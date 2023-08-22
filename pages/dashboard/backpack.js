import fetchWithBearer, { uiHelper, fetchWithGws } from '@/lib/classlink.js';
import Classlinkv2Layout from '@/components/dashboard/layout.js';
import styles from '@/styles/backpack.module.css';
import Link from 'next/link';

export default function Backpack({sd}) {
  return (
    <Classlinkv2Layout title="Backpack">
      <div>
        <div className={styles.heading}>Backpack</div>
        {sd.backpackData.enableStudentbackpack!=="1"?<p className={styles.note}>WARNING: Backpack has been disabled by admin. You are not supposed to see this info, but the APIs are still accessible.</p>:""}
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
              <Link href={`/dashboard/class/${classData.sourcedId}`} key={classData.sourcedId} className={styles.classItem}>
                <span>{classData.title}</span>
                <div className={styles.expand}></div>
                <span>{classData.teachers.length ? classData.teachers.map(d=>d.familyName).join(', ') : "No Teachers"}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </Classlinkv2Layout>
  )
}

export async function getServerSideProps({ req, res }) {
  return await uiHelper(req, res, {}, async (req, res, data) => {
    const backpackData = await fetchWithBearer("https://nodeapi.classlink.com/tenant/customization/backpack", data.cookies.t).then(r=>r.json());
    const schoolyearData = await fetchWithGws("https://analytics-data.classlink.io/teacherConsole/v1p0/schoolyear", data.cookies.g).then(r=>r.json());
    const classesData = await fetchWithBearer("https://myclasses.apis.classlink.com/v1/classes", data.cookies.t).then(r=>r.json());
    return { backpackData, schoolyearData, classesData }
  });
} 
