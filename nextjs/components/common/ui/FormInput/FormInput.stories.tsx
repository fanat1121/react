import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within, userEvent } from 'storybook/test';
import { FormInput } from './FormInput';

const meta = {
  title: 'Components/Common/UI/FormInput',
  component: FormInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <FormInput {...args} value={value} onChange={setValue} />;
  },
} satisfies Meta<typeof FormInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'メールアドレス',
    value: '',
    onChange: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText('メールアドレス');
    await userEvent.type(input, 'test@example.com');
    expect(input).toHaveValue('test@example.com');
  },
};

export const WithError: Story = {
  args: {
    label: 'メールアドレス',
    value: 'invalid-email',
    onChange: () => {},
    errorMessages: ['有効なメールアドレスを入力してください'],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument();
  },
};

export const Password: Story = {
  args: {
    label: 'パスワード',
    value: '',
    onChange: () => {},
    inputType: 'password',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText('パスワード');
    expect(input).toHaveAttribute('type', 'password');

    const toggleButton = canvas.getByRole('button', { name: 'パスワードを表示する' });
    await userEvent.click(toggleButton);

    expect(input).toHaveAttribute('type', 'text');
    expect(canvas.getByRole('button', { name: 'パスワードを隠す' })).toBeInTheDocument();
  },
};
