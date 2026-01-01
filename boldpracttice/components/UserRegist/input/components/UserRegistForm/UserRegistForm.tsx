'use client';

import { useUserRegistForm } from './hooks/useUserRegistForm';
import { FormInput } from '@/components/UserRegist/components/FormInput';
import { Button } from '@/components/common/ui/Button';

export const UserRegistForm: React.FC = () => {
  const REGIST_BUTTON_TEXT = 'ユーザー登録する';
  const USER_NAME_LABEL = 'ユーザー名';
  const EMAIL_LABEL = 'メールアドレス';
  const PASSWORD_LABEL = 'パスワード';
  const PASSWORD_CONFIRM_LABEL = 'パスワード確認';

  const {
    userName,
    setUserName,
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    handleSubmit,
  } = useUserRegistForm();

  return (
    <>
      <FormInput
        label={USER_NAME_LABEL}
        value={userName}
        onChange={setUserName}
      />
      <FormInput
        label={EMAIL_LABEL}
        value={email}
        onChange={setEmail}
        inputType="email"
      />
      <FormInput
        label={PASSWORD_LABEL}
        value={password}
        onChange={setPassword}
        inputType="password"
      />
      <FormInput
        label={PASSWORD_CONFIRM_LABEL}
        value={passwordConfirm}
        onChange={setPasswordConfirm}
        inputType="password"
        className="mb-48"
      />
      <div className="mb-32">
        <Button variant="primary" size="large" onClick={handleSubmit}>
          {REGIST_BUTTON_TEXT}
        </Button>
      </div>
    </>
  );
};