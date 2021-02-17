import { FC, HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  classes?: string;
}

export const Badge: FC<BadgeProps> = ({ label, classes, ...props }) => {
  return (
    <div className={`rounded-lg max-w-min ${classes}`} {...props}>
      <span>{label}</span>
    </div>
  );
};
