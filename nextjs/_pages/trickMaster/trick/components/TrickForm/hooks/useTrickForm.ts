'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerTrick } from '../../../actions/registerTrick';

export const useTrickForm = () => {
  const router = useRouter();
  const [equipmentId, setEquipmentId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startStateId, setStartStateId] = useState('');
  const [endStateId, setEndStateId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [estimatedDurationSeconds, setEstimatedDurationSeconds] = useState('0');
  const [errors, setErrors] = useState<{
    equipmentId?: string[];
    categoryId?: string[];
    name?: string[];
    description?: string[];
    startStateId?: string[];
    endStateId?: string[];
    videoUrl?: string[];
    estimatedDurationSeconds?: string[];
    _form?: string[];
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEquipmentIdChange = (value: string) => {
    setEquipmentId(value);
    setCategoryId('');
    setStartStateId('');
    setEndStateId('');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});
    setIsSuccess(false);

    const result = await registerTrick({
      equipmentId: Number(equipmentId),
      categoryId: Number(categoryId),
      name,
      description,
      startStateId: Number(startStateId),
      endStateId: Number(endStateId),
      videoUrl,
      estimatedDurationSeconds: Number(estimatedDurationSeconds),
    });

    if (!result.success && result.errors) {
      setErrors(result.errors);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    setName('');
    setDescription('');
    setStartStateId('');
    setEndStateId('');
    setVideoUrl('');
    setEstimatedDurationSeconds('0');
    router.refresh();
  };

  return {
    equipmentId,
    setEquipmentId: handleEquipmentIdChange,
    categoryId,
    setCategoryId,
    name,
    setName,
    description,
    setDescription,
    startStateId,
    setStartStateId,
    endStateId,
    setEndStateId,
    videoUrl,
    setVideoUrl,
    estimatedDurationSeconds,
    setEstimatedDurationSeconds,
    errors,
    isSubmitting,
    isSuccess,
    handleSubmit,
  };
};
