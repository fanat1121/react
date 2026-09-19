'use server';

import { trickSchema } from '../schemas/schema';
import type { TrickFormData } from '../schemas/schema';

const GO_API_URL = process.env.GO_API_URL ?? 'http://localhost:8080';

export type RegisterTrickResult = {
  success: boolean;
  errors?: {
    equipmentId?: string[];
    categoryId?: string[];
    name?: string[];
    description?: string[];
    startStateId?: string[];
    endStateId?: string[];
    videoUrl?: string[];
    estimatedDurationSeconds?: string[];
    _form?: string[];
  };
};

export async function registerTrick(formData: TrickFormData): Promise<RegisterTrickResult> {
  const result = trickSchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await fetch(`${GO_API_URL}/api/tricks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        equipment_id: result.data.equipmentId,
        category_id: result.data.categoryId,
        name: result.data.name,
        description: result.data.description,
        start_state_id: result.data.startStateId,
        end_state_id: result.data.endStateId,
        video_url: result.data.videoUrl,
        estimated_duration_seconds: result.data.estimatedDurationSeconds,
      }),
    });

    const json = await response.json();

    if (!json.success) {
      return {
        success: false,
        errors: {
          _form: [json.error?.message ?? '登録処理中にエラーが発生しました'],
        },
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      errors: {
        _form: ['登録処理中にエラーが発生しました'],
      },
    };
  }
}
