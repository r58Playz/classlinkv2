import styles from './navbar.module.css';
import MSI from '@/lib/materialsymbols.js';
import Link from 'next/link';

export default function Navbar({ className }) {
  return <div className={`${className} ${styles.container}`}>
    <Link href="/dashboard" className={styles.navitem}><MSI>home</MSI></Link>
    <Link href="/dashboard" className={styles.navitem}><MSI>backpack</MSI></Link>
    <Link href="/dashboard" className={styles.navitem}><MSI>insert_chart</MSI></Link>
    <div className={styles.expand} />
    <Link href="/dashboard" className={styles.navitem}><MSI>person</MSI></Link>
    <Link href="/dashboard" className={styles.navitem}><MSI>settings</MSI></Link>
  </div>
}
