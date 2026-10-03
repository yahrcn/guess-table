import cx from 'classnames';
import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = ({ variant = 'primary', className, ...rest }: Props) => {
  return (
    <button
      type="button"
      className={cx(
        styles.button,
        {
          [styles.secondary]: variant === 'secondary',
          [styles.danger]: variant === 'danger',
        },
        className
      )}
      {...rest}
    />
  );
};
