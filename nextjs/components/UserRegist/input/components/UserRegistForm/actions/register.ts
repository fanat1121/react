'use server';

import { userRegistSchema } from '@/components/UserRegist/schemas/schema';
import { UserRegistFormData } from '@/components/UserRegist/types/UserRegistFormData';

export type RegisterResult = {
  success: boolean;
  userLoginId?: string;
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
    const response = await fetch('http://localhost:8080/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_name: formData.userName,
        email: formData.email,
        password: formData.password,
      }),
    });

    const json = await response.json();

    if (!json.success) {
      return {
        success: false,
        errors: {
          _form: ['登録処理中にエラーが発生しました'],
        },
      };
    }

    return { success: true, userLoginId: json.data.user_login_id };
  } catch {
    return {
      success: false,
      errors: {
        _form: ['登録処理中にエラーが発生しました'],
      },
    };
  }
}
