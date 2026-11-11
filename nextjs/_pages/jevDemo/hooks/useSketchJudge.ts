'use client';

import { useRef, useState } from 'react';
import { fillSketchBackground } from '../components/SketchCanvas/SketchCanvas';

export type SketchJudgeStatus = 'idle' | 'judging' | 'done' | 'error';

const FALLBACK_ERROR_MESSAGE = '判定に失敗しました';

/**
 * キャンバスに描いた絵を PNG にして API Route に送り、結果を持つ
 * 図形判定の各デモ (Choice / Score / Noul / Box) で共通の流れ
 *
 * @param endpoint 送り先の API Route
 */
export function useSketchJudge<TResult>(endpoint: string) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [status, setStatus] = useState<SketchJudgeStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<TResult | null>(null);

  const handleStroke = () => setHasDrawing(true);

  const handleClear = () => {
    if (canvasRef.current) fillSketchBackground(canvasRef.current);
    setHasDrawing(false);
    setStatus('idle');
    setErrorMessage('');
    setResult(null);
  };

  /** @param fields 画像と一緒に送る値 (判定する文や探すものなど) */
  const handleJudge = async (fields: Record<string, string> = {}) => {
    if (!canvasRef.current) return;
    setStatus('judging');
    setErrorMessage('');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drawing: canvasRef.current.toDataURL('image/png'), ...fields }),
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.error?.message ?? FALLBACK_ERROR_MESSAGE);

      setResult(json.data);
      setStatus('done');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : FALLBACK_ERROR_MESSAGE);
      setStatus('error');
    }
  };

  return { canvasRef, hasDrawing, status, errorMessage, result, handleStroke, handleClear, handleJudge };
}
