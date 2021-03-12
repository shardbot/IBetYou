import { FC } from 'react';

interface InformationCardProps {
  iconBackground: string;
  children: JSX.Element;
  accentText: string | number;
  subText: string;
}

export const InformationCard: FC<InformationCardProps> = ({
  iconBackground,
  accentText,
  subText,
  children
}) => {
  return (
    <div className="h-auto w-full md:w-max bg-real-dark rounded-lg lg:px-12 lg:py-12 xl:max-w-2xl flex flex-col mt-8 mb-16 p-8 shadow-lg">
      <span
        className={`md:self-center mb-4 rounded-full max-w-min p-4 bg-opacity-10 ${iconBackground}`}>
        {children}
      </span>
      <span className="font-bold text-3xl">{accentText}</span>
      <h3 className="text-lg md:text-center mt-4 text-slate-gray">{subText}</h3>
    </div>
  );
};
