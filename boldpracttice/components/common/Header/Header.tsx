'use client';

import styles from "./Header.module.scss";
import { Logo } from "./components/Logo";
import { HeaderMenu, MENU_ITEMS } from "./components/HeaderMenu";

export const HeaderComponent: React.FC = () => {
  // TODO: 実際のユーザー情報取得ロジックを実装
  const userStatus = {
    isLoggedIn: false,
    userName: null as string | null,
  };

  return (
    <header className={styles.headerContainerWrapper}>
      <div className={styles.headerContainer}>
        <div className={styles.headerInner}>
          {/* 左側: ロゴ + ユーザー情報 */}
          <div className={styles.leftSection}>
            <Logo />
            <div className={styles.userStatus}>
              {userStatus.isLoggedIn ? (
                <p className={styles.userInfo}>
                  ようこそ、<span className={styles.userName}>{userStatus.userName}</span>さん
                </p>
              ) : (
                <p className={styles.userInfo}>ゲストユーザー</p>
              )}
            </div>
          </div>

          {/* 右側: ナビゲーションメニュー */}
          <HeaderMenu items={MENU_ITEMS} />
        </div>
      </div>
    </header>
  );
};
