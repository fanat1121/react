import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchRandomNekoImage } from '../fetchRandomNekoImage';

const validBody = {
  id: 'abc',
  url: 'https://cdn.nekosapi.com/nekos-api/images/original/abc.webp',
  rating: 'safe',
  artist_name: null,
  source_url: 'https://example.com/source',
  tags: [{ name: 'Girl' }],
};

const respond = (body: unknown, init: { status?: number } = {}) =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status: init.status ?? 200 }));

describe('fetchRandomNekoImage', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('表示対象の画像なら返す', async () => {
    vi.stubGlobal('fetch', respond(validBody));
    expect(await fetchRandomNekoImage(['safe'])).toMatchObject({ id: 'abc', rating: 'safe' });
  });

  it('rating をクエリに付けて呼ぶ', async () => {
    const fetchMock = respond(validBody);
    vi.stubGlobal('fetch', fetchMock);
    await fetchRandomNekoImage(['safe', 'suggestive']);
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.nekosapi.com/v5/images/random?rating=safe&rating=suggestive');
  });

  it('返ってきた rating が表示対象外なら null', async () => {
    vi.stubGlobal('fetch', respond({ ...validBody, rating: 'borderline' }));
    expect(await fetchRandomNekoImage(['safe'])).toBeNull();
  });

  it('HTTP エラーなら null', async () => {
    vi.stubGlobal('fetch', respond({}, { status: 503 }));
    expect(await fetchRandomNekoImage(['safe'])).toBeNull();
  });

  it('通信に失敗したら null', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')));
    expect(await fetchRandomNekoImage(['safe'])).toBeNull();
  });

  it('画像 URL が https でなければ null', async () => {
    vi.stubGlobal('fetch', respond({ ...validBody, url: 'http://cdn.nekosapi.com/a.webp' }));
    expect(await fetchRandomNekoImage(['safe'])).toBeNull();
  });

  it.each(['javascript:alert(1)', 'data:text/html,x'])('出典 URL が %s なら null', async (sourceUrl) => {
    vi.stubGlobal('fetch', respond({ ...validBody, source_url: sourceUrl }));
    expect(await fetchRandomNekoImage(['safe'])).toBeNull();
  });

  it('出典 URL が無くても画像は返す', async () => {
    vi.stubGlobal('fetch', respond({ ...validBody, source_url: null }));
    expect(await fetchRandomNekoImage(['safe'])).toMatchObject({ source_url: null });
  });
});
