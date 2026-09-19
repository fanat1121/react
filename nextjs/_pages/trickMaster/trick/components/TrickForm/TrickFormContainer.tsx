'use client';

import { useEffect, useState } from 'react';
import { useTrickForm } from './hooks/useTrickForm';
import { TrickForm } from './TrickForm';
import type { EquipmentOption, CategoryOption, StateOption } from '../../../types';

type TrickFormContainerProps = {
  equipmentOptions: EquipmentOption[];
};

export const TrickFormContainer: React.FC<TrickFormContainerProps> = ({ equipmentOptions }) => {
  const {
    equipmentId,
    setEquipmentId,
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
  } = useTrickForm();

  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [stateOptions, setStateOptions] = useState<StateOption[]>([]);

  useEffect(() => {
    if (!equipmentId) {
      setCategoryOptions([]);
      setStateOptions([]);
      return;
    }

    let cancelled = false;

    Promise.all([
      fetch(`/api/equipment-categories?equipment_id=${equipmentId}`).then((res) => res.json()),
      fetch(`/api/states?equipment_id=${equipmentId}`).then((res) => res.json()),
    ]).then(([categoryJson, stateJson]) => {
      if (cancelled) return;
      setCategoryOptions(categoryJson.success ? categoryJson.data : []);
      setStateOptions(stateJson.success ? stateJson.data : []);
    });

    return () => {
      cancelled = true;
    };
  }, [equipmentId]);

  return (
    <TrickForm
      equipmentOptions={equipmentOptions}
      categoryOptions={categoryOptions}
      stateOptions={stateOptions}
      equipmentId={equipmentId}
      onEquipmentIdChange={setEquipmentId}
      categoryId={categoryId}
      onCategoryIdChange={setCategoryId}
      name={name}
      onNameChange={setName}
      description={description}
      onDescriptionChange={setDescription}
      startStateId={startStateId}
      onStartStateIdChange={setStartStateId}
      endStateId={endStateId}
      onEndStateIdChange={setEndStateId}
      videoUrl={videoUrl}
      onVideoUrlChange={setVideoUrl}
      estimatedDurationSeconds={estimatedDurationSeconds}
      onEstimatedDurationSecondsChange={setEstimatedDurationSeconds}
      errors={errors}
      isSubmitting={isSubmitting}
      isSuccess={isSuccess}
      onSubmit={handleSubmit}
    />
  );
};
