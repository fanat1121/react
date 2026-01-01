import { userRegistSchema } from '@/components/UserRegist/schemas/schema';

export type ValidationResult = {
  success: boolean;
  errors?: {
    userName?: string[];
    email?: string[];
    password?: string[];
    passwordConfirm?: string[];
  };
  data?: {
    userName: string;
    email: string;
    password: string;
    passwordConfirm: string;
  };
};

export async function validateUserRegistData(formData: {
  userName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}): Promise<ValidationResult> {
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
  // - パスワードのHave I Been Pwnedチェック
  // 例:
  // const isDuplicate = await checkUserNameDuplicate(formData.userName);
  // if (isDuplicate) {
  //   return {
  //     success: false,
  //     errors: { userName: ['このユーザー名は既に使用されています'] },
  //   };
  // }

  return {
    success: true,
    data: result.data,
  };
}
