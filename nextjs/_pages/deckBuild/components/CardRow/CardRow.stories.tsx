import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within, userEvent } from 'storybook/test';
import { CARDS } from '../../const/cards';
import { CardRow } from './CardRow';

const STRIKE = CARDS[0];
const NON_AGGREGATABLE_CARD = CARDS.find((card) => !card.aggregatable)!;

const meta = {
  title: 'DeckBuild/CardRow',
  component: CardRow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof CardRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    card: STRIKE,
    count: { base: 4, plus: 1 },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(STRIKE.name)).toBeInTheDocument();
    await expect(canvas.queryByText('集計対象外')).not.toBeInTheDocument();

    const [baseIncrement, plusIncrement] = canvas.getAllByRole('button', { name: '＋' });
    const [baseDecrement] = canvas.getAllByRole('button', { name: '−' });

    await userEvent.click(baseIncrement);
    await expect(args.onChange).toHaveBeenLastCalledWith('base', 1);

    await userEvent.click(plusIncrement);
    await expect(args.onChange).toHaveBeenLastCalledWith('plus', 1);

    await userEvent.click(baseDecrement);
    await expect(args.onChange).toHaveBeenLastCalledWith('base', -1);
  },
};

export const NonAggregatable: Story = {
  args: {
    card: NON_AGGREGATABLE_CARD,
    count: { base: 0, plus: 0 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('集計対象外')).toBeInTheDocument();
  },
};
