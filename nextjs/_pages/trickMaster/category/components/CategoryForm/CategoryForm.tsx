import { Input } from '@/components/common/ui/Input';
import { Select } from '@/components/common/ui/Select';
import { Button } from '@/components/common/ui/Button';
import { Alert } from '@/components/common/ui/Alert';
import clsx from 'clsx';
import styles from './CategoryForm.module.scss';
import type { EquipmentOption } from '../../../types';

type CategoryFormProps = {
  equipmentOptions: EquipmentOption[];
  equipmentId: string;
  onEquipmentIdChange: (value: string) => void;
  name: string;
  onNameChange: (value: string) => void;
  errors: { equipmentId?: string[]; name?: string[]; _form?: string[] };
  isSubmitting: boolean;
  isSuccess: boolean;
  onSubmit: () => void;
};

export const CategoryForm: React.FC<CategoryFormProps> = ({
  equipmentOptions,
  equipmentId,
  onEquipmentIdChange,
  name,
  onNameChange,
  errors,
  isSubmitting,
  isSuccess,
  onSubmit,
}) => {
  return (
    <div className={styles.form}>
      <h2 className={styles.title}>カテゴリ登録</h2>

      {isSuccess && <Alert variant="success">カテゴリを登録しました。</Alert>}

      <Select
        label="道具"
        value={equipmentId}
        onChange={onEquipmentIdChange}
        options={equipmentOptions.map((e) => ({ value: e.id, label: e.name }))}
        error={errors.equipmentId?.[0]}
        required
      />

      <Input
        label="カテゴリ名"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        error={errors.name?.[0]}
        required
      />

      {errors._form && <p className={clsx(styles.formError)}>{errors._form[0]}</p>}

      <Button variant="primary" size="large" onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? '登録中...' : '登録する'}
      </Button>
    </div>
  );
};
