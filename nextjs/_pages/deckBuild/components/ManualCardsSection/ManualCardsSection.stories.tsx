import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within, userEvent } from 'storybook/test';
import type { UseCounterResult } from '@/hooks/useCounter';
import { ManualCardsSection } from './ManualCardsSection';

const createCounter = (value: number): UseCounterResult => ({
  value,
  increment: fn(),
  decrement: fn(),
  incrementBy: fn(),
  decrementBy: fn(),
  reset: fn(),
});

const meta = {
  title: 'DeckBuild/ManualCardsSection',
  component: ManualCardsSection,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ManualCardsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    junk: createCounter(2),
    irregular: {
      attack: createCounter(1),
      skill: createCounter(0),
      power: createCounter(0),
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('ごみ札')).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { name: 'イレギュラーカード（手動追加）' })).toBeInTheDocument();

    // 並び順: ごみ札 → アタック → スキル → パワー
    const [junkIncrement, attackIncrement] = canvas.getAllByRole('button', { name: '＋' });
    await userEvent.click(junkIncrement);
    await expect(args.junk.increment).toHaveBeenCalledTimes(1);

    await userEvent.click(attackIncrement);
    await expect(args.irregular.attack.increment).toHaveBeenCalledTimes(1);

    // ごみ札にはリセットボタンがなく、イレギュラーカード3種にのみある
    await expect(canvas.getAllByRole('button', { name: 'リセット' })).toHaveLength(3);
  },
};
