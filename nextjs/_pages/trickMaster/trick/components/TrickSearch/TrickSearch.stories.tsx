import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within, userEvent } from 'storybook/test';
import { TrickSearch } from './TrickSearch';
import type { EquipmentOption, CategoryOption, StateOption, TrickDetailResponse } from '../../../types';

const EQUIPMENT_OPTIONS: EquipmentOption[] = [
  { id: 1, name: 'ディアボロ' },
  { id: 2, name: 'デビルスティック' },
];

const CATEGORY_OPTIONS: CategoryOption[] = [{ id: 1, equipment_id: 1, name: '2個' }];

const STATE_OPTIONS: StateOption[] = [
  { id: 1, equipment_id: 1, name: '待機' },
  { id: 2, equipment_id: 1, name: 'カスケード中' },
];

const RESULTS: TrickDetailResponse[] = [
  {
    id: 1,
    equipment_id: 1,
    equipment_name: 'ディアボロ',
    category_id: 1,
    category_name: '2個',
    name: 'エレベーター',
    description: '説明文',
    start_state_id: 1,
    start_state_name: '待機',
    end_state_id: 2,
    end_state_name: 'カスケード中',
    video_url: 'https://example.com/video',
    estimated_duration_seconds: 5,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

const meta = {
  title: 'TrickMaster/Trick/TrickSearch',
  component: TrickSearch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  render: (args) => {
    const [equipmentId, setEquipmentId] = useState(args.equipmentId);
    const [categoryId, setCategoryId] = useState(args.categoryId);
    const [stateId, setStateId] = useState(args.stateId);
    const [name, setName] = useState(args.name);

    return (
      <TrickSearch
        {...args}
        equipmentId={equipmentId}
        onEquipmentIdChange={(value) => {
          setEquipmentId(value);
          args.onEquipmentIdChange(value);
        }}
        categoryId={categoryId}
        onCategoryIdChange={(value) => {
          setCategoryId(value);
          args.onCategoryIdChange(value);
        }}
        stateId={stateId}
        onStateIdChange={(value) => {
          setStateId(value);
          args.onStateIdChange(value);
        }}
        name={name}
        onNameChange={(value) => {
          setName(value);
          args.onNameChange(value);
        }}
      />
    );
  },
} satisfies Meta<typeof TrickSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    equipmentOptions: EQUIPMENT_OPTIONS,
    categoryOptions: [],
    stateOptions: [],
    equipmentId: '',
    onEquipmentIdChange: fn(),
    categoryId: '',
    onCategoryIdChange: fn(),
    stateId: '',
    onStateIdChange: fn(),
    name: '',
    onNameChange: fn(),
    results: [],
    hasSearched: false,
    isSearching: false,
    onSearch: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByLabelText('道具')).toBeInTheDocument();
    expect(canvas.getByLabelText('カテゴリ')).toBeDisabled();
    expect(canvas.getByLabelText('状態')).toBeDisabled();
    expect(canvas.getByLabelText('技名キーワード')).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: '検索' })).toBeInTheDocument();
    expect(canvas.queryByRole('table')).not.toBeInTheDocument();
    expect(canvas.queryByText('該当する技が見つかりませんでした')).not.toBeInTheDocument();
  },
};

export const SearchByKeyword: Story = {
  args: {
    ...Default.args,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByLabelText('技名キーワード');
    await userEvent.type(input, 'エレベーター');
    expect(input).toHaveValue('エレベーター');

    await userEvent.click(canvas.getByRole('button', { name: '検索' }));
    expect(args.onSearch).toHaveBeenCalledTimes(1);
  },
};

export const NoResults: Story = {
  args: {
    ...Default.args,
    hasSearched: true,
    results: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('該当する技が見つかりませんでした')).toBeInTheDocument();
  },
};

export const WithResults: Story = {
  args: {
    ...Default.args,
    categoryOptions: CATEGORY_OPTIONS,
    stateOptions: STATE_OPTIONS,
    hasSearched: true,
    results: RESULTS,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('cell', { name: 'ディアボロ' })).toBeInTheDocument();
    expect(canvas.getByRole('cell', { name: '2個' })).toBeInTheDocument();
    expect(canvas.getByRole('cell', { name: '待機' })).toBeInTheDocument();
    expect(canvas.getByRole('cell', { name: 'カスケード中' })).toBeInTheDocument();
    expect(canvas.getByRole('cell', { name: '5' })).toBeInTheDocument();

    const link = canvas.getByRole('link', { name: 'エレベーター' });
    expect(link).toHaveAttribute('href', '/trick-master/tricks/1');
  },
};
