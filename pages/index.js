import Layout from '@/components/layout.js'
import LoginStage1 from '@/components/loginStageOne.js';

export default function Home() {
  return (
  <Layout>
      <h1>Welcome to Classlinkv2!</h1>
      <p>This is an alternate frontend for Classlink that was created so that I could quickly log in to my LMS without the bloat that is the Classlink frontend.</p>
      <p>
        Classlinkv2 is designed to make logins with Classlink easier. It is not filled with bloat like the "seasonal events" or fancy backgrounds; Classlinkv2 only includes the bare minimum needed to log into an app.
      </p>
      <p>
        Classlinkv2 also includes a "fast login" feature, which allows you to log into a specific app ID with a direct URL, as well as analytics spoofing which allows you to inflate analytics to the point that they are completely useless.
      </p>
      <LoginStage1 />
  </Layout>
  )
}
