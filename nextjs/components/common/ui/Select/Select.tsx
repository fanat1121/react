'use client';

import { useId } from 'react';
import styles from './Select.module.scss';

export type SelectOption = {
  value: string | number;
  label: string;
};

type SelectProps = {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder = '選択してください',
  value,
  onChange,
  required = false,
  disabled = false,
  className = '',
}) => {
  const generatedId = useId();

  const selectClasses = [styles.select, error && styles['select--error'], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.selectWrapper}>
      {label && (
        <label htmlFor={generatedId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <select
        id={generatedId}
        className={selectClasses}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};
