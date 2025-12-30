'use client';

import React, { useState } from 'react';
import styles from './UserRegistForm.module.scss';

interface UserRegistFormData {
  userName: string;
  userLoginId: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface UserRegistFormProps {
  onSubmit?: (data: UserRegistFormData) => Promise<void>;
}

export const UserRegistForm: React.FC<UserRegistFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<UserRegistFormData>({
    userName: '',
    userLoginId: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserRegistFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof UserRegistFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserRegistFormData, string>> = {};

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        const response = await fetch('http://localhost:8080/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_name: formData.userName,
            user_login_id: formData.userLoginId,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error?.message || '登録に失敗しました');
        }

        setSubmitSuccess(true);
        setFormData({
          userName: '',
          userLoginId: '',
          email: '',
          password: '',
          passwordConfirm: '',
        });
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '登録に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>新規ユーザー登録</h2>

        {submitSuccess && (
          <div className={styles.successMessage}>
            ユーザー登録が完了しました
          </div>
        )}

        {submitError && (
          <div className={styles.errorMessage}>
            {submitError}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="userName" className={styles.label}>
            ユーザー名 <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className={`${styles.input} ${errors.userName ? styles.inputError : ''}`}
            disabled={isSubmitting}
          />
          {errors.userName && <span className={styles.error}>{errors.userName}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="userLoginId" className={styles.label}>
            ログインID <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="userLoginId"
            name="userLoginId"
            value={formData.userLoginId}
            onChange={handleChange}
            className={`${styles.input} ${errors.userLoginId ? styles.inputError : ''}`}
            disabled={isSubmitting}
          />
          {errors.userLoginId && <span className={styles.error}>{errors.userLoginId}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            メールアドレス <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            disabled={isSubmitting}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            パスワード <span className={styles.required}>*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            disabled={isSubmitting}
          />
          {errors.password && <span className={styles.error}>{errors.password}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="passwordConfirm" className={styles.label}>
            パスワード（確認） <span className={styles.required}>*</span>
          </label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            className={`${styles.input} ${errors.passwordConfirm ? styles.inputError : ''}`}
            disabled={isSubmitting}
          />
          {errors.passwordConfirm && <span className={styles.error}>{errors.passwordConfirm}</span>}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? '登録中...' : '登録する'}
        </button>
      </form>
    </div>
  );
};
