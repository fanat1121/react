'use client';

import styles from "./Header.module.scss";
import { Logo } from "./components/Logo";
import { HeaderMenu, MENU_ITEMS } from "./components/HeaderMenu";
import { Button, BUTTON_VARIANTS, BUTTON_SIZES, BUTTON_ELEMENTS } from "@/components/common/ui/Button";
import { PATH_LOGIN, PATH_REGISTER } from "@/config/const/paths";
import { useSession, signOut } from "next-auth/react";

const BUTTON_TEXT = {
  LOGIN: 'ログイン',
  REGISTER: '新規登録',
  LOGOUT: 'ログアウト',
} as const;

export const HeaderComponent: React.FC = () => {
  const { data: session } = useSession();

  return (
    <header className={styles.headerContainerWrapper}>
      <div className={styles.headerContainer}>
        <div className={styles.headerInner}>
          {/* 左側: ロゴ + ユーザー情報 */}
          <div className={styles.leftSection}>
            <Logo />
            <div className={styles.userStatus}>
              {session ? (
                <p className={styles.userInfo}>
                  ようこそ、<span className={styles.userName}>{session.user.name}</span>さん
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
              {session ? (
                <Button
                  variant={BUTTON_VARIANTS.SECONDARY}
                  size={BUTTON_SIZES.SMALL}
                  onClick={() => signOut({ callbackUrl: PATH_LOGIN })}
                >
                  {BUTTON_TEXT.LOGOUT}
                </Button>
              ) : (
                <>
                  <Button
                    element={BUTTON_ELEMENTS.LINK}
                    href={PATH_LOGIN}
                    variant={BUTTON_VARIANTS.SECONDARY}
                    size={BUTTON_SIZES.SMALL}
                  >
                    {BUTTON_TEXT.LOGIN}
                  </Button>
                  <Button
                    element={BUTTON_ELEMENTS.LINK}
                    href={PATH_REGISTER}
                    variant={BUTTON_VARIANTS.PRIMARY}
                    size={BUTTON_SIZES.SMALL}
                  >
                    {BUTTON_TEXT.REGISTER}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
