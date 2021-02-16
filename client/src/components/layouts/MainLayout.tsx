import { FC, ReactNode } from 'react';

import { useMenu } from '../../hooks/useMenu';
import { Footer, Header } from '../global';
import { Meta } from '../global';
import { MainNavigation } from '../global/navigation';

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const [isMenuOpen, toggleMenu, closeMenu] = useMenu();

  return (
    <>
      <Meta title="IBetYou" />
      <Header handleToggle={toggleMenu} />
      <MainNavigation type="mobile" onClose={closeMenu} isActive={isMenuOpen} />
      <main className="container mx-auto h-auto xl:px-24 2xl:px-34 3xl:px-48 mb-32 flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
};
