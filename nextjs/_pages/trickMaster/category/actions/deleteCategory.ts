'use server';

import { canEditTrickMaster, UNAUTHORIZED_MESSAGE } from '../../auth/canEditTrickMaster';
import { deleteMasterItem } from '../../api/deleteMasterItem';
import type { DeleteMasterItemResult } from '../../types';

const RESOURCE_PATH = 'equipment-categories';
const CONFLICT_MESSAGE = 'このカテゴリは技で使用中のため削除できません';

export async function deleteCategory(id: number): Promise<DeleteMasterItemResult> {
  if (!(await canEditTrickMaster())) {
    return { success: false, error: UNAUTHORIZED_MESSAGE };
  }

  return deleteMasterItem(RESOURCE_PATH, id, CONFLICT_MESSAGE);
}
