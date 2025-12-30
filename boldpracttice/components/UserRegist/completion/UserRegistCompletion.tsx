'use client';

import React from 'react';
import styles from './UserRegistCompletion.module.scss';
import { Button, BUTTON_VARIANTS, BUTTON_ELEMENTS } from '@/components/common/ui/Button';
import { PATH_LOGIN, PATH_HOME } from '@/config/const/paths';

export const UserRegistCompletion: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.iconWrapper}>
          <svg
            className={styles.checkIcon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" fill="#27ae60" />
            <path
              d="M8 12L11 15L16 9"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className={styles.title}>登録完了</h1>
        <p className={styles.description}>
          ユーザー登録が完了しました。
          <br />
          ログインしてサービスをご利用ください。
        </p>

        <div className={styles.buttonGroup}>
          <Button
            element={BUTTON_ELEMENTS.LINK}
            href={PATH_LOGIN}
            variant={BUTTON_VARIANTS.PRIMARY}
          >
            ログイン画面へ
          </Button>
          <Button
            element={BUTTON_ELEMENTS.LINK}
            href={PATH_HOME}
            variant={BUTTON_VARIANTS.SECONDARY}
          >
            トップページへ
          </Button>
        </div>
      </div>
    </div>
  );
};
