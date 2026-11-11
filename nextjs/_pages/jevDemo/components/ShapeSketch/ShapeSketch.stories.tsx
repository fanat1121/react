import { createRef } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within, userEvent } from 'storybook/test';
import { ShapeSketch } from './ShapeSketch';
import type { ShapeJudgeResponse } from '../../types';

const RESULT: ShapeJudgeResponse = {
  choice: '三角',
  confidence: 0.72,
  guesses: [
    { label: '丸', probability: 0.04 },
    { label: '三角', probability: 0.81 },
    { label: '四角', probability: 0.1 },
    { label: 'どれでもない', probability: 0.05 },
  ],
  raw: {
    model: 'jev-1',
    answers: {
      shape: {
        type: 'choice',
        choice: '三角',
        probabilities: { 丸: 0.04, 三角: 0.81, 四角: 0.1, どれでもない: 0.05 },
        confidence: 0.72,
      },
    },
    usage: { input_tokens: 1234, output_tokens: 5 },
  },
};

const meta = {
  title: 'JevDemo/ShapeSketch',
  component: ShapeSketch,
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
} satisfies Meta<typeof ShapeSketch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByLabelText('図形を描くキャンバス')).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: '判定する' })).toBeDisabled();
    expect(canvas.getByRole('button', { name: '消す' })).toBeDisabled();
  },
};

export const Drawn: Story = {
  args: { hasDrawing: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: '判定する' }));
    expect(args.onJudge).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', { name: '消す' }));
    expect(args.onClear).toHaveBeenCalled();
  },
};

export const Judging: Story = {
  args: { hasDrawing: true, status: 'judging' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('button', { name: 'Jev で判定中...' })).toBeDisabled();
    expect(canvas.getByRole('button', { name: '消す' })).toBeDisabled();
  },
};

export const Failed: Story = {
  args: { hasDrawing: true, status: 'error', errorMessage: 'Jev API に接続できませんでした' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('Jev API に接続できませんでした')).toBeInTheDocument();
  },
};

export const Done: Story = {
  args: { hasDrawing: true, status: 'done', result: RESULT },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('「三角」')).toBeInTheDocument();
    expect(canvas.getByText('に見えます（confidence 72%）')).toBeInTheDocument();
    expect(canvas.getByText('図形ごとのそれらしさ')).toBeInTheDocument();
    expect(canvas.getAllByRole('listitem')).toHaveLength(4);
    expect(canvas.getByText('81%')).toBeInTheDocument();
    expect(canvas.getByText('Jev のレスポンス', { selector: 'h3' })).toBeInTheDocument();
    expect(canvas.getByLabelText('Jev のレスポンス')).toHaveTextContent('"input_tokens": 1234');
  },
};
