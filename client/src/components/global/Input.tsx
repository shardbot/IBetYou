import { FC, InputHTMLAttributes, ReactNode } from 'react';

import styles from '../../styles/modules/Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  name: string;
  label: string;
  type: string;
  validation?: string;
  placeholder?: string;
  children?: ReactNode;
  classes?: string;
}

export const Input: FC<InputProps> = ({
  name,
  label,
  type,
  validation,
  children,
  classes,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2 font-bold text-slate-gray" htmlFor={name}>
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea className={`input ${classes}`} name={name} id={name} {...props} />
      ) : (
        <input className={`input ${classes}`} name={name} id={name} type={type} {...props} />
      )}
      {validation && <span>Error</span>}
      {children}
    </div>
  );
};
