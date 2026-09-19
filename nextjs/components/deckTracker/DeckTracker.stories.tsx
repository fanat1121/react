import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DeckTracker } from './DeckTracker';

const noopCounter = (value: number) => ({
  value,
  increment: () => {},
  decrement: () => {},
  incrementBy: () => {},
  decrementBy: () => {},
  reset: () => {},
});

const meta = {
  title: 'Components/DeckTracker/DeckTracker',
  component: DeckTracker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DeckTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cardCountCounters: {
      attack: noopCounter(5),
      block: noopCounter(4),
      skill: noopCounter(1),
      power: noopCounter(0),
      starCost: noopCounter(1),
      starGain: noopCounter(1),
      crescentSpearCount: noopCounter(1),
      crescentSpearPlusCount: noopCounter(0),
    },
    totalAmountCounters: {
      attackTotal: noopCounter(32),
      blockTotal: noopCounter(20),
      starCostTotal: noopCounter(2),
      starGainTotal: noopCounter(2),
    },
    onResetAll: () => {},
  },
};

export const AllZero: Story = {
  args: {
    cardCountCounters: {
      attack: noopCounter(0),
      block: noopCounter(0),
      skill: noopCounter(0),
      power: noopCounter(0),
      starCost: noopCounter(0),
      starGain: noopCounter(0),
      crescentSpearCount: noopCounter(0),
      crescentSpearPlusCount: noopCounter(0),
    },
    totalAmountCounters: {
      attackTotal: noopCounter(0),
      blockTotal: noopCounter(0),
      starCostTotal: noopCounter(0),
      starGainTotal: noopCounter(0),
    },
    onResetAll: () => {},
  },
};
