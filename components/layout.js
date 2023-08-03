import { Roboto_Mono } from 'next/font/google';
import Head from 'next/head';
import ThemeButton from './themes.js';
import styles from './layout.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jumpScriptVersion from './utils.js';

const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "font" });

const siteTitle = "Classlinkv2";

export default function Layout({ title, children }) {
  const t = `${(title ? title + " |" : "")} ${siteTitle}`
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(()=>{
    if(router.asPath === "/") return;
    setTimeout(()=>{
      if(window.jumpScriptInstalled !== jumpScriptVersion && !redirecting) {
        router.replace('/');
        setRedirecting(true);
      }
      }, 1000); 
    // support ios by using the setTimeout
  });

  return (
    <div className={`${styles.container} ${robotoMono.className}`}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{t}</title>
      </Head>
      <ThemeButton></ThemeButton>
      {!redirecting && <div children={children}></div>}
      <hr />
      <div className={styles.footer}>
        Made with Next.js (not love) by <a href="https://r58playz.dev">r58Playz</a>
        <br />
        Report any bugs to the email on <a href="https://r58playz.dev">my site</a>
      </div>
    </div>
  )
}
