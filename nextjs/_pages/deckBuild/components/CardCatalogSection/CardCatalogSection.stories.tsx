import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within, userEvent } from 'storybook/test';
import type { CardCounts, CardData } from '../../const/types';
import { CARDS } from '../../const/cards';
import { CardCatalogSection } from './CardCatalogSection';

const ATTACK_CARD = CARDS.find((card) => card.type === 'attack')!;
const SKILL_CARD = CARDS.find((card) => card.type === 'skill')!;
const SAMPLE_CARDS: CardData[] = [ATTACK_CARD, SKILL_CARD];

const SAMPLE_COUNTS: CardCounts = {
  [ATTACK_CARD.id]: { base: 4, plus: 0 },
  [SKILL_CARD.id]: { base: 2, plus: 1 },
};

const meta = {
  title: 'DeckBuild/CardCatalogSection',
  component: CardCatalogSection,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    cards: SAMPLE_CARDS,
    counts: SAMPLE_COUNTS,
    onChange: fn(),
  },
} satisfies Meta<typeof CardCatalogSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTypeCount: Story = {
  args: {
    countByType: { attack: 4, skill: 3, power: 0 },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { name: 'アタック（4枚）' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { name: 'パワー（0枚）' })).toBeInTheDocument();

    const [attackBaseIncrement] = canvas.getAllByRole('button', { name: '＋' });
    await userEvent.click(attackBaseIncrement);
    await expect(args.onChange).toHaveBeenLastCalledWith(ATTACK_CARD.id, 'base', 1);
  },
};

export const WithHeading: Story = {
  args: {
    heading: '無色カード（全クラス共通）',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { level: 2, name: '無色カード（全クラス共通）' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { name: 'アタック' })).toBeInTheDocument();
  },
};

export const HideEmptyTypes: Story = {
  args: {
    heading: 'エンシェント入手カード',
    hideEmptyTypes: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { name: 'スキル' })).toBeInTheDocument();
    await expect(canvas.queryByRole('heading', { name: 'パワー' })).not.toBeInTheDocument();
  },
};
