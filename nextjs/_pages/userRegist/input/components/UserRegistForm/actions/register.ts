'use server';

import { cookies } from 'next/headers';
import { userRegistSchema } from '@/_pages/userRegist/schemas/schema';
import { UserRegistFormData } from '@/_pages/userRegist/types/UserRegistFormData';
import { USER_REGIST_LOGIN_ID_COOKIE } from '@/_pages/userRegist/const/cookies';

const GO_API_URL = process.env.GO_API_URL ?? 'http://localhost:8080';

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
    const response = await fetch(`${GO_API_URL}/api/users/register`, {
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

    const cookieStore = await cookies();
    cookieStore.set(USER_REGIST_LOGIN_ID_COOKIE, json.data.user_login_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60,
      path: '/UserRegist/completion',
    });

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
