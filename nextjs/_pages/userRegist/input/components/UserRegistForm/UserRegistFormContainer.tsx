'use client';

import { useUserRegistForm } from './hooks/useUserRegistForm';
import { UserRegistForm } from './UserRegistForm';

export const UserRegistFormContainer: React.FC = () => {
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
    <UserRegistForm
      userName={userName}
      onUserNameChange={setUserName}
      email={email}
      onEmailChange={setEmail}
      password={password}
      onPasswordChange={setPassword}
      passwordConfirm={passwordConfirm}
      onPasswordConfirmChange={setPasswordConfirm}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
};
