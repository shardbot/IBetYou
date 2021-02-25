import { FC } from 'react';

import { LOGO_IMG_SRC } from '../../constants';
import { LinkButton } from './LinkButton';

export const Footer: FC = () => {
  return (
    <footer className="bg-real-dark px-4">
      <div className="py-12 xl:py-16 flex flex-col justify-center items-center">
        <img className="w-16 h-16" src={LOGO_IMG_SRC} alt="logo" />
        <div className="flex justify-between mt-4 mb-4">
          <LinkButton className="font-bold p-4" to="/use-case" text="Use case" />
          <LinkButton className="font-bold p-4" to="/onboarding" text="Onboarding" />
          <LinkButton className="font-bold p-4" to="/faq" text="FAQ" />
        </div>
        <p className="text-center">
          About app and company. Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </p>
      </div>
    </footer>
  );
};
