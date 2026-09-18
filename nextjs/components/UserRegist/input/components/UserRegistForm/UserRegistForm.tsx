'use client';

import { useUserRegistForm } from './hooks/useUserRegistForm';
import { FormInput } from '@/components/UserRegist/components/FormInput';
import { Button } from '@/components/common/ui/Button';
import clsx from 'clsx';
import styles from './UserRegistForm.module.scss';

const FORM_LABELS = {
  USER_NAME: 'ユーザー名',
  EMAIL: 'メールアドレス',
  PASSWORD: 'パスワード',
  PASSWORD_CONFIRM: 'パスワード確認',
} as const;

const BUTTON_TEXT = {
  SUBMIT: 'ユーザー登録する',
  SUBMITTING: '登録中...',
} as const;

const INPUT_TYPES = {
  EMAIL: 'email',
  PASSWORD: 'password',
} as const;

export const UserRegistForm: React.FC = () => {
  const {
    userName,
    setUserName,
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    errors,
    isSubmitting,
    handleSubmit,
  } = useUserRegistForm();

  return (
    <>
      <FormInput
        label={FORM_LABELS.USER_NAME}
        value={userName}
        onChange={setUserName}
        errorMessages={errors.userName}
      />
      <FormInput
        label={FORM_LABELS.EMAIL}
        value={email}
        onChange={setEmail}
        inputType={INPUT_TYPES.EMAIL}
        errorMessages={errors.email}
      />
      <FormInput
        label={FORM_LABELS.PASSWORD}
        value={password}
        onChange={setPassword}
        inputType={INPUT_TYPES.PASSWORD}
        errorMessages={errors.password}
      />
      <FormInput
        label={FORM_LABELS.PASSWORD_CONFIRM}
        value={passwordConfirm}
        onChange={setPasswordConfirm}
        inputType={INPUT_TYPES.PASSWORD}
        className="mb-48"
        errorMessages={errors.passwordConfirm}
      />
      {errors._form && (
        <p className={clsx(styles.formError)}>{errors._form[0]}</p>
      )}
      <div className={clsx(styles.submitButton)}>
        <Button variant="primary" size="large" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? BUTTON_TEXT.SUBMITTING : BUTTON_TEXT.SUBMIT}
        </Button>
      </div>
    </>
  );
};