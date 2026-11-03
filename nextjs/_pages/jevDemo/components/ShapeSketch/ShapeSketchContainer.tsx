'use client';

import { useSketchJudge } from '../../hooks/useSketchJudge';
import { ShapeSketch } from './ShapeSketch';
import type { ShapeJudgeResponse } from '../../types';

const SHAPE_ENDPOINT = '/api/jev-demo/shape';

export const ShapeSketchContainer: React.FC = () => {
  const { canvasRef, hasDrawing, status, errorMessage, result, handleStroke, handleClear, handleJudge } =
    useSketchJudge<ShapeJudgeResponse>(SHAPE_ENDPOINT);

  return (
    <ShapeSketch
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
