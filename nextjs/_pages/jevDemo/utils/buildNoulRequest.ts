import { NOUL_INSTRUCTIONS_PREFIX } from '../const/noul';
import { JEV_MODEL } from '../const/plausibility';
import type { JevRequest, NoulAnswer, NoulJudgeResponse, NoulQuestion } from '../types';

export type NoulQuestions = { statement: NoulQuestion };

/** 手描きの絵について、ユーザーが入力した文が正しいかを Noul で聞く */
export function buildNoulRequest(drawing: string, statement: string): JevRequest<NoulQuestions> {
  return {
    model: JEV_MODEL,
    state: { drawing },
    questions: {
      statement: {
        type: 'noul',
        instructions: `${NOUL_INSTRUCTIONS_PREFIX}${statement}`,
      },
    },
  };
}

/** Noul の回答を表示用にする。raw は Jev のレスポンスをそのまま添える */
export function toNoulJudgeResponse(statement: string, answer: NoulAnswer, raw: unknown): NoulJudgeResponse {
  return { statement, noul: answer.noul, raw };
}
