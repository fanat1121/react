import { Input } from '@/components/common/ui/Input';
import { Select } from '@/components/common/ui/Select';
import { Button } from '@/components/common/ui/Button';
import { Alert } from '@/components/common/ui/Alert';
import { INPUT_TYPES } from '@/components/common/ui/Input/const/inputVariants';
import clsx from 'clsx';
import styles from './TrickForm.module.scss';
import type { EquipmentOption, CategoryOption, StateOption } from '../../../types';

type TrickFormErrors = {
  equipmentId?: string[];
  categoryId?: string[];
  name?: string[];
  description?: string[];
  startStateId?: string[];
  endStateId?: string[];
  videoUrl?: string[];
  estimatedDurationSeconds?: string[];
  _form?: string[];
};

type TrickFormProps = {
  equipmentOptions: EquipmentOption[];
  categoryOptions: CategoryOption[];
  stateOptions: StateOption[];
  equipmentId: string;
  onEquipmentIdChange: (value: string) => void;
  categoryId: string;
  onCategoryIdChange: (value: string) => void;
  name: string;
  onNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  startStateId: string;
  onStartStateIdChange: (value: string) => void;
  endStateId: string;
  onEndStateIdChange: (value: string) => void;
  videoUrl: string;
  onVideoUrlChange: (value: string) => void;
  estimatedDurationSeconds: string;
  onEstimatedDurationSecondsChange: (value: string) => void;
  errors: TrickFormErrors;
  isSubmitting: boolean;
  isSuccess: boolean;
  onSubmit: () => void;
};

export const TrickForm: React.FC<TrickFormProps> = ({
  equipmentOptions,
  categoryOptions,
  stateOptions,
  equipmentId,
  onEquipmentIdChange,
  categoryId,
  onCategoryIdChange,
  name,
  onNameChange,
  description,
  onDescriptionChange,
  startStateId,
  onStartStateIdChange,
  endStateId,
  onEndStateIdChange,
  videoUrl,
  onVideoUrlChange,
  estimatedDurationSeconds,
  onEstimatedDurationSecondsChange,
  errors,
  isSubmitting,
  isSuccess,
  onSubmit,
}) => {
  return (
    <div className={styles.form}>
      <h2 className={styles.title}>技登録</h2>

      {isSuccess && <Alert variant="success">技を登録しました。</Alert>}

      <Select
        label="道具"
        value={equipmentId}
        onChange={onEquipmentIdChange}
        options={equipmentOptions.map((e) => ({ value: e.id, label: e.name }))}
        error={errors.equipmentId?.[0]}
        required
      />

      <Select
        label="カテゴリ"
        value={categoryId}
        onChange={onCategoryIdChange}
        options={categoryOptions.map((c) => ({ value: c.id, label: c.name }))}
        error={errors.categoryId?.[0]}
        disabled={!equipmentId}
        required
      />

      <Input
        label="技名"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        error={errors.name?.[0]}
        required
      />

      <Input
        label="説明"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        error={errors.description?.[0]}
      />

      <Select
        label="開始状態"
        value={startStateId}
        onChange={onStartStateIdChange}
        options={stateOptions.map((s) => ({ value: s.id, label: s.name }))}
        error={errors.startStateId?.[0]}
        disabled={!equipmentId}
        required
      />

      <Select
        label="終了状態"
        value={endStateId}
        onChange={onEndStateIdChange}
        options={stateOptions.map((s) => ({ value: s.id, label: s.name }))}
        error={errors.endStateId?.[0]}
        disabled={!equipmentId}
        required
      />

      <Input
        label="参考動画URL"
        value={videoUrl}
        onChange={(e) => onVideoUrlChange(e.target.value)}
        error={errors.videoUrl?.[0]}
        inputType={INPUT_TYPES.URL}
      />

      <Input
        label="推定所要時間（秒）"
        value={estimatedDurationSeconds}
        onChange={(e) => onEstimatedDurationSecondsChange(e.target.value)}
        error={errors.estimatedDurationSeconds?.[0]}
        inputType={INPUT_TYPES.NUMBER}
      />

      {errors._form && <p className={clsx(styles.formError)}>{errors._form[0]}</p>}

      <Button variant="primary" size="large" onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? '登録中...' : '登録する'}
      </Button>
    </div>
  );
};
