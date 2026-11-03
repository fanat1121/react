import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { RawResponse } from './RawResponse';

const meta = {
  title: 'JevDemo/RawResponse',
  component: RawResponse,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    value: {
      model: 'jev-1.13.0',
      answers: { statement: { type: 'noul', noul: 0.82 } },
      usage: { input_tokens: 812, output_tokens: 3 },
    },
  },
} satisfies Meta<typeof RawResponse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('heading', { name: 'Jev のレスポンス' })).toBeInTheDocument();
    expect(canvas.getByLabelText('Jev のレスポンス')).toHaveTextContent('"noul": 0.82');
  },
};
