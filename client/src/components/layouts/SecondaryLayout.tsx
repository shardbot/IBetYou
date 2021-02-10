import { FC, ReactNode } from 'react';

import MenuIcon from '../../assets/icons/menu.svg';
import { LOGO_IMG_SRC } from '../../constants';
import { useMenu } from '../../hooks/useMenu';
import { Button, Meta } from '../global';
import { SideNavigation } from '../global/navigation';

interface MainLayoutProps {
  children?: ReactNode;
}

export const SecondaryLayout: FC<MainLayoutProps> = ({ children }) => {
  const [isMenuOpen, toggleMenu, closeMenu] = useMenu();

  return (
    <>
      <Meta title="IBetYou" />
      <div className="flex items-center pl-4 mt-8 lg:hidden">
        <Button className="lg:hidden h-full mr-4" onClick={toggleMenu}>
          <MenuIcon />
        </Button>
        <img src={LOGO_IMG_SRC} alt="IBetYou logo" />
      </div>
      <SideNavigation isActive={isMenuOpen} onClose={closeMenu} />
      <div className="flex h-full">
        <aside className="hidden lg:flex flex-col bg-real-dark overflow-hidden w-72 xl:w-80">
          <img src={LOGO_IMG_SRC} alt="IBetYou logo" className="h-24 w-24 mx-auto mt-8" />
          <SideNavigation isDesktop={true} />
        </aside>
        <main className="container mx-auto h-auto lg:px-24 xl:px-36 2xl:px-72 3xl:px-96 mt-16 lg:mt-32 flex-1">
          {children}
        </main>
      </div>
    </>
  );
};
