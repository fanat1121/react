export const INPUT_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  TEL: 'tel',
  URL: 'url',
  DATE: 'date',
} as const;

export const INPUT_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
} as const;

export type InputType = typeof INPUT_TYPES[keyof typeof INPUT_TYPES];
export type InputSize = typeof INPUT_SIZES[keyof typeof INPUT_SIZES];
