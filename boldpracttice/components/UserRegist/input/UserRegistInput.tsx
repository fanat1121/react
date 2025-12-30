'use client';

import React, { useState } from 'react';
import styles from './UserRegistInput.module.scss';
import { Input, INPUT_TYPES } from '@/components/common/ui/Input';
import { Button, BUTTON_VARIANTS, BUTTON_TYPES } from '@/components/common/ui/Button';

export interface UserRegistInputData {
  userName: string;
  userLoginId: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface UserRegistInputProps {
  onNext: (data: UserRegistInputData) => void;
  initialData?: Partial<UserRegistInputData>;
}

export const UserRegistInput: React.FC<UserRegistInputProps> = ({ onNext, initialData }) => {
  const [formData, setFormData] = useState<UserRegistInputData>({
    userName: initialData?.userName || '',
    userLoginId: initialData?.userLoginId || '',
    email: initialData?.email || '',
    password: initialData?.password || '',
    passwordConfirm: initialData?.passwordConfirm || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserRegistInputData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof UserRegistInputData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserRegistInputData, string>> = {};

    if (!formData.userName.trim()) {
      newErrors.userName = 'ユーザー名を入力してください';
    }

    if (!formData.userLoginId.trim()) {
      newErrors.userLoginId = 'ログインIDを入力してください';
    } else if (formData.userLoginId.length < 4) {
      newErrors.userLoginId = 'ログインIDは4文字以上で入力してください';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください';
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = 'パスワード（確認）を入力してください';
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'パスワードが一致しません';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>ユーザー登録</h1>
        <p className={styles.description}>アカウント情報を入力してください</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="ユーザー名"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            error={errors.userName}
            placeholder="山田太郎"
            required
          />

          <Input
            label="ログインID"
            name="userLoginId"
            value={formData.userLoginId}
            onChange={handleChange}
            error={errors.userLoginId}
            placeholder="yamada_taro"
            required
          />

          <Input
            label="メールアドレス"
            name="email"
            inputType={INPUT_TYPES.EMAIL}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@example.com"
            required
          />

          <Input
            label="パスワード"
            name="password"
            inputType={INPUT_TYPES.PASSWORD}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="8文字以上"
            required
          />

          <Input
            label="パスワード（確認）"
            name="passwordConfirm"
            inputType={INPUT_TYPES.PASSWORD}
            value={formData.passwordConfirm}
            onChange={handleChange}
            error={errors.passwordConfirm}
            placeholder="パスワードを再入力"
            required
          />

          <div className={styles.buttonGroup}>
            <Button
              type={BUTTON_TYPES.SUBMIT}
              variant={BUTTON_VARIANTS.PRIMARY}
            >
              確認画面へ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
