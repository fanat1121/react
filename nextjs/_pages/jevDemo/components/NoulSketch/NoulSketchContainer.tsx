'use client';

import { useState } from 'react';
import { DEFAULT_STATEMENT } from '../../const/noul';
import { useSketchJudge } from '../../hooks/useSketchJudge';
import { NoulSketch } from './NoulSketch';
import type { NoulJudgeResponse } from '../../types';

const NOUL_ENDPOINT = '/api/jev-demo/noul';

export const NoulSketchContainer: React.FC = () => {
  const [statement, setStatement] = useState(DEFAULT_STATEMENT);
  const { canvasRef, hasDrawing, status, errorMessage, result, handleStroke, handleClear, handleJudge } =
    useSketchJudge<NoulJudgeResponse>(NOUL_ENDPOINT);

  return (
    <NoulSketch
      canvasRef={canvasRef}
      hasDrawing={hasDrawing}
      status={status}
      errorMessage={errorMessage}
      statement={statement}
      result={result}
      onStatementChange={setStatement}
      onStroke={handleStroke}
      onClear={handleClear}
      onJudge={() => handleJudge({ statement })}
    />
  );
};
