import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className="copyright">
        &copy; Copyright {new Date().getFullYear()} WorldsWide. Inc
      </p>
    </footer>
  );
}
