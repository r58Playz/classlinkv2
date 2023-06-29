import Layout from '@/components/layout.js'
import LoginStage1 from '@/components/loginStageOne.js';
import { uiHelper } from '@/lib/classlink.js';

export default function Home() {
  return (
  <Layout>
      <h1>Welcome to Classlinkv2!</h1>
      <p>This is an alternate frontend for ClassLink that only exists to quickly log in to my LMS without the bloat that is the ClassLink frontend. It may be very buggy.</p>
      <p>Currently you need to install a userscript (known as the "jump script") that intercepts the login process. There's no way to log into ClassLink with an alternate frontend without this, at least that I know of.</p>
      <LoginStage1 />
  </Layout>
  )
}
