import { Input } from '@/components/common/ui/Input';
import { Button } from '@/components/common/ui/Button';
import { Alert } from '@/components/common/ui/Alert';
import clsx from 'clsx';
import styles from './EquipmentForm.module.scss';

type EquipmentFormProps = {
  name: string;
  onNameChange: (value: string) => void;
  errors: { name?: string[]; _form?: string[] };
  isSubmitting: boolean;
  isSuccess: boolean;
  onSubmit: () => void;
};

export const EquipmentForm: React.FC<EquipmentFormProps> = ({
  name,
  onNameChange,
  errors,
  isSubmitting,
  isSuccess,
  onSubmit,
}) => {
  return (
    <div className={styles.form}>
      <h2 className={styles.title}>道具登録</h2>

      {isSuccess && <Alert variant="success">道具を登録しました。</Alert>}

      <Input
        label="道具名"
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
