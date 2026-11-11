import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { expect, within } from "storybook/test";
import { HeaderComponent } from "./Header";

const GUEST_TEXT = "ゲストユーザー";
const LOGIN_TEXT = "ログイン";
const LOGOUT_TEXT = "ログアウト";
const MOCK_USER_NAME = "テスト太郎";
const MOCK_EXPIRES = "2099-01-01T00:00:00.000Z";

const LOGGED_IN_SESSION: Session = {
  user: { id: "1", name: MOCK_USER_NAME, email: "test@example.com" },
  expires: MOCK_EXPIRES,
};

// AUTH_SECRET 未設定などの設定エラー時、auth() は user を持たないオブジェクトを返す
const CONFIG_ERROR_SESSION = {
  message: "There was a problem with the server configuration.",
} as unknown as Session;

const withSession = (session: Session | null) => {
  const SessionDecorator = (Story: React.ComponentType) => (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <Story />
    </SessionProvider>
  );
  return SessionDecorator;
};

const meta = {
  title: "Common/ヘッダー",
  component: HeaderComponent,
  parameters: {
    layout: "fullscreen",
  },
  // useSession は SessionProvider 必須。各ストーリーの decorators が内側で上書きする
  decorators: [withSession(null)],
  tags: ["autodocs"],
} satisfies Meta<typeof HeaderComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのHeaderコンポーネント表示
 */
export const Default: Story = {};

/**
 * 未ログイン時はゲスト表示とログインボタン
 */
export const Guest: Story = {
  decorators: [withSession(null)],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(GUEST_TEXT)).toBeInTheDocument();
    await expect(canvas.getByText(LOGIN_TEXT)).toBeInTheDocument();
  },
};

/**
 * ログイン時はユーザー名とログアウトボタン
 */
export const LoggedIn: Story = {
  decorators: [withSession(LOGGED_IN_SESSION)],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(MOCK_USER_NAME)).toBeInTheDocument();
    await expect(canvas.getByText(LOGOUT_TEXT)).toBeInTheDocument();
    await expect(canvas.queryByText(GUEST_TEXT)).not.toBeInTheDocument();
  },
};

/**
 * 設定エラーで user を持たないセッションが渡ってもゲスト扱いになる
 */
export const ConfigErrorSession: Story = {
  decorators: [withSession(CONFIG_ERROR_SESSION)],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(GUEST_TEXT)).toBeInTheDocument();
    await expect(canvas.queryByText(LOGOUT_TEXT)).not.toBeInTheDocument();
  },
};
