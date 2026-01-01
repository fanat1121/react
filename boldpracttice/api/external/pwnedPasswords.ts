import { createHashPrefix, type HashPrefix } from '@/utils/hash';

const PWNED_PASSWORDS_API_BASE_URL = 'https://api.pwnedpasswords.com';

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

export async function checkPasswordPwned(password: string): Promise<boolean> {
  const hashBuffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(password));
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

  const prefix = createHashPrefix(hashHex.slice(0, 5));
  const suffix = hashHex.slice(5);

  const responseText = await fetchPwnedPasswordsByRange(prefix);

  return responseText.split('\n').some(line => {
    const [hashSuffix] = line.split(':');
    return hashSuffix === suffix;
  });
}