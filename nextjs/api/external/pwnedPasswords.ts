import type { HashPrefix } from '@/utils/hash';

const PWNED_PASSWORDS_API_BASE_URL = 'https://api.pwnedpasswords.com';

/**
 * Pwned Passwords APIへのfetch処理
 * @param hashPrefix 5文字のハッシュプレフィックス
 * @returns ハッシュサフィックスの一覧（改行区切り）
 */
export async function fetchPwnedPasswordsByRange(hashPrefix: HashPrefix): Promise<string> {
  const url = `${PWNED_PASSWORDS_API_BASE_URL}/range/${hashPrefix}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'BoldPractice-UserRegistration',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from Pwned Passwords API: ${response.status} ${response.statusText}`);
  }

  return response.text();
}