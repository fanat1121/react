'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerEquipment } from '../../../actions/registerEquipment';

export const useEquipmentForm = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<{ name?: string[]; _form?: string[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 登録に成功したら true を返す（呼び出し側で一覧の再取得などに使う）
  const handleSubmit = async (): Promise<boolean> => {
    setIsSubmitting(true);
    setErrors({});
    setIsSuccess(false);

    const result = await registerEquipment({ name });

    if (!result.success && result.errors) {
      setErrors(result.errors);
      setIsSubmitting(false);
      return false;
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    setName('');
    router.refresh();
    return true;
  };

  return {
    name,
    setName,
    errors,
    isSubmitting,
    isSuccess,
    handleSubmit,
  };
};
