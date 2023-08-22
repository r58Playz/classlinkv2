import { CB } from '../utils.js';
import styles from './nerdstats.module.css';

export default function NerdStats({sd}) {
  return (
    <div>
      <div className={styles.medheading}>Stats for nerds</div>
      <p>
        Like the YouTube option.
      </p>
      <p>Your tokens:</p>
      <ul>
        <li>Classlink "login code": <CB>{sd.code}</CB></li>
        <li>Bearer token: <CB>{sd.token}</CB></li>
        <li>GWS token (analytics): <CB>{sd.gws}</CB></li>
      </ul>
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
