'use client';

import styles from "./Header.module.scss";
import { Logo } from "./components/Logo";
import { HeaderMenu, MENU_ITEMS } from "./components/HeaderMenu";
import { Button, BUTTON_VARIANTS, BUTTON_SIZES, BUTTON_ELEMENTS } from "@/components/common/ui/Button";
import { PATH_LOGIN, PATH_REGISTER } from "@/config/const/paths";

export const HeaderComponent: React.FC = () => {
  // TODO: 実際のユーザー情報取得ロジックを実装
  const userStatus = {
    isLoggedIn: false,
    userName: null as string | null,
  };

  const LOGIN_BUTTON_TEXT = 'ログイン';
  const REGISTER_BUTTON_TEXT = '新規登録';

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

          {/* 右側: ナビゲーションメニュー + ボタン */}
          <div className={styles.rightSection}>
            <HeaderMenu items={MENU_ITEMS} />
            <div className={styles.authButtons}>
              <Button
                element={BUTTON_ELEMENTS.LINK}
                href={PATH_LOGIN}
                variant={BUTTON_VARIANTS.SECONDARY}
                size={BUTTON_SIZES.SMALL}
              >
                {LOGIN_BUTTON_TEXT}
              </Button>
              <Button
                element={BUTTON_ELEMENTS.LINK}
                href={PATH_REGISTER}
                variant={BUTTON_VARIANTS.PRIMARY}
                size={BUTTON_SIZES.SMALL}
              >
                {REGISTER_BUTTON_TEXT}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
