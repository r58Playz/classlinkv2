import '@/styles/catppuccin.css';
import '@/styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { themeList } from '@/components/themes.js';

export default function App({ Component, pageProps }) {
  return (
  <ThemeProvider enableSystem={false} defaultTheme="latte" themes={themeList}>
    <Component {...pageProps} />
  </ThemeProvider>
  )
}
