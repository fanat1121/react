'use client';

import { useEffect, useState } from 'react';
import type { CategoryOption, StateOption } from '../../types';

export const useEquipmentScopedOptions = (equipmentId: string) => {
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [stateOptions, setStateOptions] = useState<StateOption[]>([]);

  useEffect(() => {
    if (!equipmentId) {
      setCategoryOptions([]);
      setStateOptions([]);
      return;
    }

    let cancelled = false;

    Promise.all([
      fetch(`/api/equipment-categories?equipment_id=${equipmentId}`).then((res) => res.json()),
      fetch(`/api/states?equipment_id=${equipmentId}`).then((res) => res.json()),
    ]).then(([categoryJson, stateJson]) => {
      if (cancelled) return;
      setCategoryOptions(categoryJson.success ? categoryJson.data : []);
      setStateOptions(stateJson.success ? stateJson.data : []);
    });

    return () => {
      cancelled = true;
    };
  }, [equipmentId]);

  return { categoryOptions, stateOptions };
};
