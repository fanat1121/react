import { SHAPE_INSTRUCTIONS, SHAPE_OPTIONS } from '../const/shape';
import { JEV_MODEL } from '../const/plausibility';
import { hashString, shuffleWithSeed } from './buildJevRequest';
import type { ChoiceAnswer, ChoiceQuestion, JevRequest, ShapeJudgeResponse } from '../types';

export type ShapeQuestions = { shape: ChoiceQuestion };

/** 手描きの図形が丸・三角・四角のどれに見えるかを Choice で聞く */
export function buildShapeRequest(drawing: string): JevRequest<ShapeQuestions> {
  // 先に出てくる選択肢を選びやすい傾向があるため、絵ごとに並びを変える
  const ordered = shuffleWithSeed([...SHAPE_OPTIONS], hashString(drawing));

  return {
    model: JEV_MODEL,
    state: { drawing },
    questions: {
      shape: {
        type: 'choice',
        instructions: SHAPE_INSTRUCTIONS,
        criteria: Object.fromEntries(ordered.map((option) => [option.label, option.description])),
      },
    },
  };
}

/** Choice の回答を、表示用の固定順の内訳に変換する。raw は Jev のレスポンスをそのまま添える */
export function toShapeJudgeResponse(answer: ChoiceAnswer, raw: unknown): ShapeJudgeResponse {
  return {
    choice: answer.choice,
    confidence: answer.confidence,
    guesses: SHAPE_OPTIONS.map((option) => ({
      label: option.label,
      probability: answer.probabilities[option.label] ?? 0,
    })),
    raw,
  };
}
