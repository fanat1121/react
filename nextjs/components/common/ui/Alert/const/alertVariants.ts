export const ALERT_VARIANTS = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type AlertVariant = typeof ALERT_VARIANTS[keyof typeof ALERT_VARIANTS];
