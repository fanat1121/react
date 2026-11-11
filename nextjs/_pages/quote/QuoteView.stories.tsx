import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { QuoteView } from './QuoteView';

const meta = {
  title: 'Quote/QuoteView',
  component: QuoteView,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    quote: { meigen: '継続は力なり', auther: '住岡夜晃' },
  },
} satisfies Meta<typeof QuoteView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('本日の名言')).toBeInTheDocument();
    expect(canvas.getByText('"継続は力なり"')).toBeInTheDocument();
    expect(canvas.getByText('— 住岡夜晃')).toBeInTheDocument();
    expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
  },
};

export const WithoutAuthor: Story = {
  args: { quote: { meigen: '継続は力なり', auther: '' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('— 作者不明')).toBeInTheDocument();
  },
};

export const Error: Story = {
  args: { quote: null, errorMessage: '名言の取得に失敗しました。' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 失敗時も同じカード（見出し付き）の中にメッセージを出す
    expect(canvas.getByText('本日の名言')).toBeInTheDocument();
    expect(canvas.getByRole('alert')).toHaveTextContent('名言を取得できませんでした: 名言の取得に失敗しました。');
  },
};
