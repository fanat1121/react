import { userRegistSchema } from '@/components/UserRegist/schemas/schema';
import { fetchPwnedPasswordsByRange } from '@/api/external/pwnedPasswords';
import { createHashPrefix } from '@/utils/hash';
import type { UserRegistFormData } from '@/components/UserRegist/types/UserRegistFormData';

export type ValidationResult = {
  success: boolean;
  errors?: {
    userName?: string[];
    email?: string[];
    password?: string[];
    passwordConfirm?: string[];
  };
  data?: UserRegistFormData;
};


/**
 * Have I Been PwnedAPIをコールしパスワードが漏洩済みのものでないかチェックする
 * @param password チェックするパスワード
 * @returns 存在する場合はtrue、存在しない場合はfalse
 */
async function checkPasswordPwned(password: string): Promise<boolean> {
  const hashBuffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(password));
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

  const prefix = createHashPrefix(hashHex.slice(0, 5));
  const suffix = hashHex.slice(5);

  const responseText = await fetchPwnedPasswordsByRange(prefix);

  return responseText.split('\n').some(line => {
    const [hashSuffix] = line.split(':');
    return hashSuffix === suffix;
  });
}

/**
 * ユーザー登録フォームのバリデーションを実行する
 * Zodスキーマによる基本バリデーション、パスワード漏洩チェック、
 * および将来的なユーザー名・メールアドレスの重複チェックを行う
 *
 * @param formData - ユーザー登録フォームのデータ
 * @returns バリデーション結果（成功時はデータ、失敗時はエラー）
 */
export async function validateUserRegistData(formData: UserRegistFormData): Promise<ValidationResult> {
  // 1. Zodバリデーション
  const result = userRegistSchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  // TODO: 2. 独自バリデーション（API呼び出し）
  // - ユーザー名の重複チェック
  // - メールアドレスの重複チェック

  // 3. パスワードのHave I Been Pwnedチェック
  const isPwned = await checkPasswordPwned(formData.password);
  if (isPwned) {
    return {
      success: false,
      errors: {
        password: ['このパスワードは漏洩データベースに存在します。別のパスワードを使用してください。'],
      },
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
