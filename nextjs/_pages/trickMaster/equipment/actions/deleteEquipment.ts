'use server';

import { canEditTrickMaster, UNAUTHORIZED_MESSAGE } from '../../auth/canEditTrickMaster';
import { deleteMasterItem } from '../../api/deleteMasterItem';
import type { DeleteMasterItemResult } from '../../types';

const RESOURCE_PATH = 'equipments';
const CONFLICT_MESSAGE = 'この道具は使用中のため削除できません（カテゴリ・状態・技から参照されています）';

export async function deleteEquipment(id: number): Promise<DeleteMasterItemResult> {
  if (!(await canEditTrickMaster())) {
    return { success: false, error: UNAUTHORIZED_MESSAGE };
  }

  return deleteMasterItem(RESOURCE_PATH, id, CONFLICT_MESSAGE);
}
