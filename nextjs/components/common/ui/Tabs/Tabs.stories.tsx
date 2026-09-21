import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within, userEvent } from 'storybook/test';
import { Tabs } from './Tabs';

const TAB_ITEMS = [
  { key: 'profile', label: 'プロフィール', content: <p>プロフィール内容</p> },
  { key: 'settings', label: '設定', content: <p>設定内容</p> },
  { key: 'history', label: '履歴', content: <p>履歴内容</p> },
];

const meta = {
  title: 'Components/Common/UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: TAB_ITEMS,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const firstTab = canvas.getByRole('tab', { name: 'プロフィール' });
    expect(firstTab).toHaveAttribute('aria-selected', 'true');
    expect(canvas.getByRole('tabpanel')).toHaveTextContent('プロフィール内容');
  },
};

export const SwitchTab: Story = {
  args: {
    items: TAB_ITEMS,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const settingsTab = canvas.getByRole('tab', { name: '設定' });
    await userEvent.click(settingsTab);

    expect(settingsTab).toHaveAttribute('aria-selected', 'true');
    expect(canvas.getByRole('tabpanel')).toHaveTextContent('設定内容');
  },
};

export const DefaultActiveKey: Story = {
  args: {
    items: TAB_ITEMS,
    defaultActiveKey: 'history',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('tab', { name: '履歴' })).toHaveAttribute('aria-selected', 'true');
    expect(canvas.getByRole('tabpanel')).toHaveTextContent('履歴内容');
  },
};
