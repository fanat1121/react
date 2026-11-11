import { EQUIPMENT_DEFINITION, GLOSSARY } from '../const/domain';
import { COMPLETION_CRITERIA, IS_DIABOLO_CRITERIA, JEV_MODEL, MOTION_CRITERIA } from '../const/plausibility';
import type { ChoiceQuestion, ExtractedFrames, JevRequest, NoulQuestion, ScoreQuestion, TrickCandidate } from '../types';

export type ClassifyQuestions = { trick: ChoiceQuestion };

export type EvaluateQuestions = {
  isDiabolo: ScoreQuestion;
  startState: NoulQuestion;
  endState: NoulQuestion;
  motion: ScoreQuestion;
  completion: ScoreQuestion;
};

/**
 * 判定対象のテキストに出てくる用語だけを用語集から抜き出す
 * (無関係な情報が多い state は精度が落ちるため)
 */
export function pickRelevantTerms(glossary: Record<string, string>, texts: string[]): Record<string, string> {
  const joined = texts.join('\n');
  return Object.fromEntries(Object.entries(glossary).filter(([term]) => joined.includes(term)));
}

/**
 * シード付きで配列をシャッフルする
 * Jev は先に出てくる選択肢を選びやすい傾向があるため、候補の順序を固定しない
 */
export function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const result = [...items];
  let state = seed >>> 0 || 1;
  const next = () => {
    // xorshift32
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * フレームの内容からシードを作る (FNV-1a)
 * 同じ動画なら候補の並びも同じになり、結果を再現できる
 */
export function seedFromFrames(frames: ExtractedFrames): number {
  return hashString(frames.whole.join(''));
}

/** 文字列からシードを作る (FNV-1a) */
export function hashString(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function trickTexts(trick: TrickCandidate): string[] {
  return [trick.name, trick.categoryName, trick.description ?? '', trick.startStateName, trick.endStateName];
}

function describeTrick(trick: TrickCandidate) {
  return {
    name: trick.name,
    category: trick.categoryName,
    description: trick.description ?? '',
    start_state: trick.startStateName,
    end_state: trick.endStateName,
  };
}

/** 1段目: 候補の中からどの技っぽいかを Choice で聞く */
export function buildClassifyRequest(
  frames: ExtractedFrames,
  candidates: TrickCandidate[],
  seed: number
): JevRequest<ClassifyQuestions> {
  const ordered = shuffleWithSeed(candidates, seed);

  return {
    model: JEV_MODEL,
    state: {
      domain: {
        equipment: EQUIPMENT_DEFINITION,
        terms: pickRelevantTerms(GLOSSARY, candidates.flatMap(trickTexts)),
      },
      frames: { whole: frames.whole },
    },
    questions: {
      trick: {
        type: 'choice',
        instructions: 'state.frames.whole は1本の動画から時間順に抜き出したフレームです。この動画で演じられている技はどれですか',
        criteria: Object.fromEntries(
          ordered.map((trick) => [trick.name, `${trick.categoryName}：${trick.description ?? ''}`])
        ),
      },
    },
  };
}

/** 2段目: 1位の技について観点ごとに採点する */
export function buildEvaluateRequest(frames: ExtractedFrames, trick: TrickCandidate): JevRequest<EvaluateQuestions> {
  return {
    model: JEV_MODEL,
    state: {
      domain: {
        equipment: EQUIPMENT_DEFINITION,
        terms: pickRelevantTerms(GLOSSARY, trickTexts(trick)),
      },
      target_trick: describeTrick(trick),
      frames,
    },
    questions: {
      isDiabolo: {
        type: 'score',
        instructions: 'state.frames.whole の映像は、ディアボロを操作している映像としてどの段階にあたりますか',
        criteria: IS_DIABOLO_CRITERIA,
      },
      startState: {
        type: 'noul',
        instructions: `state.frames.opening の時点で、ディアボロは「${trick.startStateName}」の状態である`,
      },
      endState: {
        type: 'noul',
        instructions: `state.frames.ending の時点で、ディアボロは「${trick.endStateName}」の状態である`,
      },
      motion: {
        type: 'score',
        instructions: 'state.frames.whole の動きは、state.target_trick の説明とどの程度一致していますか',
        criteria: MOTION_CRITERIA,
      },
      completion: {
        type: 'score',
        instructions: 'state.frames.whole を通して、技はどこまで成立していますか',
        criteria: COMPLETION_CRITERIA,
      },
    },
  };
}
