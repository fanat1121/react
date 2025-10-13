import type { Meta, StoryObj } from '@storybook/react';
import HooksDemoPage from './page';

// ----------------------------------- 
// ドロップ期待値計算機のStory定義
// -----------------------------------
const meta = {
  title: 'Pages/ドロップ期待値計算機',
  component: HooksDemoPage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HooksDemoPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----------------------------------- 
// デフォルトの状態
// -----------------------------------
export const Default: Story = {};

// ----------------------------------- 
// 説明付きバージョン
// -----------------------------------
export const WithDescription: Story = {
  parameters: {
    docs: {
      description: {
        story: 'ドロップ率を入力し、試行回数を増やすことで、アイテムがドロップする確率を計算できます。確率は 1 - (1 - P)^N の式で算出されます。',
      },
    },
  },
};
