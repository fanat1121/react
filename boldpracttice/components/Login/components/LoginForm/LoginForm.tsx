'use client';

import { useLoginForm } from './hooks/useLoginForm';
import { FormInput } from '@/components/UserRegist/components/FormInput';
import { Button } from '@/components/common/ui/Button';
import clsx from 'clsx';
import styles from './LoginForm.module.scss';

const FORM_LABELS = {
  USER_LOGIN_ID: 'ログインID',
  PASSWORD: 'パスワード',
} as const;

const BUTTON_TEXT = {
  SUBMIT: 'ログイン',
  SUBMITTING: 'ログイン中...',
} as const;

export const LoginForm: React.FC = () => {
  const {
    userLoginId,
    setUserLoginId,
    password,
    setPassword,
    errors,
    isSubmitting,
    handleSubmit,
  } = useLoginForm();

  return (
    <>
      <FormInput
        label={FORM_LABELS.USER_LOGIN_ID}
        value={userLoginId}
        onChange={setUserLoginId}
        errorMessages={errors.userLoginId}
      />
      <FormInput
        label={FORM_LABELS.PASSWORD}
        value={password}
        onChange={setPassword}
        inputType="password"
        className="mb-48"
        errorMessages={errors.password}
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
