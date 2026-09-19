export type HashPrefix = string & { readonly __brand: 'HashPrefix' };

export function isValidHashPrefix(value: string): value is HashPrefix {
  return /^[A-F0-9]{5}$/.test(value);
}

export function createHashPrefix(value: string): HashPrefix {
  const upperValue = value.toUpperCase();
  if (!isValidHashPrefix(upperValue)) {
    throw new Error('Hash prefix must be exactly 5 uppercase alphanumeric characters (A-F, 0-9)');
  }
  return upperValue as HashPrefix;
}
