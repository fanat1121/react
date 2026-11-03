'use client';

import { useState } from 'react';
import type { DeleteMasterItemResult, MasterListItem } from '../types';

// 確認ダイアログ → Server Action 呼び出し → 成功時コールバック、までの削除フローを共通化する。
export const useMasterItemDelete = (
  deleteAction: (id: number) => Promise<DeleteMasterItemResult>,
  onDeleted: (id: number) => void
) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async (item: MasterListItem) => {
    if (!window.confirm(`「${item.name}」を削除しますか？`)) return;

    setDeletingId(item.id);
    setDeleteError('');

    const result = await deleteAction(item.id);
    if (result.success) {
      onDeleted(item.id);
    } else {
      setDeleteError(result.error ?? '');
    }
    setDeletingId(null);
  };

  return { deletingId, deleteError, handleDelete };
};
