export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
} as const;

export const BUTTON_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
} as const;

export const BUTTON_ELEMENTS = {
  BUTTON: 'button',
  LINK: 'a',
} as const;

export const BUTTON_TYPES = {
  BUTTON: 'button',
  SUBMIT: 'submit',
  RESET: 'reset',
} as const;

export type ButtonVariant = typeof BUTTON_VARIANTS[keyof typeof BUTTON_VARIANTS];
export type ButtonSize = typeof BUTTON_SIZES[keyof typeof BUTTON_SIZES];
export type ButtonElement = typeof BUTTON_ELEMENTS[keyof typeof BUTTON_ELEMENTS];
export type ButtonType = typeof BUTTON_TYPES[keyof typeof BUTTON_TYPES];
