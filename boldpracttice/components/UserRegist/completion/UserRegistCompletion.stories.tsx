import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UserRegistCompletion } from './UserRegistCompletion';

const meta = {
  title: 'UserRegist/Page/Completion',
  component: UserRegistCompletion,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UserRegistCompletion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
