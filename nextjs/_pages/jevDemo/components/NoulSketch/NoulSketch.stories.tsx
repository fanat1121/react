import { createRef } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within, userEvent } from 'storybook/test';
import { NoulSketch } from './NoulSketch';
import { DEFAULT_STATEMENT } from '../../const/noul';
import type { NoulJudgeResponse } from '../../types';

const RESULT: NoulJudgeResponse = {
  statement: DEFAULT_STATEMENT,
  noul: 0.82,
  raw: {
    model: 'jev-1.13.0',
    answers: { statement: { type: 'noul', noul: 0.82 } },
    usage: { input_tokens: 812, output_tokens: 3 },
  },
};

const meta = {
  title: 'JevDemo/NoulSketch',
  component: NoulSketch,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    canvasRef: createRef<HTMLCanvasElement>(),
    hasDrawing: true,
    status: 'idle',
    errorMessage: '',
    statement: DEFAULT_STATEMENT,
    result: null,
    onStatementChange: fn(),
    onStroke: fn(),
    onClear: fn(),
    onJudge: fn(),
  },
} satisfies Meta<typeof NoulSketch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Drawn: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('判定する文');

    expect(input).toHaveValue(DEFAULT_STATEMENT);
    await userEvent.type(input, '。');
    expect(args.onStatementChange).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', { name: '判定する' }));
    expect(args.onJudge).toHaveBeenCalled();
  },
};

/** 文が空のときは判定できない */
export const EmptyStatement: Story = {
  args: { statement: '  ' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('button', { name: '判定する' })).toBeDisabled();
  },
};

export const Done: Story = {
  args: { status: 'done', result: RESULT },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(`の確率で「${DEFAULT_STATEMENT}」は正しい`)).toBeInTheDocument();
    expect(canvas.getAllByText('82%').length).toBeGreaterThan(0);
    expect(canvas.getByText('18%')).toBeInTheDocument();
    expect(canvas.queryByText('判断が割れた')).not.toBeInTheDocument();
  },
};

/** yes が 0.5 付近なら「判断が割れた」を付ける */
export const Uncertain: Story = {
  args: { status: 'done', result: { ...RESULT, noul: 0.55 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('判断が割れた')).toBeInTheDocument();
  },
};
