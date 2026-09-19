'use client';

import { useLoginForm } from './hooks/useLoginForm';
import { LoginForm } from './LoginForm';

export const LoginFormContainer: React.FC = () => {
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
    <LoginForm
      userLoginId={userLoginId}
      onUserLoginIdChange={setUserLoginId}
      password={password}
      onPasswordChange={setPassword}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
};
