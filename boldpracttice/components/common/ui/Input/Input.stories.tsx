import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from './Input';
import { INPUT_TYPES, INPUT_SIZES } from './const/inputVariants';

const meta = {
  title: 'Components/Common/UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'you@example.com',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'メールアドレス',
    placeholder: 'you@example.com',
    inputType: INPUT_TYPES.EMAIL,
  },
};

export const Required: Story = {
  args: {
    label: 'メールアドレス',
    placeholder: 'you@example.com',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'メールアドレス',
    placeholder: 'you@example.com',
    error: '有効なメールアドレスを入力してください',
    value: 'invalid-email',
  },
};

export const Password: Story = {
  args: {
    label: 'パスワード',
    inputType: INPUT_TYPES.PASSWORD,
    placeholder: '8文字以上',
  },
};

export const Disabled: Story = {
  args: {
    label: 'メールアドレス',
    placeholder: 'you@example.com',
    disabled: true,
    value: 'disabled@example.com',
  },
};

export const Small: Story = {
  args: {
    placeholder: 'Small size',
    size: INPUT_SIZES.SMALL,
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large size',
    size: INPUT_SIZES.LARGE,
  },
};
