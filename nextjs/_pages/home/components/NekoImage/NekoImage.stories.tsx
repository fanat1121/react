import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { NekoImage } from './NekoImage';

const SAMPLE_IMAGE_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="240" height="240" fill="%23cbd5e1"/></svg>';

const meta = {
  title: 'Home/NekoImage',
  component: NekoImage,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    image: {
      id: 'sample',
      url: SAMPLE_IMAGE_URL,
      rating: 'safe',
      artist_name: 'サンプル作者',
      source_url: 'https://example.com/source',
      tags: [{ name: 'Girl' }, { name: 'School Uniform' }],
    },
  },
} satisfies Meta<typeof NekoImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('本日の一枚')).toBeInTheDocument();
    expect(canvas.getByRole('img', { name: 'Girl、School Uniform' })).toBeInTheDocument();
    expect(canvas.getByText('サンプル作者')).toBeInTheDocument();
    expect(canvas.getByRole('link', { name: '出典' })).toHaveAttribute('href', 'https://example.com/source');
    expect(canvas.getByRole('link', { name: 'Nekos API' })).toHaveAttribute('href', 'https://nekosapi.com');
  },
};

export const WithoutMeta: Story = {
  args: {
    image: { id: 'sample', url: SAMPLE_IMAGE_URL, rating: 'safe', artist_name: null, source_url: null, tags: [] },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('img', { name: 'アニメのイラスト' })).toBeInTheDocument();
    expect(canvas.getByText('作者不明')).toBeInTheDocument();
    expect(canvas.queryByRole('link', { name: '出典' })).not.toBeInTheDocument();
    expect(canvas.getByRole('link', { name: 'Nekos API' })).toBeInTheDocument();
  },
};
