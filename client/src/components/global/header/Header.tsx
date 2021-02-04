import { FC, useState } from 'react';

import MenuIcon from '../../../assets/icons/menu.svg';
import { LOGO_IMG_SRC } from '../../../constants';
import { Button } from '../Button';
import { MainNavigation } from './MainNavigation';

export const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="md:container md:mx-auto">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <Button className="lg:hidden h-full mr-4" onClick={toggleMenu}>
              <MenuIcon />
            </Button>
            <img src={LOGO_IMG_SRC} alt="IBetYou logo" />
          </div>
          <div className="flex items-center">
            <MainNavigation type="desktop" />
            <Button className="btn-primary text-xs md:text-base md:ml-8 lg:ml-32">
              Connect wallet
            </Button>
          </div>
        </div>
        {/* Mobile */}
        <MainNavigation type="mobile" isActive={isMenuOpen} onClose={closeMenu} />
      </header>
    </>
  );
};
