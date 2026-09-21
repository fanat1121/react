import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within, userEvent } from 'storybook/test';
import { Select } from './Select';
import type { SelectOption } from './Select';

const OPTIONS: SelectOption[] = [
  { value: 'apple', label: 'りんご' },
  { value: 'banana', label: 'バナナ' },
  { value: 'orange', label: 'オレンジ' },
];

const meta = {
  title: 'Components/Common/UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <Select {...args} value={value} onChange={setValue} />;
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'フルーツ',
    options: OPTIONS,
    value: '',
    onChange: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const select = canvas.getByLabelText('フルーツ');
    await userEvent.selectOptions(select, 'banana');
    expect(select).toHaveValue('banana');
  },
};

export const Required: Story = {
  args: {
    label: 'フルーツ',
    options: OPTIONS,
    value: '',
    onChange: () => {},
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByLabelText('フルーツ')).toBeRequired();
  },
};

export const WithError: Story = {
  args: {
    label: 'フルーツ',
    options: OPTIONS,
    value: '',
    onChange: () => {},
    error: '選択してください',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('選択してください')).toBeInTheDocument();
  },
};

export const Disabled: Story = {
  args: {
    label: 'フルーツ',
    options: OPTIONS,
    value: 'apple',
    onChange: () => {},
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByLabelText('フルーツ')).toBeDisabled();
  },
};
