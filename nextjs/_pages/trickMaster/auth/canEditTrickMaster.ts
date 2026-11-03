import { auth } from '@/lib/auth';

export const UNAUTHORIZED_MESSAGE = 'この操作を行う権限がありません。ログインしてください';

// 技マスタを登録・削除してよいかの判定。Server Action は直接 POST で呼べるため、各 Action の先頭で必ず呼ぶ。
// 現状はログイン済みなら許可。ロールを導入したらここだけ差し替える。
export async function canEditTrickMaster(): Promise<boolean> {
  const session = await auth();
  return !!session?.user;
}
