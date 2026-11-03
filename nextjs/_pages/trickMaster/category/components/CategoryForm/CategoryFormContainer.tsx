'use client';

import { useCategoryForm } from './hooks/useCategoryForm';
import { CategoryForm } from './CategoryForm';
import { deleteCategory } from '../../actions/deleteCategory';
import { useEquipmentScopedList } from '../../../hooks/useEquipmentScopedList';
import { useMasterItemDelete } from '../../../hooks/useMasterItemDelete';
import { MasterList } from '../../../components/MasterList/MasterList';
import type { CategoryOption, EquipmentOption } from '../../../types';

const CATEGORIES_ENDPOINT = '/api/equipment-categories';
const LIST_TITLE = '登録済みのカテゴリ';
const EMPTY_MESSAGE = '登録済みのカテゴリはありません';
const SELECT_EQUIPMENT_MESSAGE = '道具を選択すると登録済みのカテゴリが表示されます';

type CategoryFormContainerProps = {
  equipmentOptions: EquipmentOption[];
};

export const CategoryFormContainer: React.FC<CategoryFormContainerProps> = ({ equipmentOptions }) => {
  const { equipmentId, setEquipmentId, name, setName, errors, isSubmitting, isSuccess, handleSubmit } =
    useCategoryForm();
  const { items, isLoading, loadError, reload, removeItem } = useEquipmentScopedList<CategoryOption>(
    CATEGORIES_ENDPOINT,
    equipmentId
  );
  const { deletingId, deleteError, handleDelete } = useMasterItemDelete(deleteCategory, removeItem);

  const handleRegister = async () => {
    if (await handleSubmit()) reload();
  };

  return (
    <>
      <CategoryForm
        equipmentOptions={equipmentOptions}
        equipmentId={equipmentId}
        onEquipmentIdChange={setEquipmentId}
        name={name}
        onNameChange={setName}
        errors={errors}
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        onSubmit={handleRegister}
      />
      <MasterList
        title={LIST_TITLE}
        items={items}
        emptyMessage={equipmentId ? EMPTY_MESSAGE : SELECT_EQUIPMENT_MESSAGE}
        isLoading={isLoading}
        errorMessage={deleteError || loadError}
        deletingId={deletingId}
        onDelete={handleDelete}
      />
    </>
  );
};
