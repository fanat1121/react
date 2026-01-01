import { z } from 'zod';

// パスワードスキーマ（NIST SP 800-63B準拠）
export const passwordSchema = z
  .string()
  .min(15, 'パスワードは15文字以上必要です')
  .max(128, 'パスワードは128文字以内にしてください')
  .regex(
    /^[\x20-\x7E]+$/,
    'パスワードは半角英数字と記号のみ使用できます'
  );

// ユーザー名のバリデーションルール
export const userNameSchema = z
.string()
.min(3, 'ユーザー名は3文字以上必要です')
.max(64, 'ユーザー名は64文字以内にしてください');

// メールアドレスのバリデーションルール
export const emailSchema = z
.string()
.email('有効なメールアドレスを入力してください');

// 全体のバリデーションスキーマ
export const userRegistSchema = z.object({
  userName:userNameSchema,
  email: emailSchema,
  password: passwordSchema,
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "パスワードが一致しません",
  path: ["passwordConfirm"],
});

// 型定義
export type UserRegistData = z.infer<typeof userRegistSchema>;