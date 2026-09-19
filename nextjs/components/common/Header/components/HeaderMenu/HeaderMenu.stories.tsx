import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { HeaderMenu } from "./HeaderMenu";
import { MENU_ITEMS } from "./const/menuItems";

const meta = {
  title: "Common/ヘッダー/ヘッダーメニュー",
  component: HeaderMenu,
  decorators: [
    (Story) => (
    // NOTE: story上で見づらいので背景色を設定
      <div style={{ backgroundColor: '#214555', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HeaderMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのヘッダーメニュー表示
 */
export const Default: Story = {
  name: "デフォルト",
  args: {
    items: MENU_ITEMS,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // すべてのメニュー項目が表示されていることを確認
    MENU_ITEMS.forEach((item) => {
      const link = canvas.getByRole('link', { name: item.label });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', item.href);
    });
  },
};

/**
 * カスタムメニュー項目
 */
export const CustomItems: Story = {
  name: "カスタムメニュー",
  args: {
    items: [
      { href: '/custom1', label: 'カスタム1' },
      { href: '/custom2', label: 'カスタム2' },
    ],
  },
};

/**
 * 空のメニュー
 */
export const Empty: Story = {
  name: "空のメニュー",
  args: {
    items: [],
  },
};
