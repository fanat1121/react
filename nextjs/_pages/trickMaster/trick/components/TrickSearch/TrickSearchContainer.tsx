'use client';

import { useState } from 'react';
import { deleteTrick } from '../../actions/deleteTrick';
import { useEquipmentScopedOptions } from '../../hooks/useEquipmentScopedOptions';
import { TrickSearch } from './TrickSearch';
import type { EquipmentOption, TrickDetailResponse } from '../../../types';

const DELETE_FAILED_MESSAGE = '削除に失敗しました。時間をおいて再度お試しください';

type TrickSearchContainerProps = {
  equipmentOptions: EquipmentOption[];
};

export const TrickSearchContainer: React.FC<TrickSearchContainerProps> = ({ equipmentOptions }) => {
  const [equipmentId, setEquipmentId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [stateId, setStateId] = useState('');
  const [name, setName] = useState('');
  const [results, setResults] = useState<TrickDetailResponse[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const { categoryOptions, stateOptions } = useEquipmentScopedOptions(equipmentId);

  const handleEquipmentIdChange = (value: string) => {
    setEquipmentId(value);
    setCategoryId('');
    setStateId('');
  };

  const handleSearch = async () => {
    setIsSearching(true);

    const params = new URLSearchParams();
    if (name) params.set('name', name);
    if (equipmentId) params.set('equipment_id', equipmentId);
    if (categoryId) params.set('category_id', categoryId);
    if (stateId) params.set('state_id', stateId);

    try {
      const response = await fetch(`/api/tricks?${params.toString()}`);
      const json = await response.json();
      setResults(json.success ? json.data : []);
    } catch {
      setResults([]);
    } finally {
      setHasSearched(true);
      setIsSearching(false);
    }
  };

  const handleDelete = async (trick: TrickDetailResponse) => {
    if (!window.confirm(`「${trick.name}」を削除しますか？`)) return;

    setDeletingId(trick.id);
    setDeleteError('');

    try {
      const result = await deleteTrick(trick.id);
      if (result.success) {
        setResults((prev) => prev.filter((item) => item.id !== trick.id));
      } else {
        setDeleteError(result.error ?? '');
      }
    } catch {
      // 通信断・デプロイによる Action ID 変更などで Server Action 自体が reject した場合
      setDeleteError(DELETE_FAILED_MESSAGE);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <TrickSearch
      equipmentOptions={equipmentOptions}
      categoryOptions={categoryOptions}
      stateOptions={stateOptions}
      equipmentId={equipmentId}
      onEquipmentIdChange={handleEquipmentIdChange}
      categoryId={categoryId}
      onCategoryIdChange={setCategoryId}
      stateId={stateId}
      onStateIdChange={setStateId}
      name={name}
      onNameChange={setName}
      results={results}
      hasSearched={hasSearched}
      isSearching={isSearching}
      onSearch={handleSearch}
      deletingId={deletingId}
      deleteError={deleteError}
      onDelete={handleDelete}
    />
  );
};
