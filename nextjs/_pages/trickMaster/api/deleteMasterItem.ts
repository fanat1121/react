import type { DeleteMasterItemResult } from '../types';

const GO_API_URL = process.env.GO_API_URL ?? 'http://localhost:8080';
const HTTP_STATUS_CONFLICT = 409;
const DELETE_ERROR_MESSAGE = '削除処理中にエラーが発生しました';

// 道具・カテゴリ・状態の削除 Server Action から共通で使う Go API 呼び出し。
// 権限チェックは各 Server Action 側で行うこと。
export async function deleteMasterItem(
  resourcePath: string,
  id: number,
  conflictMessage: string
): Promise<DeleteMasterItemResult> {
  try {
    const response = await fetch(`${GO_API_URL}/api/${resourcePath}/${id}`, { method: 'DELETE' });

    if (response.status === HTTP_STATUS_CONFLICT) {
      return { success: false, error: conflictMessage };
    }

    const json = await response.json().catch(() => null);

    if (!response.ok || !json?.success) {
      return { success: false, error: json?.error?.message ?? DELETE_ERROR_MESSAGE };
    }

    return { success: true };
  } catch {
    return { success: false, error: DELETE_ERROR_MESSAGE };
  }
}
