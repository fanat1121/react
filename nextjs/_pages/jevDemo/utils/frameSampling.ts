// Jev が受け付ける画像サイズ (https://docs.typesafe.ai/images)
// 範囲外はリサイズされず拒否されるので、送る前にこちらで合わせる
const JEV_MIN_SIDE = 280;
const JEV_MAX_SIDE = 1568;

/** 抜き出しフレームの長辺。トークンとリクエストサイズを抑えるため小さめにする */
const TARGET_LONG_SIDE = 640;

const OPENING_RATIOS = [0.05, 0.12];
const ENDING_RATIOS = [0.88, 0.95];
const WHOLE_FRAME_COUNT = 6;
const WHOLE_START_RATIO = 0.1;
const WHOLE_END_RATIO = 0.9;

export type FrameTimes = {
  opening: number[];
  whole: number[];
  ending: number[];
};

/**
 * 動画の長さから、冒頭・全体・末尾それぞれのフレームを抜き出す時刻(秒)を決める
 * @param duration 動画の長さ(秒)
 */
export function pickFrameTimes(duration: number): FrameTimes {
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error('動画の長さを取得できませんでした');
  }

  const step = (WHOLE_END_RATIO - WHOLE_START_RATIO) / (WHOLE_FRAME_COUNT - 1);
  const wholeRatios = Array.from({ length: WHOLE_FRAME_COUNT }, (_, i) => WHOLE_START_RATIO + step * i);

  const toSeconds = (ratio: number) => Math.round(duration * ratio * 1000) / 1000;

  return {
    opening: OPENING_RATIOS.map(toSeconds),
    whole: wholeRatios.map(toSeconds),
    ending: ENDING_RATIOS.map(toSeconds),
  };
}

/**
 * 元動画のサイズから、Jev の制約 (各辺 280〜1568px) を満たす出力サイズを決める
 * 縦横比が極端で制約を満たせない場合は null
 */
export function fitFrameSize(width: number, height: number): { width: number; height: number } | null {
  if (width <= 0 || height <= 0) return null;

  const longSide = Math.max(width, height);
  const shortSide = Math.min(width, height);

  let scale = TARGET_LONG_SIDE / longSide;
  if (shortSide * scale < JEV_MIN_SIDE) {
    scale = JEV_MIN_SIDE / shortSide;
  }

  const result = { width: Math.round(width * scale), height: Math.round(height * scale) };
  const resultLong = Math.max(result.width, result.height);
  const resultShort = Math.min(result.width, result.height);

  if (resultShort < JEV_MIN_SIDE || resultLong > JEV_MAX_SIDE) return null;
  return result;
}
