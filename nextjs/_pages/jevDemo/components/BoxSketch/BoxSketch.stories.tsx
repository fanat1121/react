import { createRef } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within, userEvent } from 'storybook/test';
import { BoxSketch } from './BoxSketch';
import { DEFAULT_TARGET } from '../../const/box';
import type { BoxJudgeResponse } from '../../types';

const BOX = { top: 0.1, bottom: 0.45, left: 0.55, right: 0.9 };

const RESULT: BoxJudgeResponse = {
  target: DEFAULT_TARGET,
  box: BOX,
  confidence: 0.88,
  raw: {
    model: 'jev-1.13.0',
    answers: { location: { type: 'box', box: BOX, confidence: 0.88 } },
    usage: { input_tokens: 815, output_tokens: 6 },
  },
};

const meta = {
  title: 'JevDemo/BoxSketch',
  component: BoxSketch,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    canvasRef: createRef<HTMLCanvasElement>(),
    hasDrawing: true,
    status: 'idle',
    errorMessage: '',
    target: DEFAULT_TARGET,
    result: null,
    onTargetChange: fn(),
    onStroke: fn(),
    onClear: fn(),
    onJudge: fn(),
  },
} satisfies Meta<typeof BoxSketch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Drawn: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('探すもの');

    expect(input).toHaveValue(DEFAULT_TARGET);
    await userEvent.type(input, 'と丸');
    expect(args.onTargetChange).toHaveBeenCalled();
    expect(canvas.queryByRole('img', { name: '見つかった範囲' })).not.toBeInTheDocument();
  },
};

/** 探すものが空のときは判定できない */
export const EmptyTarget: Story = {
  args: { target: '' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('button', { name: '判定する' })).toBeDisabled();
  },
};

export const Done: Story = {
  args: { status: 'done', result: RESULT },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('img', { name: '見つかった範囲' })).toHaveStyle({ top: '10%', left: '55%' });
    expect(canvas.getByText('はキャンバスの枠の位置（confidence 88%）')).toBeInTheDocument();
    expect(canvas.getByLabelText('枠の位置')).toHaveTextContent('上端10%下端45%左端55%右端90%');
  },
};

/** confidence が返らなかったとき */
export const NoConfidence: Story = {
  args: { status: 'done', result: { ...RESULT, confidence: null } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('はキャンバスの枠の位置（confidence 未報告）')).toBeInTheDocument();
  },
};
