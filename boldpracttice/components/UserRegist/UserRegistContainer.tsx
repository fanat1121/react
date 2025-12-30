'use client';

import React, { useState } from 'react';
import { UserRegistInput, type UserRegistInputData } from './input';
import { UserRegistConfirm } from './confirm';
import { UserRegistCompletion } from './completion';

type RegistStep = 'input' | 'confirm' | 'completion';

export const UserRegistContainer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<RegistStep>('input');
  const [formData, setFormData] = useState<UserRegistInputData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleNext = (data: UserRegistInputData) => {
    setFormData(data);
    setCurrentStep('confirm');
  };

  const handleBack = () => {
    setCurrentStep('input');
  };

  const handleSubmit = async () => {
    if (!formData) return;

    setIsSubmitting(true);
    setError('');

    try {
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

      setCurrentStep('completion');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました');
      setIsSubmitting(false);
    }
  };

  if (currentStep === 'input') {
    return <UserRegistInput onNext={handleNext} initialData={formData || undefined} />;
  }

  if (currentStep === 'confirm' && formData) {
    return (
      <UserRegistConfirm
        data={formData}
        onBack={handleBack}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (currentStep === 'completion') {
    return <UserRegistCompletion />;
  }

  return null;
};
