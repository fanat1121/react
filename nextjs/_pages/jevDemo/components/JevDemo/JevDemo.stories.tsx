import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within, userEvent } from 'storybook/test';
import { JevDemo } from './JevDemo';
import { DEMO_TRICKS } from '../../const/domain';
import type { JudgeResponse } from '../../types';

const FRAME = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

const RESULT: JudgeResponse = {
  guesses: [
    { label: 'サン', probability: 0.7 },
    { label: 'トス', probability: 0.3 },
  ],
  guessConfidence: 0.7,
  topTrick: DEMO_TRICKS[0],
  plausibility: {
    total: 0.66,
    gated: false,
    aspects: [
      { key: 'isDiabolo', label: 'ディアボロ動画か', value: 0.9, weight: 0, uncertain: false },
      { key: 'startState', label: '開始状態の一致', value: 0.7, weight: 0.25, uncertain: false },
      { key: 'endState', label: '終了状態の一致', value: 0.6, weight: 0.25, uncertain: false },
      { key: 'motion', label: '技の動きとの一致', value: 0.7, weight: 0.35, uncertain: false },
      { key: 'completion', label: '完遂度', value: 0.6, weight: 0.15, uncertain: false },
    ],
  },
};

const meta = {
  title: 'JevDemo/JevDemo',
  component: JevDemo,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    candidates: DEMO_TRICKS,
    isFallbackCandidates: false,
    videoUrl: null,
    status: 'idle',
    errorMessage: '',
    framePreviews: [],
    result: null,
    onFileChange: fn(),
    onJudge: fn(),
  },
} satisfies Meta<typeof JevDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('button', { name: 'それらしさを判定' })).toBeDisabled();
    expect(canvas.getByText(/技マスタより/)).toBeInTheDocument();

    const file = new File(['dummy'], 'sun.mp4', { type: 'video/mp4' });
    await userEvent.upload(canvas.getByLabelText('ディアボロの動画ファイル'), file);
    expect(args.onFileChange).toHaveBeenCalledWith(file);
  },
};

export const Ready: Story = {
  args: { status: 'ready', isFallbackCandidates: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(/デモ用ダミー/)).toBeInTheDocument();
    const button = canvas.getByRole('button', { name: 'それらしさを判定' });
    expect(button).toBeEnabled();
    await userEvent.click(button);
    expect(args.onJudge).toHaveBeenCalled();
  },
};

export const Judging: Story = {
  args: { status: 'judging', framePreviews: [FRAME, FRAME, FRAME] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('button', { name: 'Jev で判定中...' })).toBeDisabled();
    expect(canvas.getAllByRole('img')).toHaveLength(3);
  },
};

export const Failed: Story = {
  args: { status: 'error', errorMessage: '動画を読み込めませんでした' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('動画を読み込めませんでした')).toBeInTheDocument();
  },
};

export const Done: Story = {
  args: { status: 'done', result: RESULT },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('heading', { name: '3. 結果' })).toBeInTheDocument();
    expect(canvas.getByText('66%')).toBeInTheDocument();
  },
};
