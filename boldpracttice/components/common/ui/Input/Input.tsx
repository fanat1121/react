'use client';

import React from 'react';
import styles from './Input.module.scss';
import { INPUT_TYPES, INPUT_SIZES } from './const/inputVariants';
import type { InputType, InputSize } from './const/inputVariants';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  size?: InputSize;
  inputType?: InputType;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  size = INPUT_SIZES.MEDIUM,
  inputType = INPUT_TYPES.TEXT,
  className = '',
  disabled = false,
  ...rest
}) => {
  const inputClasses = [
    styles.input,
    styles[`input--${size}`],
    error && styles['input--error'],
    disabled && styles['input--disabled'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {rest.required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type={inputType}
        className={inputClasses}
        disabled={disabled}
        {...rest}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
