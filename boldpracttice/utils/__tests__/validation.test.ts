import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { validateField, validateFieldAsync, getValidationError } from '../validation';

describe('validateField', () => {
  const testSchema = z.string().min(3, '3文字以上必要です');

  describe('成功ケース', () => {
    it('有効な値の場合、success: true を返す', () => {
      const result = validateField(testSchema, 'valid');
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('境界値（最小文字数）の場合、success: true を返す', () => {
      const result = validateField(testSchema, 'abc');
      expect(result.success).toBe(true);
    });
  });

  describe('失敗ケース', () => {
    it('無効な値の場合、success: false とエラーメッセージを返す', () => {
      const result = validateField(testSchema, 'ab');
      expect(result.success).toBe(false);
      expect(result.error).toBe('3文字以上必要です');
      expect(result.errors).toContain('3文字以上必要です');
    });

    it('空文字列の場合、エラーを返す', () => {
      const result = validateField(testSchema, '');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('複数のエラーがある場合、全てのエラーを返す', () => {
      const complexSchema = z.object({
        name: z.string().min(3, 'nameは3文字以上'),
        age: z.number().min(18, 'ageは18以上'),
      });
      const result = validateField(complexSchema, { name: 'ab', age: 10 });
      expect(result.success).toBe(false);
      expect(result.errors?.length).toBeGreaterThan(0);
    });

    it('型が異なる場合、エラーを返す', () => {
      const numberSchema = z.number();
      const result = validateField(numberSchema, 'not a number');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});

describe('validateFieldAsync', () => {
  const asyncSchema = z.string().min(3, '3文字以上必要です');

  describe('成功ケース', () => {
    it('有効な値の場合、success: true を返す', async () => {
      const result = await validateFieldAsync(asyncSchema, 'valid');
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('失敗ケース', () => {
    it('無効な値の場合、success: false を返す', async () => {
      const result = await validateFieldAsync(asyncSchema, 'ab');
      expect(result.success).toBe(false);
      expect(result.error).toBe('3文字以上必要です');
    });

    it('複数のエラーがある場合、全てのエラーを返す', async () => {
      const complexSchema = z.object({
        name: z.string().min(3),
        age: z.number().min(18),
      });
      const result = await validateFieldAsync(complexSchema, { name: 'ab', age: 10 });
      expect(result.success).toBe(false);
      expect(result.errors?.length).toBeGreaterThan(0);
    });
  });
});

describe('getValidationError', () => {
  const emailSchema = z.string().email('有効なメールアドレスを入力してください');

  describe('成功ケース', () => {
    it('有効な値の場合、null を返す', () => {
      const error = getValidationError(emailSchema, 'test@example.com');
      expect(error).toBeNull();
    });

    it('サブドメインを含むメールアドレスの場合、null を返す', () => {
      const error = getValidationError(emailSchema, 'user@mail.example.com');
      expect(error).toBeNull();
    });
  });

  describe('失敗ケース', () => {
    it('無効な値の場合、エラーメッセージを返す', () => {
      const error = getValidationError(emailSchema, 'invalid-email');
      expect(error).toBe('有効なメールアドレスを入力してください');
    });

    it('@がない場合、エラーメッセージを返す', () => {
      const error = getValidationError(emailSchema, 'notemail');
      expect(error).toBeDefined();
      expect(error).not.toBeNull();
    });

    it('空文字列の場合、エラーメッセージを返す', () => {
      const error = getValidationError(emailSchema, '');
      expect(error).toBeDefined();
      expect(error).not.toBeNull();
    });
  });
});
