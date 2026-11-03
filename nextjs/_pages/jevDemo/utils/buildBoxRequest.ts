import { BOX_INSTRUCTIONS_PREFIX } from '../const/box';
import { JEV_MODEL } from '../const/plausibility';
import type { BoxAnswer, BoxJudgeResponse, BoxQuestion, JevRequest } from '../types';

export type BoxQuestions = { location: BoxQuestion };

/** 手描きの絵の中で、ユーザーが入力したものがどこにあるかを Box で聞く */
export function buildBoxRequest(drawing: string, target: string): JevRequest<BoxQuestions> {
  return {
    model: JEV_MODEL,
    state: { drawing },
    questions: {
      location: {
        type: 'box',
        instructions: `${BOX_INSTRUCTIONS_PREFIX}${target}`,
      },
    },
  };
}

/** Box の回答を表示用にする。raw は Jev のレスポンスをそのまま添える */
export function toBoxJudgeResponse(target: string, answer: BoxAnswer, raw: unknown): BoxJudgeResponse {
  return { target, box: answer.box, confidence: answer.confidence, raw };
}
