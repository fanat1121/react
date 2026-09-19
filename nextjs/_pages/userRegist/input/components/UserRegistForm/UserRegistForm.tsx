import { FormInput } from '@/components/common/ui/FormInput';
import { Button } from '@/components/common/ui/Button';
import clsx from 'clsx';
import styles from './UserRegistForm.module.scss';

const FORM_LABELS = {
  USER_NAME: 'ユーザー名',
  EMAIL: 'メールアドレス',
  PASSWORD: 'パスワード',
  PASSWORD_CONFIRM: 'パスワード確認',
} as const;

const BUTTON_TEXT = {
  SUBMIT: 'ユーザー登録する',
  SUBMITTING: '登録中...',
} as const;

const INPUT_TYPES = {
  EMAIL: 'email',
  PASSWORD: 'password',
} as const;

type UserRegistErrors = {
  userName?: string[];
  email?: string[];
  password?: string[];
  passwordConfirm?: string[];
  _form?: string[];
};

type UserRegistFormProps = {
  userName: string;
  onUserNameChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  passwordConfirm: string;
  onPasswordConfirmChange: (value: string) => void;
  errors: UserRegistErrors;
  isSubmitting: boolean;
  onSubmit: () => void;
};

export const UserRegistForm: React.FC<UserRegistFormProps> = ({
  userName,
  onUserNameChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  passwordConfirm,
  onPasswordConfirmChange,
  errors,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <>
      <FormInput
        label={FORM_LABELS.USER_NAME}
        value={userName}
        onChange={onUserNameChange}
        errorMessages={errors.userName}
      />
      <FormInput
        label={FORM_LABELS.EMAIL}
        value={email}
        onChange={onEmailChange}
        inputType={INPUT_TYPES.EMAIL}
        errorMessages={errors.email}
      />
      <FormInput
        label={FORM_LABELS.PASSWORD}
        value={password}
        onChange={onPasswordChange}
        inputType={INPUT_TYPES.PASSWORD}
        errorMessages={errors.password}
      />
      <FormInput
        label={FORM_LABELS.PASSWORD_CONFIRM}
        value={passwordConfirm}
        onChange={onPasswordConfirmChange}
        inputType={INPUT_TYPES.PASSWORD}
        className="mb-48"
        errorMessages={errors.passwordConfirm}
      />
      {errors._form && (
        <p className={clsx(styles.formError)}>{errors._form[0]}</p>
      )}
      <div className={clsx(styles.submitButton)}>
        <Button variant="primary" size="large" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? BUTTON_TEXT.SUBMITTING : BUTTON_TEXT.SUBMIT}
        </Button>
      </div>
    </>
  );
};
