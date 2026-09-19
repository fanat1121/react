import styles from './Alert.module.scss';
import { ALERT_VARIANTS } from './const/alertVariants';
import type { AlertVariant } from './const/alertVariants';

type AlertProps = {
  variant: AlertVariant;
  children: React.ReactNode;
  className?: string;
};

export const Alert: React.FC<AlertProps> = ({ variant = ALERT_VARIANTS.SUCCESS, children, className = '' }) => {
  const alertClasses = [styles.alert, styles[`alert--${variant}`], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={alertClasses} role="status">
      {children}
    </div>
  );
};
