import { z } from 'zod';

export type ValidationResult = {
  success: boolean;
  error?: string;
  errors?: string[];
};

/**
 * Zodスキーマを使用してフィールドをバリデーション
 */
export function validateField<T>(
  schema: z.ZodSchema<T>,
  value: unknown
): ValidationResult {
  try {
    schema.parse(value);
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        success: false,
        error: err.issues[0].message,
        errors: err.issues.map((e) => e.message),
      };
    }
    return { success: false, error: '不明なエラーが発生しました' };
  }
}

/**
 * 非同期バリデーション
 */
export function validateFieldAsync<T>(
  schema: z.ZodSchema<T>,
  value: unknown
): Promise<ValidationResult> {
  return schema
    .parseAsync(value)
    .then(() => ({ success: true }))
    .catch((err) => {
      if (err instanceof z.ZodError) {
        return {
          success: false,
          error: err.issues[0].message,
          errors: err.issues.map((e) => e.message),
        };
      }
      return { success: false, error: '不明なエラーが発生しました' };
    });
}

/**
 * エラーメッセージのみを取得
 */
export function getValidationError<T>(
  schema: z.ZodSchema<T>,
  value: unknown
): string | null {
  try {
    schema.parse(value);
    return null;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return err.issues[0].message;
    }
    return '不明なエラーが発生しました';
  }
}
