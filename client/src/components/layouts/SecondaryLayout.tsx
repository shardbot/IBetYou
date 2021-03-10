import { useRouter } from 'next/router';
import { FC, ReactNode, useEffect, useState } from 'react';

import MenuIcon from '../../assets/icons/menu.svg';
import { LOGO_IMG_SRC } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { useMenu } from '../../hooks/useMenu';
import { Button, Meta } from '../global';
import { SideNavigation } from '../global/navigation';

interface MainLayoutProps {
  children?: ReactNode;
}

const Protected: FC = ({ ...props }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (
      !isLoggedIn() &&
      window.location.pathname !== '/accept-bet' &&
      window.location.pathname !== '/judge'
    ) {
      router.push('/');
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-centers bg-navy-blue-mamba" />
    );

  return <>{props.children}</>;
};

export const SecondaryLayout: FC<MainLayoutProps> = ({ children }) => {
  const [isMenuOpen, toggleMenu, closeMenu] = useMenu();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn()) {
    return (
      <Protected>
        <main className="container mx-auto h-auto mt-16 lg:mt-32 flex-1">{children}</main>
      </Protected>
    );
  }

  return (
    <>
      <Meta title="IBetYou" />
      <Protected>
        <div className="flex items-center pl-4 mt-8 xl:hidden">
          <Button className="h-full mr-4" onClick={toggleMenu}>
            <MenuIcon />
          </Button>
          <img src={LOGO_IMG_SRC} alt="IBetYou logo" />
        </div>
        <SideNavigation isActive={isMenuOpen} onClose={closeMenu} />
        <div className="flex h-full">
          <aside className="hidden fixed z-0 h-full xl:flex flex-col bg-real-dark overflow-hidden w-72 xl:w-80">
            <img src={LOGO_IMG_SRC} alt="IBetYou logo" className="h-24 w-24 mx-auto mt-8" />
            <SideNavigation isDesktop={true} />
          </aside>
          <main className="container mx-auto h-auto mt-16 lg:mt-32 flex-1">
            <div className="xl:ml-80">{children}</div>
          </main>
        </div>
      </Protected>
    </>
  );
};
