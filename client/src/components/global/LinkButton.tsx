import Link from 'next/link';
import { ButtonHTMLAttributes, FC } from 'react';

interface LinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  to: string;
  text: string;
  icon?: any;
}

export const LinkButton: FC<LinkButtonProps> = ({ to, text, icon, ...props }) => {
  if (icon) {
    return (
      <Link href={to} scroll={true}>
        <button {...props}>
          {icon}
          <span>{text}</span>
        </button>
      </Link>
    );
  }

  return (
    <Link href={to} scroll={true}>
      <button {...props}>{text}</button>
    </Link>
  );
};
