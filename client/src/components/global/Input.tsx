import classNames from 'classnames';
import { FC, InputHTMLAttributes, ReactNode } from 'react';

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
        <textarea
          className={classNames('input', {
            [classes]: !!classes,
            'border border-light-red': !!validation
          })}
          name={name}
          id={name}
          {...props}
        />
      ) : (
        <input
          className={classNames('input', {
            [classes]: !!classes,
            'border border-light-red': !!validation
          })}
          name={name}
          id={name}
          type={type}
          {...props}
        />
      )}
      {validation && <span className="mt-2 text-xs text-light-red">{validation}</span>}
      {children}
    </div>
  );
};
