'use client';

import { useEffect, useState } from 'react';
import { useFrameExtractor } from '../../hooks/useFrameExtractor';
import { JevDemo } from './JevDemo';
import type { JudgeStatus } from './JevDemo';
import type { JudgeResponse, TrickCandidate } from '../../types';

type JevDemoContainerProps = {
  candidates: TrickCandidate[];
  isFallbackCandidates: boolean;
};

const JUDGE_ENDPOINT = '/api/jev-demo/judge';

export const JevDemoContainer: React.FC<JevDemoContainerProps> = ({ candidates, isFallbackCandidates }) => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<JudgeStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [framePreviews, setFramePreviews] = useState<string[]>([]);
  const [result, setResult] = useState<JudgeResponse | null>(null);

  const { extractFrames } = useFrameExtractor();

  useEffect(() => {
    if (!file) {
      setVideoUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (nextFile: File | null) => {
    setFile(nextFile);
    setStatus(nextFile ? 'ready' : 'idle');
    setErrorMessage('');
    setFramePreviews([]);
    setResult(null);
  };

  const handleJudge = async () => {
    if (!file) return;
    setErrorMessage('');
    setResult(null);

    try {
      setStatus('extracting');
      const frames = await extractFrames(file);
      setFramePreviews(frames.whole);

      setStatus('judging');
      const response = await fetch(JUDGE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frames }),
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.error?.message ?? '判定に失敗しました');

      setResult(json.data);
      setStatus('done');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '判定に失敗しました');
      setStatus('error');
    }
  };

  return (
    <JevDemo
      candidates={candidates}
      isFallbackCandidates={isFallbackCandidates}
      videoUrl={videoUrl}
      status={status}
      errorMessage={errorMessage}
      framePreviews={framePreviews}
      result={result}
      onFileChange={handleFileChange}
      onJudge={handleJudge}
    />
  );
};
