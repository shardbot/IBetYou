import { FC, HTMLProps } from 'react';

interface HeaderProps extends HTMLProps<HTMLDivElement> {
  title: string;
  subText: string;
}

export const Header: FC<HeaderProps> = ({ title, subText, ...rest }) => {
  return (
    <div {...rest}>
      <h1 className="font-bold mb-2">{title}</h1>
      <span className="text-slate-gray">{subText}</span>
    </div>
  );
};
