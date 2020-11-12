import { FC, InputHTMLAttributes } from 'react';

import styles from '../../styles/modules/Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  name: string;
  label: string;
  type: string;
  validation?: string;
  placeholder?: string;
}

export const Input: FC<InputProps> = ({ name, label, type, validation, ...props }) => {
  return (
    <div className={styles.inputWrapper}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea className={styles.input} id={name} {...props} />
      ) : (
        <input className={styles.input} id={name} type={type} {...props} />
      )}
      {validation && <span className={styles.validation}>Error</span>}
    </div>
  );
};
