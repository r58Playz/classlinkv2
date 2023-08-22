import styles from './navbar.module.css';
import MSI from '@/lib/materialsymbols.js';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar({ className }) {
  const { pathname } = useRouter();
  return <div className={`${className} ${styles.container}`}>
    <Link href="/dashboard" className={`${styles.navitem} ${pathname==="/dashboard"?styles.selected:""}`} ><MSI>home</MSI></Link>
    <Link href="/dashboard/backpack" className={`${styles.navitem} ${pathname==="/dashboard/backpack"||pathname.startsWith("/dashboard/class")?styles.selected:""}`}><MSI>backpack</MSI></Link>
    <Link href="/dashboard/anal" className={`${styles.navitem} ${pathname==="/dashboard/anal"?styles.selected:""}`}><MSI>insert_chart</MSI></Link>
    <div className={styles.expand} />
    <Link href="/dashboard/profile" className={styles.navitem} id={pathname==="/dashboard/profile"?"selected":""}><MSI>person</MSI></Link>
    <Link href="/dashboard/settings" className={styles.navitem} id={pathname==="/dashboard/settings"?"selected":""}><MSI>settings</MSI></Link>
  </div>
}
