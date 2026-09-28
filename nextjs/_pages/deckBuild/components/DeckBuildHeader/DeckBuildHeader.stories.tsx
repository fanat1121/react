import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within, userEvent } from 'storybook/test';
import { DeckBuildHeader } from './DeckBuildHeader';

const meta = {
  title: 'DeckBuild/DeckBuildHeader',
  component: DeckBuildHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    searchQuery: '',
    onSearchQueryChange: fn(),
    onResetAll: fn(),
  },
} satisfies Meta<typeof DeckBuildHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByPlaceholderText('カード名・効果で検索'), '星');
    await expect(args.onSearchQueryChange).toHaveBeenLastCalledWith('星');

    await userEvent.click(canvas.getByRole('button', { name: '全項目リセット' }));
    await expect(args.onResetAll).toHaveBeenCalledTimes(1);
  },
};

export const WithSearchQuery: Story = {
  args: {
    searchQuery: 'ストライク',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByPlaceholderText('カード名・効果で検索')).toHaveValue('ストライク');
  },
};
