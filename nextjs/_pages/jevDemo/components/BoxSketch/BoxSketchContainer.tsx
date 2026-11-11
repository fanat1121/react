'use client';

import { useState } from 'react';
import { DEFAULT_TARGET } from '../../const/box';
import { useSketchJudge } from '../../hooks/useSketchJudge';
import { BoxSketch } from './BoxSketch';
import type { BoxJudgeResponse } from '../../types';

const BOX_ENDPOINT = '/api/jev-demo/box';

export const BoxSketchContainer: React.FC = () => {
  const [target, setTarget] = useState(DEFAULT_TARGET);
  const { canvasRef, hasDrawing, status, errorMessage, result, handleStroke, handleClear, handleJudge } =
    useSketchJudge<BoxJudgeResponse>(BOX_ENDPOINT);

  return (
    <BoxSketch
      canvasRef={canvasRef}
      hasDrawing={hasDrawing}
      status={status}
      errorMessage={errorMessage}
      target={target}
      result={result}
      onTargetChange={setTarget}
      onStroke={handleStroke}
      onClear={handleClear}
      onJudge={() => handleJudge({ target })}
    />
  );
};
