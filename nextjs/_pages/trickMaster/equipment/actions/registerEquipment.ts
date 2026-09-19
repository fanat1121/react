'use server';

import { equipmentSchema } from '../schemas/schema';
import type { EquipmentFormData } from '../schemas/schema';

const GO_API_URL = process.env.GO_API_URL ?? 'http://localhost:8080';

export type RegisterEquipmentResult = {
  success: boolean;
  errors?: {
    name?: string[];
    _form?: string[];
  };
};

export async function registerEquipment(formData: EquipmentFormData): Promise<RegisterEquipmentResult> {
  const result = equipmentSchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await fetch(`${GO_API_URL}/api/equipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: result.data.name }),
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
