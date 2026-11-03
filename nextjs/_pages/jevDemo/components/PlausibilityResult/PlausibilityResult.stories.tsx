import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { PlausibilityResult } from './PlausibilityResult';
import { DEMO_TRICKS } from '../../const/domain';
import type { JudgeResponse } from '../../types';

const RESULT: JudgeResponse = {
  guesses: [
    { label: 'サン', probability: 0.62 },
    { label: 'トス', probability: 0.25 },
    { label: 'エレベーター', probability: 0.13 },
  ],
  guessConfidence: 0.62,
  topTrick: DEMO_TRICKS[0],
  plausibility: {
    total: 0.78,
    gated: false,
    aspects: [
      { key: 'isDiabolo', label: 'ディアボロ動画か', value: 0.95, weight: 0, uncertain: false },
      { key: 'startState', label: '開始状態の一致', value: 0.9, weight: 0.25, uncertain: false },
      { key: 'endState', label: '終了状態の一致', value: 0.85, weight: 0.25, uncertain: false },
      { key: 'motion', label: '技の動きとの一致', value: 0.7, weight: 0.35, uncertain: false },
      { key: 'completion', label: '完遂度', value: 0.6, weight: 0.15, uncertain: false },
    ],
  },
};

const meta = {
  title: 'JevDemo/PlausibilityResult',
  component: PlausibilityResult,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlausibilityResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { result: RESULT },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('「サン」としてのそれらしさ')).toBeInTheDocument();
    expect(canvas.getByText('78%')).toBeInTheDocument();
    expect(canvas.getByText('どの技っぽいか（confidence 62%）')).toBeInTheDocument();
    expect(canvas.getByText('観点ごとの内訳')).toBeInTheDocument();
    expect(canvas.queryByText(/判定保留/)).not.toBeInTheDocument();
  },
};

export const Uncertain: Story = {
  args: {
    result: {
      ...RESULT,
      plausibility: {
        ...RESULT.plausibility,
        aspects: RESULT.plausibility.aspects.map((aspect) =>
          aspect.key === 'motion' ? { ...aspect, uncertain: true } : aspect
        ),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(/判定保留/)).toBeInTheDocument();
    expect(canvas.getByText('判断が割れた')).toBeInTheDocument();
  },
};

export const Gated: Story = {
  args: {
    result: {
      ...RESULT,
      plausibility: { ...RESULT.plausibility, total: 0, gated: true },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('—')).toBeInTheDocument();
    expect(canvas.getByText(/採点を打ち切りました/)).toBeInTheDocument();
  },
};
