import { z } from 'zod';

export const categorySchema = z.object({
  equipmentId: z.coerce.number().int().positive('道具を選択してください'),
  name: z.string().min(1, 'カテゴリ名を入力してください').max(64, 'カテゴリ名は64文字以内にしてください'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
