'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import redis from '@/lib/redis';
import { validateUserRegistData } from '../services/validation';

export type SaveFormDataResult = {
  success: boolean;
  errors?: {
    userName?: string[];
    email?: string[];
    password?: string[];
    passwordConfirm?: string[];
  };
  sessionId?: string;
};

export async function saveFormData(formData: {
  userName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}): Promise<SaveFormDataResult> {
  const validationResult = await validateUserRegistData(formData);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.errors,
    };
  }

  const sessionId = crypto.randomUUID();
  const key = `user_regist:${sessionId}`;

  try {
    await redis.setex(key, 600, JSON.stringify(validationResult.data));
  } catch {
    return {
      success: false,
      errors: {
        userName: ['データの保存に失敗しました'],
      },
    };
  }

  const cookieStore = await cookies();
  cookieStore.set('user_regist_session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/user-regist',
  });

  redirect('/user-regist/confirm');
}
