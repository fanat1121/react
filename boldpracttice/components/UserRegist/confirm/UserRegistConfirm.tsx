'use client';

import React from 'react';
import styles from './UserRegistConfirm.module.scss';
import { Button, BUTTON_VARIANTS, BUTTON_TYPES } from '@/components/common/ui/Button';
import type { UserRegistInputData } from '../input';

interface UserRegistConfirmProps {
  data: UserRegistInputData;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export const UserRegistConfirm: React.FC<UserRegistConfirmProps> = ({
  data,
  onBack,
  onSubmit,
  isSubmitting = false,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>入力内容の確認</h1>
        <p className={styles.description}>以下の内容で登録します。よろしいですか？</p>

        <div className={styles.confirmList}>
          <div className={styles.confirmItem}>
            <dt className={styles.label}>ユーザー名</dt>
            <dd className={styles.value}>{data.userName}</dd>
          </div>

          <div className={styles.confirmItem}>
            <dt className={styles.label}>ログインID</dt>
            <dd className={styles.value}>{data.userLoginId}</dd>
          </div>

          <div className={styles.confirmItem}>
            <dt className={styles.label}>メールアドレス</dt>
            <dd className={styles.value}>{data.email}</dd>
          </div>

          <div className={styles.confirmItem}>
            <dt className={styles.label}>パスワード</dt>
            <dd className={styles.value}>{'●'.repeat(data.password.length)}</dd>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <Button
            type={BUTTON_TYPES.BUTTON}
            variant={BUTTON_VARIANTS.SECONDARY}
            onClick={onBack}
            disabled={isSubmitting}
          >
            戻る
          </Button>
          <Button
            type={BUTTON_TYPES.BUTTON}
            variant={BUTTON_VARIANTS.PRIMARY}
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '登録中...' : '登録する'}
          </Button>
        </div>
      </div>
    </div>
  );
};
