// -----------------------------------
// Jev (TypeSafe AI System One) の型
// 参照: https://docs.typesafe.ai/primitives
// 質問・回答の形は @typesafe-ai/sdk の型に合わせている。画像は data URL のまま持ち、送信時に SDK の Image に変換する
// -----------------------------------

export type ChoiceQuestion = {
  type: 'choice';
  instructions: string;
  criteria: Record<string, string | null>;
};

export type ScoreQuestion = {
  type: 'score';
  instructions: string;
  criteria: string[];
};

export type NoulQuestion = {
  type: 'noul';
  instructions: string;
};

/** 画像の中で instructions が指すものの位置を聞く (画像と同じく試験的な機能) */
export type BoxQuestion = {
  type: 'box';
  instructions: string;
};

export type JevQuestion = ChoiceQuestion | ScoreQuestion | NoulQuestion | BoxQuestion;

export type ChoiceAnswer = {
  type: 'choice';
  choice: string;
  probabilities: Record<string, number>;
  confidence: number;
};

export type ScoreAnswer = {
  type: 'score';
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
};

export type NoulAnswer = {
  type: 'noul';
  noul: number;
};

/** 各辺の位置。画像の高さ (top・bottom) と幅 (left・right) に対する割合で 0〜1 */
export type BoxCoordinates = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type BoxAnswer = {
  type: 'box';
  box: BoxCoordinates;
  /** API が返さなかったときは null */
  confidence: number | null;
};

export type JevAnswer = ChoiceAnswer | ScoreAnswer | NoulAnswer | BoxAnswer;

export type JevRequest<Q extends Record<string, JevQuestion>> = {
  model: string;
  state: Record<string, unknown>;
  questions: Q;
};

export type JevResponse<Q extends Record<string, JevQuestion>> = {
  model: string;
  answers: {
    [K in keyof Q]: Q[K] extends ChoiceQuestion
      ? ChoiceAnswer
      : Q[K] extends ScoreQuestion
        ? ScoreAnswer
        : Q[K] extends BoxQuestion
          ? BoxAnswer
          : NoulAnswer;
  };
  /** SDK が返したレスポンスそのまま (usage なども含む)。画面での確認用 */
  raw: unknown;
};

// -----------------------------------
// デモの型
// -----------------------------------

export type TrickCandidate = {
  id: number;
  name: string;
  categoryName: string;
  description?: string;
  startStateName: string;
  endStateName: string;
};

/** 動画から抜き出したフレーム (JPEG の data URL) */
export type ExtractedFrames = {
  opening: string[];
  whole: string[];
  ending: string[];
};

export type AspectKey = 'isDiabolo' | 'startState' | 'endState' | 'motion' | 'completion';

export type AspectResult = {
  key: AspectKey;
  label: string;
  /** 0〜1 に正規化した値 */
  value: number;
  weight: number;
  /** 判断が割れている (confidence が低い / noul が 0.5 付近) */
  uncertain: boolean;
};

export type PlausibilityResult = {
  /** 0〜1。gated のときは 0 */
  total: number;
  /** ディアボロ動画ではないと判定して打ち切った */
  gated: boolean;
  aspects: AspectResult[];
};

export type TrickGuess = {
  label: string;
  probability: number;
};

export type ShapeJudgeResponse = {
  choice: string;
  confidence: number;
  /** 表示用の固定順 (丸・三角・四角・どれでもない) */
  guesses: TrickGuess[];
  /** Jev が返したレスポンスそのまま */
  raw: unknown;
};

export type ScoreLevelResult = {
  label: string;
  probability: number;
};

export type ScoreJudgeResponse = {
  /** 段階番号の確率加重平均。段階の間の値にもなる */
  score: number;
  confidence: number;
  /** 段階の低い順 */
  levels: ScoreLevelResult[];
  /** Jev が返したレスポンスそのまま */
  raw: unknown;
};

export type NoulJudgeResponse = {
  /** 判定した文 */
  statement: string;
  /** 文が正しい (yes) 確率 */
  noul: number;
  /** Jev が返したレスポンスそのまま */
  raw: unknown;
};

export type BoxJudgeResponse = {
  /** 探したもの */
  target: string;
  box: BoxCoordinates;
  confidence: number | null;
  /** Jev が返したレスポンスそのまま */
  raw: unknown;
};

export type JudgeResponse = {
  guesses: TrickGuess[];
  guessConfidence: number;
  topTrick: TrickCandidate;
  plausibility: PlausibilityResult;
};
