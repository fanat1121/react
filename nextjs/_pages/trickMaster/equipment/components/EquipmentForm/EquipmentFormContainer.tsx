'use client';

import { useEquipmentForm } from './hooks/useEquipmentForm';
import { EquipmentForm } from './EquipmentForm';

export const EquipmentFormContainer: React.FC = () => {
  const { name, setName, errors, isSubmitting, isSuccess, handleSubmit } = useEquipmentForm();

  return (
    <EquipmentForm
      name={name}
      onNameChange={setName}
      errors={errors}
      isSubmitting={isSubmitting}
      isSuccess={isSuccess}
      onSubmit={handleSubmit}
    />
  );
};
