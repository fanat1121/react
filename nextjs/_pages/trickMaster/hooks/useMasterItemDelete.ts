'use client';

import { useState } from 'react';
import type { DeleteMasterItemResult, MasterListItem } from '../types';

const DELETE_FAILED_MESSAGE = '削除に失敗しました。時間をおいて再度お試しください';

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

    try {
      const result = await deleteAction(item.id);
      if (result.success) {
        onDeleted(item.id);
      } else {
        setDeleteError(result.error ?? '');
      }
    } catch {
      // 通信断・デプロイによる Action ID 変更などで Server Action 自体が reject した場合
      setDeleteError(DELETE_FAILED_MESSAGE);
    } finally {
      setDeletingId(null);
    }
  };

  return { deletingId, deleteError, handleDelete };
};
