'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import redis from '@/lib/redis';
import { userRegistSchema } from '@/components/UserRegist/schemas/schema';

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
  const result = userRegistSchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const sessionId = crypto.randomUUID();
  const key = `user_regist:${sessionId}`;

  try {
    await redis.setex(key, 600, JSON.stringify(result.data));
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
