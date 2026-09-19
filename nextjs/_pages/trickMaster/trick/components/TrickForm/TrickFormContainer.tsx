'use client';

import { useMemo } from 'react';
import { useTrickForm } from './hooks/useTrickForm';
import { TrickForm } from './TrickForm';
import type { EquipmentOption, CategoryOption, StateOption } from '../../../types';

type TrickFormContainerProps = {
  equipmentOptions: EquipmentOption[];
  categoryOptions: CategoryOption[];
  stateOptions: StateOption[];
};

export const TrickFormContainer: React.FC<TrickFormContainerProps> = ({
  equipmentOptions,
  categoryOptions,
  stateOptions,
}) => {
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

  const filteredCategoryOptions = useMemo(
    () => categoryOptions.filter((c) => String(c.equipment_id) === equipmentId),
    [categoryOptions, equipmentId]
  );

  const filteredStateOptions = useMemo(
    () => stateOptions.filter((s) => String(s.equipment_id) === equipmentId),
    [stateOptions, equipmentId]
  );

  return (
    <TrickForm
      equipmentOptions={equipmentOptions}
      categoryOptions={filteredCategoryOptions}
      stateOptions={filteredStateOptions}
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
