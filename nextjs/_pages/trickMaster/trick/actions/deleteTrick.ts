'use server';

import { canEditTrickMaster, UNAUTHORIZED_MESSAGE } from '../../auth/canEditTrickMaster';

const GO_API_URL = process.env.GO_API_URL ?? 'http://localhost:8080';
const DELETE_ERROR_MESSAGE = '削除処理中にエラーが発生しました';

export type DeleteTrickResult = {
  success: boolean;
  error?: string;
};

export async function deleteTrick(id: number): Promise<DeleteTrickResult> {
  if (!(await canEditTrickMaster())) {
    return { success: false, error: UNAUTHORIZED_MESSAGE };
  }

  try {
    const response = await fetch(`${GO_API_URL}/api/tricks/${id}`, { method: 'DELETE' });
    const json = await response.json();

    if (!json.success) {
      return { success: false, error: json.error?.message ?? DELETE_ERROR_MESSAGE };
    }

    return { success: true };
  } catch {
    return { success: false, error: DELETE_ERROR_MESSAGE };
  }
}
