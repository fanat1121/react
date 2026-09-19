/**
 * SSR安全なlocalStorage読み書きヘルパー。window未定義時（サーバー側レンダリング）は
 * 読み込みでfallbackを返し、書き込みは何もしない。
 */
export function readLocalStorageJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeLocalStorageJSON<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ストレージ容量超過等は無視する（保存できなくても機能自体は継続させる）
  }
}
