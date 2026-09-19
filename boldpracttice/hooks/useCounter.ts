import { useCallback, useEffect, useRef, useState } from 'react';
import { readLocalStorageJSON, writeLocalStorageJSON } from '@/utils/localStorage';

type UseCounterOptions = {
  /** 初期値・リセット時に戻る値 */
  initialValue?: number;
  /** decrement時にこの値を下回らない */
  min?: number;
  /** increment/decrement時の増減幅 */
  step?: number;
  /** 指定すると値をlocalStorageに保存し、次回マウント時に復元する */
  persistKey?: string;
};

export type UseCounterResult = {
  value: number;
  increment: () => void;
  decrement: () => void;
  /** 任意の幅で加算する（±10などstep以外の増減用） */
  incrementBy: (amount: number) => void;
  /** 任意の幅で減算する（minを下回らない） */
  decrementBy: (amount: number) => void;
  /** 個別リセット。値をinitialValueに戻す */
  reset: () => void;
};

/**
 * 増減・個別リセットのみを扱う汎用カウンターフック。
 * ドメイン知識（アタック/スキル等）は持たず、呼び出し側が用途を決める。
 * persistKeyを指定するとlocalStorageに値を保存し、次回マウント時に復元する。
 * SSRとのHydration不整合を避けるため、初回レンダリングはinitialValueで揃え、
 * マウント後のuseEffectでlocalStorageの値を反映する。
 */
export const useCounter = (options: UseCounterOptions = {}): UseCounterResult => {
  const { initialValue = 0, min = 0, step = 1, persistKey } = options;
  const [value, setValue] = useState(initialValue);
  const isFirstEffect = useRef(true);

  useEffect(() => {
    if (!persistKey) return;
    if (isFirstEffect.current) {
      isFirstEffect.current = false;
      const stored = readLocalStorageJSON(persistKey, initialValue);
      if (stored !== initialValue) setValue(stored);
      return;
    }
    writeLocalStorageJSON(persistKey, value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistKey, value]);

  const increment = useCallback(() => {
    setValue((prev) => prev + step);
  }, [step]);

  const decrement = useCallback(() => {
    setValue((prev) => Math.max(min, prev - step));
  }, [min, step]);

  const incrementBy = useCallback((amount: number) => {
    setValue((prev) => prev + amount);
  }, []);

  const decrementBy = useCallback(
    (amount: number) => {
      setValue((prev) => Math.max(min, prev - amount));
    },
    [min],
  );

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return { value, increment, decrement, incrementBy, decrementBy, reset };
};
