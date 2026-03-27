import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UserRegistInput } from './UserRegistInput';

const meta = {
  title: 'UserRegist/Page/Input',
  component: UserRegistInput,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UserRegistInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
