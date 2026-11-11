import { beforeEach, describe, expect, it, vi } from 'vitest';

const authMock = vi.fn();
vi.mock('@/lib/auth', () => ({ auth: () => authMock() }));

import { requireJevDemoSession } from '../requireJevDemoSession';

describe('requireJevDemoSession', () => {
  beforeEach(() => {
    authMock.mockReset();
  });

  it('ログイン済みなら null を返す', async () => {
    authMock.mockResolvedValue({ user: { id: '1', name: 'テスト' } });
    expect(await requireJevDemoSession()).toBeNull();
  });

  it('未ログインなら 401 を返す', async () => {
    authMock.mockResolvedValue(null);
    const response = await requireJevDemoSession();
    expect(response?.status).toBe(401);
    expect(await response?.json()).toMatchObject({ success: false, error: { code: 'UNAUTHORIZED' } });
  });

  it('user を持たない設定エラー時のオブジェクトも 401 にする', async () => {
    authMock.mockResolvedValue({ message: 'There was a problem with the server configuration.' });
    const response = await requireJevDemoSession();
    expect(response?.status).toBe(401);
  });
});
