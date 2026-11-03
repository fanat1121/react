'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEquipmentForm } from './hooks/useEquipmentForm';
import { EquipmentForm } from './EquipmentForm';
import { deleteEquipment } from '../../actions/deleteEquipment';
import { useMasterItemDelete } from '../../../hooks/useMasterItemDelete';
import { MasterList } from '../../../components/MasterList/MasterList';
import type { EquipmentOption } from '../../../types';

const LIST_TITLE = '登録済みの道具';
const EMPTY_MESSAGE = '登録済みの道具はありません';

type EquipmentFormContainerProps = {
  equipmentOptions: EquipmentOption[];
};

export const EquipmentFormContainer: React.FC<EquipmentFormContainerProps> = ({ equipmentOptions }) => {
  const router = useRouter();
  const { name, setName, errors, isSubmitting, isSuccess, handleSubmit } = useEquipmentForm();
  // router.refresh() で props が更新されるまでの間も、削除済みの行を即座に消すために保持する
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const { deletingId, deleteError, handleDelete } = useMasterItemDelete(deleteEquipment, (id) => {
    setDeletedIds((prev) => [...prev, id]);
    router.refresh();
  });

  const items = equipmentOptions.filter((equipment) => !deletedIds.includes(equipment.id));

  return (
    <>
      <EquipmentForm
        name={name}
        onNameChange={setName}
        errors={errors}
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        onSubmit={handleSubmit}
      />
      <MasterList
        title={LIST_TITLE}
        items={items}
        emptyMessage={EMPTY_MESSAGE}
        errorMessage={deleteError}
        deletingId={deletingId}
        onDelete={handleDelete}
      />
    </>
  );
};
