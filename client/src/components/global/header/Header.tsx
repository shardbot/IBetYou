import { FC } from 'react';

import MenuIcon from '../../../assets/icons/menu.svg';
import { LOGO_IMG_SRC } from '../../../constants';
import { Button } from '../Button';
import { MainNavigation } from '../navigation';

interface HeaderProps {
  handleToggle: () => void;
}

export const Header: FC<HeaderProps> = ({ handleToggle }) => {
  return (
    <>
      <header className="md:container md:mx-auto">
        {/* MOBILE */}
        <div className="flex justify-between items-center m-4">
          <div className="flex items-center">
            <Button className="lg:hidden h-full mr-4" onClick={handleToggle}>
              <MenuIcon />
            </Button>
            <img src={LOGO_IMG_SRC} alt="IBetYou logo" />
          </div>
          {/* DESKTOP */}
          <div className="flex items-center">
            <MainNavigation type="desktop" />
            <Button className="btn-primary text-xs md:text-base md:ml-8 lg:ml-32">
              Connect wallet
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};
