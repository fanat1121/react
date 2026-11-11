'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerState } from '../../../actions/registerState';

export const useStateForm = () => {
  const router = useRouter();
  const [equipmentId, setEquipmentId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [errors, setErrors] = useState<{
    equipmentId?: string[];
    name?: string[];
    description?: string[];
    mediaUrl?: string[];
    _form?: string[];
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 登録に成功したら true を返す（呼び出し側で一覧の再取得などに使う）
  const handleSubmit = async (): Promise<boolean> => {
    setIsSubmitting(true);
    setErrors({});
    setIsSuccess(false);

    const result = await registerState({ equipmentId: Number(equipmentId), name, description, mediaUrl });

    if (!result.success && result.errors) {
      setErrors(result.errors);
      setIsSubmitting(false);
      return false;
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    setName('');
    setDescription('');
    setMediaUrl('');
    router.refresh();
    return true;
  };

  return {
    equipmentId,
    setEquipmentId,
    name,
    setName,
    description,
    setDescription,
    mediaUrl,
    setMediaUrl,
    errors,
    isSubmitting,
    isSuccess,
    handleSubmit,
  };
};
