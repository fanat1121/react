import { createRef } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within, userEvent } from 'storybook/test';
import { SketchJudgeLayout } from './SketchJudgeLayout';
import { SketchResultHero } from './SketchResultHero';

const meta = {
  title: 'JevDemo/SketchJudgeLayout',
  component: SketchJudgeLayout,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    instruction: '何か描く',
    canvasRef: createRef<HTMLCanvasElement>(),
    hasDrawing: true,
    status: 'idle',
    errorMessage: '',
    resultContent: null,
    raw: null,
    onStroke: fn(),
    onClear: fn(),
    onJudge: fn(),
  },
} satisfies Meta<typeof SketchJudgeLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('heading', { name: '1. 何か描く' })).toBeInTheDocument();
    expect(canvas.queryByRole('region', { name: '判定結果' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: '判定する' }));
    expect(args.onJudge).toHaveBeenCalled();
  },
};

/** 描いた絵以外の入力が足りないときは判定できない */
export const CannotJudge: Story = {
  args: { canJudge: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('button', { name: '判定する' })).toBeDisabled();
    expect(canvas.getByRole('button', { name: '消す' })).toBeEnabled();
  },
};

export const WithResult: Story = {
  args: {
    status: 'done',
    resultContent: <SketchResultHero value="82%" label="の確率で正しい" />,
    raw: { model: 'jev-1.13.0' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('region', { name: '判定結果' })).toBeInTheDocument();
    expect(canvas.getByText('82%')).toBeInTheDocument();
    expect(canvas.getByLabelText('Jev のレスポンス')).toHaveTextContent('jev-1.13.0');
  },
};
