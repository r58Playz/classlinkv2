import Classlinkv2Layout from '@/components/dashboard/layout.js';
import styles from '@/styles/profile.module.css';
import { uiHelper } from '@/lib/classlink.js';
import Settings from '@/components/dashboard/settings.js';
import ThemeButton from '@/components/themes.js';

export default function SettingsPage({sd}) {
  return (
    <Classlinkv2Layout title="Settings">
      <div className={styles.heading}>Settings</div>
      <Settings />
      <ThemeButton />
    </Classlinkv2Layout>
  )
}

export async function getServerSideProps({ req, res }) {
  return await uiHelper(req, res, {}, async (req, res, data) => {
    return {};
  });
}
