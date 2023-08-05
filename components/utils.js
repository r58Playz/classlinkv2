import styles from './utils.module.css';

export function CB({ children }) {
  return <span className={styles.inlineCode} children={children}></span>
}

const jumpScriptVersion = "nya~1.6";
export default jumpScriptVersion;
