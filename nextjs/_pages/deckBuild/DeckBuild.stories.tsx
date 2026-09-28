import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within, userEvent } from 'storybook/test';
import type { UseCounterResult } from '@/hooks/useCounter';
import { CARDS } from './const/cards';
import { COLORLESS_CARDS } from './const/colorlessCards';
import { ANCIENT_CARDS } from './const/ancientCards';
import type { CardCounts, CardData } from './const/types';
import { calculateDeckSummary } from './utils/calculateDeckSummary';
import { DeckBuild } from './DeckBuild';

const createCounter = (value: number): UseCounterResult => ({
  value,
  increment: fn(),
  decrement: fn(),
  incrementBy: fn(),
  decrementBy: fn(),
  reset: fn(),
});

const createZeroCounts = (cards: CardData[]): CardCounts =>
  Object.fromEntries(cards.map((card) => [card.id, { base: 0, plus: 0 }]));

const REGENT_COUNTS: CardCounts = {
  ...createZeroCounts(CARDS),
  'attack-01': { base: 4, plus: 0 },
  'skill-01': { base: 4, plus: 0 },
};
const COLORLESS_COUNTS = createZeroCounts(COLORLESS_CARDS);
const ANCIENT_COUNTS = createZeroCounts(ANCIENT_CARDS);

const SUMMARY = calculateDeckSummary({
  catalogs: [
    { cards: CARDS, counts: REGENT_COUNTS },
    { cards: COLORLESS_CARDS, counts: COLORLESS_COUNTS },
    { cards: ANCIENT_CARDS, counts: ANCIENT_COUNTS },
  ],
  irregularCounts: { attack: 0, skill: 0, power: 0 },
  junkCount: 0,
  totalPowerAdjustment: 0,
  totalBlockAdjustment: 0,
});

const STRIKE = CARDS.find((card) => card.id === 'attack-01')!;

const meta = {
  title: 'DeckBuild/DeckBuild',
  component: DeckBuild,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    summary: SUMMARY,
    searchQuery: '',
    onSearchQueryChange: fn(),
    onResetAll: fn(),
    regent: { counts: REGENT_COUNTS, onChange: fn() },
    colorless: { counts: COLORLESS_COUNTS, onChange: fn() },
    ancient: { counts: ANCIENT_COUNTS, onChange: fn() },
    junk: createCounter(0),
    irregular: {
      attack: createCounter(0),
      skill: createCounter(0),
      power: createCounter(0),
    },
    totalPowerAdjustment: createCounter(0),
    totalBlockAdjustment: createCounter(0),
  },
  render: (args) => {
    const [searchQuery, setSearchQuery] = useState(args.searchQuery);

    return (
      <DeckBuild
        {...args}
        searchQuery={searchQuery}
        onSearchQueryChange={(query) => {
          setSearchQuery(query);
          args.onSearchQueryChange(query);
        }}
      />
    );
  },
} satisfies Meta<typeof DeckBuild>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { name: 'アタック（4枚）' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { name: '無色カード（全クラス共通）' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { name: 'エンシェント入手カード' })).toBeInTheDocument();
  },
};

export const SearchFiltersCards: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByPlaceholderText('カード名・効果で検索'), STRIKE.name);
    await expect(args.onSearchQueryChange).toHaveBeenLastCalledWith(STRIKE.name);

    await expect(canvas.getAllByText(STRIKE.name).length).toBeGreaterThan(0);
    await expect(canvas.queryByText(CARDS.find((card) => card.id === 'skill-01')!.name)).not.toBeInTheDocument();
  },
};
