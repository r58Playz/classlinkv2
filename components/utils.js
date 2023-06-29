import styles from './utils.module.css';

export function CB({ children }) {
  return <span className={styles.inlineCode} children={children}></span>
}

