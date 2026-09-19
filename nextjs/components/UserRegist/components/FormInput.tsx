'use client';

import { useState } from "react";
import { Input } from "@/components/common/ui/Input";
import type { InputType } from "@/components/common/ui/Input/const/inputVariants";
import clsx from "clsx";
import styles from "./FormInput.module.scss";

type FormInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputType?: InputType;
  className?: string;
  errorMessages?: string[];
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  inputType = 'text',
  className = 'mb-32',
  errorMessages,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = inputType === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : inputType;

  return (
    <div className={className}>
      <div className={clsx(isPassword && styles.passwordWrapper)}>
        <Input
          label={label}
          inputType={resolvedType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {isPassword && (
          <button
            type="button"
            className={clsx(styles.toggleButton)}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示する'}
          >
            {showPassword ? '非表示' : '表示'}
          </button>
        )}
      </div>
      {errorMessages && errorMessages.length > 0 && (
        <p className={clsx(styles.errorMessage)}>{errorMessages[0]}</p>
      )}
    </div>
  );
};
