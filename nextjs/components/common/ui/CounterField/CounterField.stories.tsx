import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CounterField } from './CounterField';

const meta = {
  title: 'Components/Common/UI/CounterField',
  component: CounterField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CounterField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'アタック',
    value: 2,
    onIncrement: () => {},
    onDecrement: () => {},
    onReset: () => {},
  },
};

export const WithoutReset: Story = {
  args: {
    label: 'スキル',
    value: 1,
    onIncrement: () => {},
    onDecrement: () => {},
  },
};

export const WithUnit: Story = {
  args: {
    label: '総パワー数',
    value: 8,
    unit: 'pt',
    onIncrement: () => {},
    onDecrement: () => {},
    onReset: () => {},
  },
};

export const WithBigStep: Story = {
  args: {
    label: 'アタック総値',
    value: 24,
    accentColor: '#e07a5f',
    bigStep: 10,
    onIncrement: () => {},
    onDecrement: () => {},
    onIncrementBy: () => {},
    onDecrementBy: () => {},
    onReset: () => {},
  },
};
