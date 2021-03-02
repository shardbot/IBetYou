import { useRouter } from 'next/router';
import { FC } from 'react';

import MenuIcon from '../../../assets/icons/menu.svg';
import { LOGO_IMG_SRC } from '../../../constants';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../Button';
import { LinkButton } from '../LinkButton';
import { MainNavigation } from '../navigation';

interface HeaderProps {
  handleToggle: () => void;
}

export const Header: FC<HeaderProps> = ({ handleToggle }) => {
  const { connectWallet, isLoggedIn, redirectToDashboard, logIn } = useAuth();
  const router = useRouter();

  const handleConnectWallet = async () => {
    if (isLoggedIn()) {
      router.push('user/dashboard');
    }

    const connect = await connectWallet();

    if (connect) {
      logIn();
      redirectToDashboard();
    }
  };

  return (
    <>
      <header className="md:container md:mx-auto">
        {/* MOBILE */}
        <div className="flex justify-between items-center m-4 xl:px-24 2xl:px-34 3xl:px-48">
          <div className="flex items-center">
            <Button className="lg:hidden h-full mr-4" onClick={handleToggle}>
              <MenuIcon />
            </Button>
            <img src={LOGO_IMG_SRC} alt="IBetYou logo" />
          </div>
          {/* DESKTOP */}
          <div className="flex items-center">
            <MainNavigation type="desktop" />
            {isLoggedIn() ? (
              <LinkButton
                className="btn-primary py-2 text-xs lg:text-base md:ml-8 lg:ml-32"
                to="user/dashboard"
                text="Dashboard"
              />
            ) : (
              <Button
                className="btn-primary py-2 text-xs lg:text-base md:ml-8 lg:ml-32"
                onClick={handleConnectWallet}>
                Connect wallet
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
