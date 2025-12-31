'use client';

import { useState } from 'react';

export const useUserRegistForm = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSubmit = async () => {
    console.log('User registration:', { userName, email, password, passwordConfirm });
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
    handleSubmit,
  };
};
