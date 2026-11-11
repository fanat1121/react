import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { ProbabilityBars } from './ProbabilityBars';

const meta = {
  title: 'JevDemo/ProbabilityBars',
  component: ProbabilityBars,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProbabilityBars>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'どの技っぽいか',
    items: [
      { label: 'サン', value: 0.62, highlighted: true },
      { label: 'トス', value: 0.25 },
      { label: 'エレベーター', value: 0.13 },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('どの技っぽいか')).toBeInTheDocument();
    expect(canvas.getAllByRole('listitem')).toHaveLength(3);
    expect(canvas.getByText('62%')).toBeInTheDocument();
    expect(canvas.getByTitle('サン: 62%')).toBeInTheDocument();
  },
};

export const WithNoteAndFlag: Story = {
  args: {
    title: '観点ごとの内訳',
    items: [
      { label: '技の動きとの一致', value: 0.48, note: '重み 35%', flagged: true },
      { label: '完遂度', value: 1, note: '重み 15%' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('判断が割れた')).toBeInTheDocument();
    expect(canvas.getByText('重み 35%')).toBeInTheDocument();
    expect(canvas.getByTitle('技の動きとの一致: 48%（重み 35%）')).toBeInTheDocument();
  },
};
