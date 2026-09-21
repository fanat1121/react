import Link from 'next/link';
import { Input } from '@/components/common/ui/Input';
import { Select } from '@/components/common/ui/Select';
import { Button } from '@/components/common/ui/Button';
import styles from './TrickSearch.module.scss';
import type { EquipmentOption, CategoryOption, StateOption, TrickDetailResponse } from '../../../types';

type TrickSearchProps = {
  equipmentOptions: EquipmentOption[];
  categoryOptions: CategoryOption[];
  stateOptions: StateOption[];
  equipmentId: string;
  onEquipmentIdChange: (value: string) => void;
  categoryId: string;
  onCategoryIdChange: (value: string) => void;
  stateId: string;
  onStateIdChange: (value: string) => void;
  name: string;
  onNameChange: (value: string) => void;
  results: TrickDetailResponse[];
  hasSearched: boolean;
  isSearching: boolean;
  onSearch: () => void;
};

export const TrickSearch: React.FC<TrickSearchProps> = ({
  equipmentOptions,
  categoryOptions,
  stateOptions,
  equipmentId,
  onEquipmentIdChange,
  categoryId,
  onCategoryIdChange,
  stateId,
  onStateIdChange,
  name,
  onNameChange,
  results,
  hasSearched,
  isSearching,
  onSearch,
}) => {
  return (
    <div className={styles.search}>
      <h2 className={styles.title}>技検索</h2>

      <div className={styles.form}>
        <Select
          label="道具"
          value={equipmentId}
          onChange={onEquipmentIdChange}
          options={equipmentOptions.map((e) => ({ value: e.id, label: e.name }))}
        />

        <Select
          label="カテゴリ"
          value={categoryId}
          onChange={onCategoryIdChange}
          options={categoryOptions.map((c) => ({ value: c.id, label: c.name }))}
          disabled={!equipmentId}
        />

        <Select
          label="状態"
          value={stateId}
          onChange={onStateIdChange}
          options={stateOptions.map((s) => ({ value: s.id, label: s.name }))}
          disabled={!equipmentId}
        />

        <Input
          label="技名キーワード"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />

        <Button variant="primary" size="large" onClick={onSearch} disabled={isSearching}>
          {isSearching ? '検索中...' : '検索'}
        </Button>
      </div>

      {hasSearched && results.length === 0 && (
        <p className={styles.emptyMessage}>該当する技が見つかりませんでした</p>
      )}

      {results.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>技名</th>
              <th>道具</th>
              <th>カテゴリ</th>
              <th>開始状態</th>
              <th>終了状態</th>
              <th>想定時間(秒)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link href={`/trick-master/tricks/${item.id}`}>{item.name}</Link>
                </td>
                <td>{item.equipment_name}</td>
                <td>{item.category_name}</td>
                <td>{item.start_state_name}</td>
                <td>{item.end_state_name}</td>
                <td>{item.estimated_duration_seconds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
