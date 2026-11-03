'use client';

import { useEffect, useRef } from 'react';
import {
  SKETCH_BACKGROUND_COLOR,
  SKETCH_SIZE,
  SKETCH_STROKE_COLOR,
  SKETCH_STROKE_WIDTH,
} from '../../const/shape';
import { toPercent } from '../../utils/percent';
import styles from './SketchCanvas.module.scss';
import type { BoxCoordinates } from '../../types';

type SketchCanvasProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** 1画ぶん描き終えたとき */
  onStroke: () => void;
  disabled?: boolean;
  /** キャンバスの上に重ねて表示する枠 (Box の回答) */
  box?: BoxCoordinates | null;
};

/**
 * キャンバスを白で塗りつぶす
 * 透明のまま PNG にすると背景が黒く見えることがあるため、描く前に必ず塗っておく
 */
export function fillSketchBackground(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d');
  if (!context) return;
  context.fillStyle = SKETCH_BACKGROUND_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

export const SketchCanvas: React.FC<SketchCanvasProps> = ({ canvasRef, onStroke, disabled = false, box = null }) => {
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (canvasRef.current) fillSketchBackground(canvasRef.current);
  }, [canvasRef]);

  /** 表示サイズとキャンバスの解像度が違っても、指した位置に描けるよう換算する */
  const toCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * SKETCH_SIZE,
      y: ((e.clientY - rect.top) / rect.height) * SKETCH_SIZE,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    const context = e.currentTarget.getContext('2d');
    if (!context) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;

    const { x, y } = toCanvasPoint(e);
    context.strokeStyle = SKETCH_STROKE_COLOR;
    context.lineWidth = SKETCH_STROKE_WIDTH;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const context = e.currentTarget.getContext('2d');
    if (!context) return;

    const { x, y } = toCanvasPoint(e);
    context.lineTo(x, y);
    context.stroke();
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    onStroke();
  };

  return (
    <div className={styles.frame}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width={SKETCH_SIZE}
        height={SKETCH_SIZE}
        aria-label="図形を描くキャンバス"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      {box && (
        // Box の座標は画像に対する割合なので、表示サイズが変わってもそのままパーセントで重ねられる
        <div
          className={styles.box}
          role="img"
          aria-label="見つかった範囲"
          style={{
            top: toPercent(box.top),
            left: toPercent(box.left),
            width: toPercent(box.right - box.left),
            height: toPercent(box.bottom - box.top),
          }}
        />
      )}
    </div>
  );
};
