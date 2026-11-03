import { createRef } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within } from 'storybook/test';
import { ScoreSketch } from './ScoreSketch';
import { ROUNDNESS_LEVELS } from '../../const/score';
import type { ScoreJudgeResponse } from '../../types';

const PROBABILITIES = [0.02, 0.08, 0.5, 0.4];

const RESULT: ScoreJudgeResponse = {
  score: 2.28,
  confidence: 0.46,
  levels: ROUNDNESS_LEVELS.map((label, index) => ({ label, probability: PROBABILITIES[index] })),
  raw: {
    model: 'jev-1.13.0',
    answers: {
      roundness: {
        type: 'score',
        score: 2.28,
        confidence: 0.46,
        legend: Object.fromEntries(ROUNDNESS_LEVELS.map((label, index) => [String(index), label])),
        probabilities: { '0': 0.02, '1': 0.08, '2': 0.5, '3': 0.4 },
      },
    },
    usage: { input_tokens: 820, output_tokens: 4 },
  },
};

const meta = {
  title: 'JevDemo/ScoreSketch',
  component: ScoreSketch,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    canvasRef: createRef<HTMLCanvasElement>(),
    hasDrawing: false,
    status: 'idle',
    errorMessage: '',
    result: null,
    onStroke: fn(),
    onClear: fn(),
    onJudge: fn(),
  },
} satisfies Meta<typeof ScoreSketch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('heading', { name: '1. できるだけきれいな丸を描く' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: '判定する' })).toBeDisabled();
  },
};

export const Done: Story = {
  args: { hasDrawing: true, status: 'done', result: RESULT },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('2.28')).toBeInTheDocument();
    expect(canvas.getByText('/ 3（confidence 46%）')).toBeInTheDocument();
    // 2.28 は 3段階 (0〜3) のうち 76% の位置
    expect(canvas.getByLabelText('score 2.28')).toHaveStyle({ left: '76%' });
    expect(canvas.getByText('段階ごとの確率')).toBeInTheDocument();
    expect(canvas.getByText('50%')).toBeInTheDocument();
    expect(canvas.getByLabelText('Jev のレスポンス')).toHaveTextContent('"legend"');
  },
};
