import { JEV_MODEL } from '../const/plausibility';
import { ROUNDNESS_LEVELS, SCORE_INSTRUCTIONS } from '../const/score';
import type { JevRequest, ScoreAnswer, ScoreJudgeResponse, ScoreQuestion } from '../types';

export type ScoreQuestions = { roundness: ScoreQuestion };

/** 手描きの丸がどれだけ円に近いかを Score で聞く */
export function buildScoreRequest(drawing: string): JevRequest<ScoreQuestions> {
  return {
    model: JEV_MODEL,
    state: { drawing },
    questions: {
      roundness: {
        type: 'score',
        instructions: SCORE_INSTRUCTIONS,
        criteria: ROUNDNESS_LEVELS,
      },
    },
  };
}

/** Score の回答を、段階の低い順の内訳に変換する。raw は Jev のレスポンスをそのまま添える */
export function toScoreJudgeResponse(answer: ScoreAnswer, raw: unknown): ScoreJudgeResponse {
  return {
    score: answer.score,
    confidence: answer.confidence,
    // probabilities のキーは段階番号の文字列 ("0", "1", ...)
    levels: ROUNDNESS_LEVELS.map((label, index) => ({
      label,
      probability: answer.probabilities[String(index)] ?? 0,
    })),
    raw,
  };
}
