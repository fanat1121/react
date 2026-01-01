'use client';

import { useState } from 'react';
import { saveFormData } from '../actions/saveFormData';

export const useUserRegistForm = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<{
    userName?: string[];
    email?: string[];
    password?: string[];
    passwordConfirm?: string[];
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});

    const result = await saveFormData({
      userName,
      email,
      password,
      passwordConfirm,
    });

    if (!result.success && result.errors) {
      setErrors(result.errors);
      setIsSubmitting(false);
    }
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
