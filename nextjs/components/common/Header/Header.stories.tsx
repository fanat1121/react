import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeaderComponent } from "./Header";

const meta = {
  title: "Common/ヘッダー",
  component: HeaderComponent,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HeaderComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのHeaderコンポーネント表示
 */
export const Default: Story = {};
