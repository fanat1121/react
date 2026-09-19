import { Input } from '@/components/common/ui/Input';
import { Select } from '@/components/common/ui/Select';
import { Button } from '@/components/common/ui/Button';
import { Alert } from '@/components/common/ui/Alert';
import { INPUT_TYPES } from '@/components/common/ui/Input/const/inputVariants';
import clsx from 'clsx';
import styles from './StateForm.module.scss';
import type { EquipmentOption } from '../../../types';

type StateFormProps = {
  equipmentOptions: EquipmentOption[];
  equipmentId: string;
  onEquipmentIdChange: (value: string) => void;
  name: string;
  onNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  mediaUrl: string;
  onMediaUrlChange: (value: string) => void;
  errors: { equipmentId?: string[]; name?: string[]; description?: string[]; mediaUrl?: string[]; _form?: string[] };
  isSubmitting: boolean;
  isSuccess: boolean;
  onSubmit: () => void;
};

export const StateForm: React.FC<StateFormProps> = ({
  equipmentOptions,
  equipmentId,
  onEquipmentIdChange,
  name,
  onNameChange,
  description,
  onDescriptionChange,
  mediaUrl,
  onMediaUrlChange,
  errors,
  isSubmitting,
  isSuccess,
  onSubmit,
}) => {
  return (
    <div className={styles.form}>
      <h2 className={styles.title}>状態登録</h2>

      {isSuccess && <Alert variant="success">状態を登録しました。</Alert>}

      <Select
        label="道具"
        value={equipmentId}
        onChange={onEquipmentIdChange}
        options={equipmentOptions.map((e) => ({ value: e.id, label: e.name }))}
        error={errors.equipmentId?.[0]}
        required
      />

      <Input
        label="状態名"
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

      <Input
        label="画像/動画URL"
        value={mediaUrl}
        onChange={(e) => onMediaUrlChange(e.target.value)}
        error={errors.mediaUrl?.[0]}
        inputType={INPUT_TYPES.URL}
      />

      {errors._form && <p className={clsx(styles.formError)}>{errors._form[0]}</p>}

      <Button variant="primary" size="large" onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? '登録中...' : '登録する'}
      </Button>
    </div>
  );
};
