import { z } from 'zod';

export const trickSchema = z.object({
  equipmentId: z.coerce.number().int().positive('道具を選択してください'),
  categoryId: z.coerce.number().int().positive('カテゴリを選択してください'),
  name: z.string().min(1, '技名を入力してください').max(128, '技名は128文字以内にしてください'),
  description: z.string().max(1000, '説明は1000文字以内にしてください').optional(),
  startStateId: z.coerce.number().int().positive('開始状態を選択してください'),
  endStateId: z.coerce.number().int().positive('終了状態を選択してください'),
  videoUrl: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  estimatedDurationSeconds: z.coerce.number().int().min(0, '0以上の数値を入力してください').default(0),
});

export type TrickFormData = z.infer<typeof trickSchema>;
