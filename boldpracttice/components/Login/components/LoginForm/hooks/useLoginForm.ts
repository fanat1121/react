'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PATH_HOME } from '@/config/const/paths';

type LoginErrors = {
  userLoginId?: string[];
  password?: string[];
  _form?: string[];
};

export const useLoginForm = () => {
  const router = useRouter();
  const [userLoginId, setUserLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: LoginErrors = {};
    if (!userLoginId) newErrors.userLoginId = ['ログインIDを入力してください'];
    if (!password) newErrors.password = ['パスワードを入力してください'];
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    const result = await signIn('credentials', {
      userLoginId,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setErrors({ _form: ['ログインIDまたはパスワードが正しくありません'] });
      return;
    }

    router.push(PATH_HOME);
    router.refresh();
  };

  return {
    userLoginId,
    setUserLoginId,
    password,
    setPassword,
    errors,
    isSubmitting,
    handleSubmit,
  };
};
