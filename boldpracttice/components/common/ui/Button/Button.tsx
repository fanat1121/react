'use client';

import React from 'react';
import styles from './Button.module.scss';
import { BUTTON_VARIANTS, BUTTON_SIZES, BUTTON_ELEMENTS, BUTTON_TYPES } from './const/buttonVariants';
import type { ButtonVariant, ButtonSize, ButtonType } from './const/buttonVariants';

interface BaseButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
  color?: string;
}

interface ButtonAsButton extends BaseButtonProps {
  element?: typeof BUTTON_ELEMENTS.BUTTON;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: ButtonType;
}

interface ButtonAsLink extends BaseButtonProps {
  element: typeof BUTTON_ELEMENTS.LINK;
  href: string;
  target?: string;
  rel?: string;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    children,
    variant = BUTTON_VARIANTS.PRIMARY,
    size = BUTTON_SIZES.MEDIUM,
    disabled = false,
    className = '',
    color,
  } = props;

  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    disabled && styles['button--disabled'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const customStyle = color ? { backgroundColor: color } : undefined;

  if (props.element === BUTTON_ELEMENTS.LINK) {
    const { href, target, rel } = props;
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={buttonClasses}
        style={customStyle}
        aria-disabled={disabled}
      >
        {children}
      </a>
    );
  }

  const { onClick, type = BUTTON_TYPES.BUTTON } = props;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      style={customStyle}
    >
      {children}
    </button>
  );
};
