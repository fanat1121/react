import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within, userEvent } from 'storybook/test';
import { MasterList } from './MasterList';
import type { MasterListItem } from '../../types';

const ITEMS: MasterListItem[] = [
  { id: 1, name: 'ディアボロ' },
  { id: 2, name: 'デビルスティック' },
];

const EMPTY_MESSAGE = '登録済みの道具はありません';

const meta = {
  title: 'TrickMaster/MasterList',
  component: MasterList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MasterList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '登録済みの道具',
    items: ITEMS,
    emptyMessage: EMPTY_MESSAGE,
    deletingId: null,
    onDelete: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('heading', { name: '登録済みの道具' })).toBeInTheDocument();
    expect(canvas.getByRole('cell', { name: 'ディアボロ' })).toBeInTheDocument();
    expect(canvas.getByRole('cell', { name: 'デビルスティック' })).toBeInTheDocument();
    expect(canvas.getAllByRole('button', { name: '削除' })).toHaveLength(ITEMS.length);
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    items: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(EMPTY_MESSAGE)).toBeInTheDocument();
    expect(canvas.queryByRole('table')).not.toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('読み込み中...')).toBeInTheDocument();
    expect(canvas.queryByRole('table')).not.toBeInTheDocument();
  },
};

export const LoadFailed: Story = {
  args: {
    ...Default.args,
    items: [],
    errorMessage: '一覧の取得に失敗しました',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('一覧の取得に失敗しました')).toBeInTheDocument();
    expect(canvas.queryByRole('table')).not.toBeInTheDocument();
  },
};

export const DeleteItem: Story = {
  args: {
    ...Default.args,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getAllByRole('button', { name: '削除' })[1]);
    expect(args.onDelete).toHaveBeenCalledWith(ITEMS[1]);
  },
};

export const Deleting: Story = {
  args: {
    ...Default.args,
    deletingId: 1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('button', { name: '削除中...' })).toBeDisabled();
    expect(canvas.getByRole('button', { name: '削除' })).toBeDisabled();
  },
};

export const DeleteFailed: Story = {
  args: {
    ...Default.args,
    errorMessage: 'この道具は使用中のため削除できません（カテゴリ・状態・技から参照されています）',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      canvas.getByText('この道具は使用中のため削除できません（カテゴリ・状態・技から参照されています）')
    ).toBeInTheDocument();
    expect(canvas.getByRole('cell', { name: 'ディアボロ' })).toBeInTheDocument();
  },
};
