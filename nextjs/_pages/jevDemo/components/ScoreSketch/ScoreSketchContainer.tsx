'use client';

import { useSketchJudge } from '../../hooks/useSketchJudge';
import { ScoreSketch } from './ScoreSketch';
import type { ScoreJudgeResponse } from '../../types';

const SCORE_ENDPOINT = '/api/jev-demo/score';

export const ScoreSketchContainer: React.FC = () => {
  const { canvasRef, hasDrawing, status, errorMessage, result, handleStroke, handleClear, handleJudge } =
    useSketchJudge<ScoreJudgeResponse>(SCORE_ENDPOINT);

  return (
    <ScoreSketch
      canvasRef={canvasRef}
      hasDrawing={hasDrawing}
      status={status}
      errorMessage={errorMessage}
      result={result}
      onStroke={handleStroke}
      onClear={handleClear}
      onJudge={() => handleJudge()}
    />
  );
};
