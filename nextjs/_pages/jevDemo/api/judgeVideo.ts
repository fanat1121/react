import { buildClassifyRequest, buildEvaluateRequest, seedFromFrames } from '../utils/buildJevRequest';
import { computePlausibility } from '../utils/plausibility';
import type { JevClient } from './jevClient';
import type { ExtractedFrames, JudgeResponse, TrickCandidate } from '../types';

/**
 * 2段構成で判定する
 * 1段目: 候補の中からどの技っぽいか (Choice)
 * 2段目: 1位の技について観点ごとに採点し、それらしさを合成する
 */
export async function judgeVideo(
  client: JevClient,
  frames: ExtractedFrames,
  candidates: TrickCandidate[]
): Promise<JudgeResponse> {
  const classify = await client.systemOne(buildClassifyRequest(frames, candidates, seedFromFrames(frames)));
  const { choice, probabilities, confidence } = classify.answers.trick;

  const topTrick = candidates.find((trick) => trick.name === choice) ?? candidates[0];
  const guesses = candidates
    .map((trick) => ({ label: trick.name, probability: probabilities[trick.name] ?? 0 }))
    .sort((a, b) => b.probability - a.probability);

  const evaluate = await client.systemOne(buildEvaluateRequest(frames, topTrick));

  return {
    guesses,
    guessConfidence: confidence,
    topTrick,
    plausibility: computePlausibility(evaluate.answers),
  };
}
