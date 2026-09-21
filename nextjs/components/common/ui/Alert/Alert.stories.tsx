import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Alert } from './Alert';
import { ALERT_VARIANTS } from './const/alertVariants';

const meta = {
  title: 'Components/Common/UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    variant: ALERT_VARIANTS.SUCCESS,
    children: '登録が完了しました',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const alert = canvas.getByRole('status');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('登録が完了しました');
  },
};

export const Error: Story = {
  args: {
    variant: ALERT_VARIANTS.ERROR,
    children: 'エラーが発生しました',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const alert = canvas.getByRole('status');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('エラーが発生しました');
  },
};
