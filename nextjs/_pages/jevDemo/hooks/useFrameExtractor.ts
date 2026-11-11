'use client';

import { useCallback } from 'react';
import { fitFrameSize, pickFrameTimes } from '../utils/frameSampling';
import type { ExtractedFrames } from '../types';

const JPEG_QUALITY = 0.8;

function waitForEvent(target: HTMLVideoElement, event: 'loadedmetadata' | 'seeked') {
  return new Promise<void>((resolve, reject) => {
    const onError = () => {
      cleanup();
      reject(new Error('動画を読み込めませんでした'));
    };
    const onDone = () => {
      cleanup();
      resolve();
    };
    const cleanup = () => {
      target.removeEventListener(event, onDone);
      target.removeEventListener('error', onError);
    };
    target.addEventListener(event, onDone);
    target.addEventListener('error', onError);
  });
}

/** 末尾まで強制的にシークさせるための十分大きな時刻 */
const FAR_FUTURE_SECONDS = 1e101;

/**
 * 動画の長さを確定させる
 * MediaRecorder で録った WebM などは長さのメタデータが無く duration が Infinity になるため、
 * 末尾までシークさせてブラウザに長さを計算させる
 */
async function resolveDuration(video: HTMLVideoElement): Promise<number> {
  if (Number.isFinite(video.duration)) return video.duration;

  const seeked = waitForEvent(video, 'seeked');
  video.currentTime = FAR_FUTURE_SECONDS;
  await seeked;
  return video.duration;
}

/**
 * 動画ファイルから判定用のフレームを抜き出す
 * Jev は動画を直接受け付けないため、ブラウザ側で <video> + <canvas> で JPEG にする
 */
export const useFrameExtractor = () => {
  const extractFrames = useCallback(async (file: File): Promise<ExtractedFrames> => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.muted = true;
    video.preload = 'auto';
    video.src = url;

    try {
      await waitForEvent(video, 'loadedmetadata');

      const size = fitFrameSize(video.videoWidth, video.videoHeight);
      if (!size) throw new Error('この縦横比の動画には対応していません');

      const canvas = document.createElement('canvas');
      canvas.width = size.width;
      canvas.height = size.height;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('フレームを描画できませんでした');

      const capture = async (time: number) => {
        const seeked = waitForEvent(video, 'seeked');
        video.currentTime = time;
        await seeked;
        context.drawImage(video, 0, 0, size.width, size.height);
        return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
      };

      const times = pickFrameTimes(await resolveDuration(video));
      const result: ExtractedFrames = { opening: [], whole: [], ending: [] };
      // シークは同時に走らせられないので順番に取る
      for (const section of ['opening', 'whole', 'ending'] as const) {
        for (const time of times[section]) {
          result[section].push(await capture(time));
        }
      }
      return result;
    } finally {
      URL.revokeObjectURL(url);
    }
  }, []);

  return { extractFrames };
};
