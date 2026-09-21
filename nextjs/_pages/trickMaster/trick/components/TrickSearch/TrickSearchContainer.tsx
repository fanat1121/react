'use client';

import { useState } from 'react';
import { useEquipmentScopedOptions } from '../../hooks/useEquipmentScopedOptions';
import { TrickSearch } from './TrickSearch';
import type { EquipmentOption, TrickDetailResponse } from '../../../types';

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
    />
  );
};
