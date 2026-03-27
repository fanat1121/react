'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '../actions/register';
import { PATH_REGISTER } from '@/config/const/paths';

export const useUserRegistForm = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<{
    userName?: string[];
    email?: string[];
    password?: string[];
    passwordConfirm?: string[];
    _form?: string[];
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});

    const result = await registerUser({
      userName,
      email,
      password,
      passwordConfirm,
    });

    if (!result.success && result.errors) {
      setErrors(result.errors);
      setIsSubmitting(false);
      return;
    }

    router.push(`${PATH_REGISTER}/completion`);
  };

  return {
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
  };
};
