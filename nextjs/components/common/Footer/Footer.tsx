import styles from "./Footer.module.scss";

export const FooterComponent: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; 2025 Bold Practice</p>
    </footer>
  );
};
