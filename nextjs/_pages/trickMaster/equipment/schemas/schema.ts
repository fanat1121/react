import { z } from 'zod';

export const equipmentSchema = z.object({
  name: z.string().min(1, '道具名を入力してください').max(64, '道具名は64文字以内にしてください'),
});

export type EquipmentFormData = z.infer<typeof equipmentSchema>;
