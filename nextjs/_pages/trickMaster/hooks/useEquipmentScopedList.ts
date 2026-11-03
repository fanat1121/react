'use client';

import { useCallback, useEffect, useState } from 'react';
import type { MasterListItem } from '../types';

const LOAD_ERROR_MESSAGE = '一覧の取得に失敗しました';

// 道具に紐づくマスタ（カテゴリ・状態）一覧を取得する。登録後などに reload() で再取得できる。
export const useEquipmentScopedList = <T extends MasterListItem>(endpoint: string, equipmentId: string) => {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setLoadError('');

    if (!equipmentId) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetch(`${endpoint}?equipment_id=${encodeURIComponent(equipmentId)}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success) {
          setItems(json.data ?? []);
        } else {
          setItems([]);
          setLoadError(json.error?.message ?? LOAD_ERROR_MESSAGE);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setItems([]);
        setLoadError(LOAD_ERROR_MESSAGE);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [endpoint, equipmentId, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);
  const removeItem = useCallback((id: number) => setItems((prev) => prev.filter((item) => item.id !== id)), []);

  return { items, isLoading, loadError, reload, removeItem };
};
