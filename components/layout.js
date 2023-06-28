import { Roboto_Mono } from 'next/font/google';
import Head from 'next/head';
import ThemeButton from './themes.js';
import styles from './layout.module.css';

const robotoMono = Roboto_Mono({ subsets: ["latin"] });

const siteTitle = "Classlink Frontend";

export default function Layout({ title, children }) {
  const t = `${(title ? title + " |" : "")} ${siteTitle}`
  return (
  <div className={`${styles.container} ${robotoMono.className}`}>
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{t}</title>
    </Head>
    <ThemeButton></ThemeButton>
    <div children={children}></div>
  </div>
  )
}
