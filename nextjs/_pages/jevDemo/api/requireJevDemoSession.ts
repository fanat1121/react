import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const UNAUTHORIZED_MESSAGE = 'ログインが必要です';

/**
 * Jev デモ API はサーバーの JEV_API_KEY で有料 API を呼ぶため、未ログインの呼び出しを弾く。
 * middleware は API ルートをリダイレクトしないので、各 Route Handler の先頭で必ず呼ぶ。
 * @returns 未ログインなら 401 レスポンス、ログイン済みなら null
 */
export async function requireJevDemoSession(): Promise<NextResponse | null> {
  const session = await auth();
  if (session?.user) return null;

  return NextResponse.json(
    { success: false, error: { code: 'UNAUTHORIZED', message: UNAUTHORIZED_MESSAGE } },
    { status: 401 }
  );
}
