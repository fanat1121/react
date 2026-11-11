import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { TopQuoteSection } from './TopQuoteSection';
import { QuoteView } from '@/_pages/quote/QuoteView';
import { NekoImage } from '../NekoImage/NekoImage';

const SAMPLE_IMAGE_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="240" height="240" fill="%23cbd5e1"/></svg>';

const meta = {
  title: 'Home/TopQuoteSection',
  component: TopQuoteSection,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: {
    quote: <QuoteView quote={{ meigen: '継続は力なり', auther: '住岡夜晃' }} />,
    image: (
      <NekoImage
        image={{ id: 'sample', url: SAMPLE_IMAGE_URL, rating: 'safe', artist_name: 'サンプル作者', source_url: null, tags: [{ name: 'Girl' }] }}
      />
    ),
  },
} satisfies Meta<typeof TopQuoteSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const section = canvas.getByTestId('top-quote-section');
    expect(canvas.getByText('本日の名言')).toBeInTheDocument();
    expect(canvas.getByText('本日の一枚')).toBeInTheDocument();
    // 名言と画像カードの2要素が横に並ぶ
    expect(section.children).toHaveLength(2);
  },
};

export const WithoutImage: Story = {
  args: { image: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const section = canvas.getByTestId('top-quote-section');
    expect(canvas.getByText('本日の名言')).toBeInTheDocument();
    expect(canvas.queryByText('本日の一枚')).not.toBeInTheDocument();
    // 画像が無いときは空の列を残さない
    expect(section.children).toHaveLength(1);
  },
};
