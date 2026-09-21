'use client';

import { useTrickForm } from './hooks/useTrickForm';
import { useEquipmentScopedOptions } from '../../hooks/useEquipmentScopedOptions';
import { TrickForm } from './TrickForm';
import type { EquipmentOption } from '../../../types';

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

  const { categoryOptions, stateOptions } = useEquipmentScopedOptions(equipmentId);

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
