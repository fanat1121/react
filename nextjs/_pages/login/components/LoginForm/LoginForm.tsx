import { Button } from '@/components/common/ui/Button';
import { FormInput } from '@/components/common/ui/FormInput';
import clsx from 'clsx';
import styles from './LoginForm.module.scss';

const FORM_LABELS = {
  USER_LOGIN_ID: 'ログインID',
  PASSWORD: 'パスワード',
} as const;

const BUTTON_TEXT = {
  SUBMIT: 'ログイン',
  SUBMITTING: 'ログイン中...',
} as const;

type LoginErrors = {
  userLoginId?: string[];
  password?: string[];
  _form?: string[];
};

type LoginFormProps = {
  userLoginId: string;
  onUserLoginIdChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  errors: LoginErrors;
  isSubmitting: boolean;
  onSubmit: () => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({
  userLoginId,
  onUserLoginIdChange,
  password,
  onPasswordChange,
  errors,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <>
      <FormInput
        label={FORM_LABELS.USER_LOGIN_ID}
        value={userLoginId}
        onChange={onUserLoginIdChange}
        errorMessages={errors.userLoginId}
      />
      <FormInput
        label={FORM_LABELS.PASSWORD}
        value={password}
        onChange={onPasswordChange}
        inputType="password"
        className="mb-48"
        errorMessages={errors.password}
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
