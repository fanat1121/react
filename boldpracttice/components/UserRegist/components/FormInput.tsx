'use client';

import { Input } from "@/components/common/ui/Input";
import type { InputType } from "@/components/common/ui/Input/const/inputVariants";

type FormInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputType?: InputType;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ 
  label,
  value,
  onChange,
  inputType = 'text',
  className = 'mb-32'
}) => {
  return (
    <div className={className}>
      <Input 
        label={label}
        inputType={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
