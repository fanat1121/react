'use client';

import { useStateForm } from './hooks/useStateForm';
import { StateForm } from './StateForm';
import { deleteState } from '../../actions/deleteState';
import { useEquipmentScopedList } from '../../../hooks/useEquipmentScopedList';
import { useMasterItemDelete } from '../../../hooks/useMasterItemDelete';
import { MasterList } from '../../../components/MasterList/MasterList';
import type { EquipmentOption, StateOption } from '../../../types';

const STATES_ENDPOINT = '/api/states';
const LIST_TITLE = '登録済みの状態';
const EMPTY_MESSAGE = '登録済みの状態はありません';
const SELECT_EQUIPMENT_MESSAGE = '道具を選択すると登録済みの状態が表示されます';

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
  const { items, isLoading, loadError, reload, removeItem } = useEquipmentScopedList<StateOption>(
    STATES_ENDPOINT,
    equipmentId
  );
  const { deletingId, deleteError, handleDelete } = useMasterItemDelete(deleteState, removeItem);

  const handleRegister = async () => {
    if (await handleSubmit()) reload();
  };

  return (
    <>
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
