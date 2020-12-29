import Link from 'next/link';
import { ButtonHTMLAttributes, FC } from 'react';

interface LinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  to: string;
  text: string;
}

export const LinkButton: FC<LinkButtonProps> = ({ to, text, ...props }) => {
  return (
    <Link href={to}>
      <button {...props}>{text}</button>
    </Link>
  );
};
