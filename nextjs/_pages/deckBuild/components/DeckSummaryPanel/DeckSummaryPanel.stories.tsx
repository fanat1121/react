import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import type { DeckBuildSummary } from '../../const/types';
import { DeckSummaryPanel } from './DeckSummaryPanel';

const SAMPLE_SUMMARY: DeckBuildSummary = {
  totalCardCount: 10,
  totalDeckCount: 12,
  countByType: { attack: 5, skill: 5, power: 0 },
  blockSkillCount: 4,
  nonBlockSkillCount: 1,
  totalPower: 33,
  totalBlock: 20,
  totalStarCost: 2,
  totalStarGain: 3,
  totalEnergyCost: 10,
  starCostCardCount: 1,
  starGainCardCount: 2,
  crescentSpearPower: 10,
  crescentSpearPlusPower: 11,
  averageAttackPower: 6.66,
  averageBlock: 5,
  averageStarCost: 0.2,
  averageStarGain: 0.3,
  averageEnergyCost: 1,
};

const meta = {
  title: 'DeckBuild/DeckSummaryPanel',
  component: DeckSummaryPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DeckSummaryPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    summary: SAMPLE_SUMMARY,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('デッキ総数（ごみ札込み）')).toBeInTheDocument();
    await expect(canvas.getByText('12枚')).toBeInTheDocument();
    // 平均値は小数第1位までに丸める
    await expect(canvas.getByText('6.7')).toBeInTheDocument();
  },
};
