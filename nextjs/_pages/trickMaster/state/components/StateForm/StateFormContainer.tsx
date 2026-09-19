'use client';

import { useStateForm } from './hooks/useStateForm';
import { StateForm } from './StateForm';
import type { EquipmentOption } from '../../../types';

type StateFormContainerProps = {
  equipmentOptions: EquipmentOption[];
};

export const StateFormContainer: React.FC<StateFormContainerProps> = ({ equipmentOptions }) => {
  const {
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
  } = useStateForm();

  return (
    <StateForm
      equipmentOptions={equipmentOptions}
      equipmentId={equipmentId}
      onEquipmentIdChange={setEquipmentId}
      name={name}
      onNameChange={setName}
      description={description}
      onDescriptionChange={setDescription}
      mediaUrl={mediaUrl}
      onMediaUrlChange={setMediaUrl}
      errors={errors}
      isSubmitting={isSubmitting}
      isSuccess={isSuccess}
      onSubmit={handleSubmit}
    />
  );
};
