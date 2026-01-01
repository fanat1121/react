'use server';

import { userRegistSchema } from '@/components/UserRegist/schemas/schema';
import { UserRegistFormData } from '@/components/UserRegist/types/UserRegistFormData';

export type RegisterResult = {
  success: boolean;
  errors?: {
    userName?: string[];
    email?: string[];
    password?: string[];
    passwordConfirm?: string[];
    _form?: string[];
  };
};

export async function registerUser(formData: UserRegistFormData): Promise<RegisterResult> {
  const result = userRegistSchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // TODO: DB処理やAPI呼び出し
    // const response = await fetch('http://localhost:8080/api/users/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(result.data),
    // });

    console.log('User registration:', result.data);

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
