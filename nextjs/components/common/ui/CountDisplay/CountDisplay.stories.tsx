import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CountDisplay } from './CountDisplay';

const meta = {
  title: 'Components/Common/UI/CountDisplay',
  component: CountDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CountDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'アタック',
    value: 3,
  },
};

export const WithUnit: Story = {
  args: {
    label: '総パワー数',
    value: 12,
    unit: 'pt',
  },
};

export const Zero: Story = {
  args: {
    label: 'スター消費',
    value: 0,
  },
};
