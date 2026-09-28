import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within, userEvent } from 'storybook/test';
import type { UseCounterResult } from '@/hooks/useCounter';
import { AdjustmentPanel } from './AdjustmentPanel';

const createCounter = (value: number): UseCounterResult => ({
  value,
  increment: fn(),
  decrement: fn(),
  incrementBy: fn(),
  decrementBy: fn(),
  reset: fn(),
});

const meta = {
  title: 'DeckBuild/AdjustmentPanel',
  component: AdjustmentPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdjustmentPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totalPower: 42,
    totalBlock: 25,
    totalPowerAdjustment: createCounter(0),
    totalBlockAdjustment: createCounter(0),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('42')).toBeInTheDocument();

    const [powerBigIncrement] = canvas.getAllByRole('button', { name: '+10' });
    await userEvent.click(powerBigIncrement);
    await expect(args.totalPowerAdjustment.incrementBy).toHaveBeenCalledWith(10);

    const [, blockReset] = canvas.getAllByRole('button', { name: 'リセット' });
    await userEvent.click(blockReset);
    await expect(args.totalBlockAdjustment.reset).toHaveBeenCalledTimes(1);
  },
};
