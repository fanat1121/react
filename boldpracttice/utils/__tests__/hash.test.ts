import { describe, it, expect } from 'vitest';
import { isValidHashPrefix, createHashPrefix } from '../hash';

describe('isValidHashPrefix', () => {
  it('正しい5文字の大文字英数字（A-F, 0-9）の場合、trueを返す', () => {
    expect(isValidHashPrefix('21BD1')).toBe(true);
    expect(isValidHashPrefix('ABCDE')).toBe(true);
    expect(isValidHashPrefix('12345')).toBe(true);
    expect(isValidHashPrefix('A1B2C')).toBe(true);
    expect(isValidHashPrefix('00000')).toBe(true);
    expect(isValidHashPrefix('FFFFF')).toBe(true);
  });

  it('小文字が含まれている場合、falseを返す', () => {
    expect(isValidHashPrefix('21bd1')).toBe(false);
    expect(isValidHashPrefix('abcde')).toBe(false);
    expect(isValidHashPrefix('A1b2C')).toBe(false);
  });

  it('5文字でない場合、falseを返す', () => {
    expect(isValidHashPrefix('21BD')).toBe(false);
    expect(isValidHashPrefix('21BD12')).toBe(false);
    expect(isValidHashPrefix('')).toBe(false);
    expect(isValidHashPrefix('A')).toBe(false);
  });

  it('A-F, 0-9以外の文字が含まれている場合、falseを返す', () => {
    expect(isValidHashPrefix('21BDG')).toBe(false);
    expect(isValidHashPrefix('ABCDZ')).toBe(false);
    expect(isValidHashPrefix('12-45')).toBe(false);
    expect(isValidHashPrefix('A B C')).toBe(false);
    expect(isValidHashPrefix('ABCD!')).toBe(false);
  });
});

describe('createHashPrefix', () => {
  it('正しい5文字の大文字英数字の場合、HashPrefix型を返す', () => {
    const result = createHashPrefix('21BD1');
    expect(result).toBe('21BD1');
    expect(isValidHashPrefix(result)).toBe(true);
  });

  it('小文字を含む正しい5文字の場合、大文字に変換してHashPrefix型を返す', () => {
    expect(createHashPrefix('21bd1')).toBe('21BD1');
    expect(createHashPrefix('abcde')).toBe('ABCDE');
    expect(createHashPrefix('a1b2c')).toBe('A1B2C');
  });

  it('5文字でない場合、エラーをスローする', () => {
    expect(() => createHashPrefix('21BD')).toThrow(
      'Hash prefix must be exactly 5 uppercase alphanumeric characters (A-F, 0-9)'
    );
    expect(() => createHashPrefix('21BD12')).toThrow(
      'Hash prefix must be exactly 5 uppercase alphanumeric characters (A-F, 0-9)'
    );
    expect(() => createHashPrefix('')).toThrow(
      'Hash prefix must be exactly 5 uppercase alphanumeric characters (A-F, 0-9)'
    );
  });

  it('A-F, 0-9以外の文字が含まれている場合、エラーをスローする', () => {
    expect(() => createHashPrefix('21BDG')).toThrow(
      'Hash prefix must be exactly 5 uppercase alphanumeric characters (A-F, 0-9)'
    );
    expect(() => createHashPrefix('ABCDZ')).toThrow(
      'Hash prefix must be exactly 5 uppercase alphanumeric characters (A-F, 0-9)'
    );
    expect(() => createHashPrefix('12-45')).toThrow(
      'Hash prefix must be exactly 5 uppercase alphanumeric characters (A-F, 0-9)'
    );
  });

  it('境界値テスト: 00000とFFFFFは正常に処理される', () => {
    expect(createHashPrefix('00000')).toBe('00000');
    expect(createHashPrefix('FFFFF')).toBe('FFFFF');
    expect(createHashPrefix('fffff')).toBe('FFFFF');
  });
});
