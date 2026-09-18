import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UserRegistForm } from './UserRegistForm';

const meta = {
  title: 'UserRegist/Input/UserRegistForm',
  component: UserRegistForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UserRegistForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
