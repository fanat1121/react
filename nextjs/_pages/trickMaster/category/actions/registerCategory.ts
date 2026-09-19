'use server';

import { categorySchema } from '../schemas/schema';
import type { CategoryFormData } from '../schemas/schema';

const GO_API_URL = process.env.GO_API_URL ?? 'http://localhost:8080';

export type RegisterCategoryResult = {
  success: boolean;
  errors?: {
    equipmentId?: string[];
    name?: string[];
    _form?: string[];
  };
};

export async function registerCategory(formData: CategoryFormData): Promise<RegisterCategoryResult> {
  const result = categorySchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await fetch(`${GO_API_URL}/api/equipment-categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        equipment_id: result.data.equipmentId,
        name: result.data.name,
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
