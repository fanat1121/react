import { describe, it, expect } from 'vitest';
import { 
  passwordSchema, 
  userNameSchema, 
  emailSchema,
  userRegistSchema 
} from '../schema';

describe('passwordSchema', () => {
  describe('有効なパスワード', () => {
    it('15文字のパスワードを受け入れる', () => {
      expect(() => passwordSchema.parse('ValidPassword12')).not.toThrow();
    });

    it('128文字のパスワードを受け入れる', () => {
      const password = 'a'.repeat(128);
      expect(() => passwordSchema.parse(password)).not.toThrow();
    });

    it('スペースを含むパスワードを受け入れる', () => {
      expect(() => passwordSchema.parse('my long password 123')).not.toThrow();
    });

    it('記号を含むパスワードを受け入れる', () => {
      expect(() => passwordSchema.parse('P@ssw0rd!#$%^&*()')).not.toThrow();
    });
  });

  describe('無効なパスワード', () => {
    it('14文字以下のパスワードを拒否する', () => {
      expect(() => passwordSchema.parse('Short123')).toThrow('パスワードは15文字以上必要です');
    });

    it('129文字以上のパスワードを拒否する', () => {
      const longPassword = 'a'.repeat(129);
      expect(() => passwordSchema.parse(longPassword)).toThrow('パスワードは128文字以内にしてください');
    });

    it('全角文字を含むパスワードを拒否する', () => {
      expect(() => passwordSchema.parse('パスワード123456789')).toThrow('パスワードは半角英数字と記号のみ使用できます');
    });

    it('絵文字を含むパスワードを拒否する', () => {
      expect(() => passwordSchema.parse('password😀12345')).toThrow('パスワードは半角英数字と記号のみ使用できます');
    });

    it('空文字列を拒否する', () => {
      expect(() => passwordSchema.parse('')).toThrow();
    });
  });
});

describe('userNameSchema', () => {
  describe('有効なユーザー名', () => {
    it('3文字のユーザー名を受け入れる', () => {
      expect(() => userNameSchema.parse('abc')).not.toThrow();
    });

    it('64文字のユーザー名を受け入れる', () => {
      const userName = 'a'.repeat(64);
      expect(() => userNameSchema.parse(userName)).not.toThrow();
    });

    it('英数字とアンダースコアを含むユーザー名を受け入れる', () => {
      expect(() => userNameSchema.parse('user_name_123')).not.toThrow();
    });
  });

  describe('無効なユーザー名', () => {
    it('2文字以下のユーザー名を拒否する', () => {
      expect(() => userNameSchema.parse('ab')).toThrow('ユーザー名は3文字以上必要です');
    });

    it('65文字以上のユーザー名を拒否する', () => {
      const longName = 'a'.repeat(65);
      expect(() => userNameSchema.parse(longName)).toThrow('ユーザー名は64文字以内にしてください');
    });

    it('空文字列を拒否する', () => {
      expect(() => userNameSchema.parse('')).toThrow();
    });
  });
});

describe('emailSchema', () => {
  describe('有効なメールアドレス', () => {
    it('標準的なメールアドレスを受け入れる', () => {
      expect(() => emailSchema.parse('test@example.com')).not.toThrow();
    });

    it('サブドメインを含むメールアドレスを受け入れる', () => {
      expect(() => emailSchema.parse('user@mail.example.com')).not.toThrow();
    });

    it('プラス記号を含むメールアドレスを受け入れる', () => {
      expect(() => emailSchema.parse('user+tag@example.com')).not.toThrow();
    });
  });

  describe('無効なメールアドレス', () => {
    it('@がないメールアドレスを拒否する', () => {
      expect(() => emailSchema.parse('invalid-email')).toThrow('有効なメールアドレスを入力してください');
    });

    it('ドメインがないメールアドレスを拒否する', () => {
      expect(() => emailSchema.parse('user@')).toThrow('有効なメールアドレスを入力してください');
    });

    it('空文字列を拒否する', () => {
      expect(() => emailSchema.parse('')).toThrow();
    });
  });
});

describe('userRegistSchema', () => {
  const validData = {
    userName: 'testuser',
    email: 'test@example.com',
    password: 'ValidPassword123',
    passwordConfirm: 'ValidPassword123',
  };

  describe('有効な登録データ', () => {
    it('全てのフィールドが有効な場合に受け入れる', () => {
      expect(() => userRegistSchema.parse(validData)).not.toThrow();
    });

    it('パスワードが一致する場合に受け入れる', () => {
      const data = {
        ...validData,
        password: 'AnotherValidPassword123',
        passwordConfirm: 'AnotherValidPassword123',
      };
      expect(() => userRegistSchema.parse(data)).not.toThrow();
    });
  });

  describe('無効な登録データ', () => {
    it('パスワードが一致しない場合に拒否する', () => {
      const data = {
        ...validData,
        passwordConfirm: 'DifferentPassword123',
      };
      expect(() => userRegistSchema.parse(data)).toThrow('パスワードが一致しません');
    });

    it('ユーザー名が無効な場合に拒否する', () => {
      const data = {
        ...validData,
        userName: 'ab',
      };
      expect(() => userRegistSchema.parse(data)).toThrow();
    });

    it('メールアドレスが無効な場合に拒否する', () => {
      const data = {
        ...validData,
        email: 'invalid-email',
      };
      expect(() => userRegistSchema.parse(data)).toThrow();
    });

    it('パスワードが無効な場合に拒否する', () => {
      const data = {
        ...validData,
        password: 'short',
        passwordConfirm: 'short',
      };
      expect(() => userRegistSchema.parse(data)).toThrow();
    });
  });
});