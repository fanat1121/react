'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerState } from '../../../actions/registerState';

export const useStateForm = () => {
  const router = useRouter();
  const [equipmentId, setEquipmentId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{
    equipmentId?: string[];
    name?: string[];
    description?: string[];
    _form?: string[];
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});
    setIsSuccess(false);

    const result = await registerState({ equipmentId: Number(equipmentId), name, description });

    if (!result.success && result.errors) {
      setErrors(result.errors);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    setName('');
    setDescription('');
    router.refresh();
  };

  return {
    equipmentId,
    setEquipmentId,
    name,
    setName,
    description,
    setDescription,
    errors,
    isSubmitting,
    isSuccess,
    handleSubmit,
  };
};
