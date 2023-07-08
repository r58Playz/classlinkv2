import 'nprogress/nprogress.css';
import '@/styles/catppuccin.css';
import '@/styles/theming.css';
import '@/styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { themeList } from '@/components/themes.js';
import NProgress from 'nprogress';
import Router from 'next/router';

NProgress.configure({
    minimum: 0.3,
    easing: "ease",
    speed: 800,
    showSpinner: false,
});

Router.events.on('routeChangeStart', () => {NProgress.start()})
Router.events.on('routeChangeComplete', () => {NProgress.done()})
Router.events.on('routeChangeError', () => {NProgress.done()})

export default function App({ Component, pageProps }) {
  return (
  <ThemeProvider enableSystem={false} defaultTheme="latte" themes={themeList}>
    <Component {...pageProps} />
  </ThemeProvider>
  )
}
