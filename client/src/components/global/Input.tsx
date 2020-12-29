import { FC, InputHTMLAttributes, ReactNode } from 'react';

import styles from '../../styles/modules/Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  name: string;
  label: string;
  type: string;
  validation?: string;
  placeholder?: string;
  children?: ReactNode;
}

export const Input: FC<InputProps> = ({ name, label, type, validation, children, ...props }) => {
  return (
    <div className={styles.inputWrapper}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea name={name} className={styles.input} id={name} {...props} />
      ) : (
        <input name={name} className={styles.input} id={name} type={type} {...props} />
      )}
      {validation && <span className={styles.validation}>Error</span>}
      {children}
    </div>
  );
};
