import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Logo } from "./Logo";
import { LOGO_TEXT } from "./const/logo";

const meta = {
  title: "Common/ヘッダー/ロゴ",
  component: Logo,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 通常ページでのロゴ表示（リンクあり）
 */
export const WithLink: Story = {
  name: "通常ページでのロゴ表示（リンクあり）",
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/some-page',
      },
    },
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    // ロゴリンクを取得
    const logoLink = canvas.getByRole('link');

    // ロゴテキストが表示されていることを確認
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveTextContent(LOGO_TEXT);

    // ホバーイベントをシミュレート
    await userEvent.hover(logoLink);

    // href属性が正しいことを確認
    expect(logoLink).toHaveAttribute('href', '/');
  },
};

/**
 * TOPページでのロゴ表示（リンクなし）
 */
export const OnTopPage: Story = {
  name: "TOPページでのロゴ表示（リンクなし）",
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
        query: {},
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ロゴテキストが表示されていることを確認
    const logoText = canvas.getByText(LOGO_TEXT);
    expect(logoText).toBeInTheDocument();

    // リンクが存在しないことを確認（TOPページではdivとして表示される）
    const links = canvas.queryAllByRole('link');
    expect(links).toHaveLength(0);
  },
};
