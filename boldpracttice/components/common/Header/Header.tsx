import Link from "next/link";
import styles from "./Header.module.scss";

export const HeaderComponent: React.FC = () => {
  return (
    <div className={styles.headerContainerWrapper}>
      <div className={styles.headerContainer}>
        <div className={styles.headerInner}>
          <h1 className={styles.headerText}>
            <Link className={styles.headerLink} href="/">
              bold 23下半期 テスト用
            </Link>
          </h1>
          <p className={styles.headerDescription}>
            next.jsの各機能をテスト・開発していこうと思います。
          </p>
        </div>
      </div>
    </div>
  );
};
