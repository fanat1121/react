import type { AspectKey } from '../types';

export const JEV_MODEL = 'jev-latest';

/** 観点0 (ディアボロ動画か) がこれ未満なら打ち切る */
export const DIABOLO_GATE_THRESHOLD = 0.5;

/** Score の confidence がこれ未満なら「判断が割れている」扱い */
export const LOW_CONFIDENCE_THRESHOLD = 0.4;

/** Noul が 0.5 ± この幅に収まるなら「判断が割れている」扱い */
export const NOUL_UNCERTAIN_MARGIN = 0.15;

/** 段階は「中程度」などの程度表現ではなく、見て判断できる状況で書く (公式推奨) */
export const IS_DIABOLO_CRITERIA = [
  'ディアボロもスティックも映っていない',
  'ディアボロまたはスティックは映っているが、手に持っていない・置いてあるだけ',
  '演者がスティックを両手に持ち、紐の上でディアボロを回転させている',
];

export const MOTION_CRITERIA = [
  'ディアボロは映っているが、技の説明にある動作が見られない',
  '技の説明にある動作の一部（紐の掛け方など）だけが見られる',
  '技の説明の動作がおおむね見られるが、開始か終了の状態が異なる',
  '技の説明どおりの動作で、開始の状態から終了の状態まで遷移している',
];

export const COMPLETION_CRITERIA = [
  '途中でディアボロを落とした、または紐から外れて止まった',
  '途中で崩れたが、落とさずに続けた',
  '最後までディアボロが安定して回り続けた',
];

/** 合成時の重み (合計 1)。観点0 はゲートなので重みを持たない */
export const ASPECT_WEIGHTS: Record<AspectKey, number> = {
  isDiabolo: 0,
  startState: 0.25,
  endState: 0.25,
  motion: 0.35,
  completion: 0.15,
};

export const ASPECT_LABELS: Record<AspectKey, string> = {
  isDiabolo: 'ディアボロ動画か',
  startState: '開始状態の一致',
  endState: '終了状態の一致',
  motion: '技の動きとの一致',
  completion: '完遂度',
};
