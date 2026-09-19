import { z } from 'zod';

export const stateSchema = z.object({
  equipmentId: z.coerce.number().int().positive('道具を選択してください'),
  name: z.string().min(1, '状態名を入力してください').max(64, '状態名は64文字以内にしてください'),
  description: z.string().max(1000, '説明は1000文字以内にしてください').optional(),
  mediaUrl: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
});

export type StateFormData = z.infer<typeof stateSchema>;
