'use client';

import { useCategoryForm } from './hooks/useCategoryForm';
import { CategoryForm } from './CategoryForm';
import type { EquipmentOption } from '../../../types';

type CategoryFormContainerProps = {
  equipmentOptions: EquipmentOption[];
};

export const CategoryFormContainer: React.FC<CategoryFormContainerProps> = ({ equipmentOptions }) => {
  const { equipmentId, setEquipmentId, name, setName, errors, isSubmitting, isSuccess, handleSubmit } =
    useCategoryForm();

  return (
    <CategoryForm
      equipmentOptions={equipmentOptions}
      equipmentId={equipmentId}
      onEquipmentIdChange={setEquipmentId}
      name={name}
      onNameChange={setName}
      errors={errors}
      isSubmitting={isSubmitting}
      isSuccess={isSuccess}
      onSubmit={handleSubmit}
    />
  );
};
