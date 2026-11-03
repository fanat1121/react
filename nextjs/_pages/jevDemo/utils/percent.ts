const PERCENT = 100;

/** 0〜1 の値を「72%」のような表示用の文字列にする */
export const toPercent = (value: number) => `${Math.round(value * PERCENT)}%`;
