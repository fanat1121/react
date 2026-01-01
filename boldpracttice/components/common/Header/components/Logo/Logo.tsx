'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Logo.module.scss";
import { LOGO_TEXT } from "../Logo/const/logo";

export const Logo: React.FC = () => {
  // NOTE: UX/SEO観点でTOPではリンクを無効化する
  const pathname = usePathname();
  const isTopPage = pathname === '/';

  const logoContent = (
    <div className={styles.logoBox}>
      <span className={styles.logoText}>{LOGO_TEXT}</span>
    </div>
  );

  if (isTopPage) {
    return <div className={styles.logoLink}>{logoContent}</div>;
  }

  return (
    <Link href="/" className={styles.logoLink}>
      {logoContent}
    </Link>
  );
};
