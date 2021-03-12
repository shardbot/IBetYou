import classNames from 'classnames';
import { useRouter } from 'next/router';
import { FC } from 'react';

import DollarSignIcon from '../../../assets/icons/dollar-sign.svg';
import HelpCircleIcon from '../../../assets/icons/help-circle.svg';
import LayoutIcon from '../../../assets/icons/layout.svg';
import LogOutIcon from '../../../assets/icons/log-out.svg';
import { LOGO_IMG_SRC } from '../../../constants';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../Button';
import { Drawer } from '../Drawer';
import { LinkButton } from '../LinkButton';

const navigationItems = [
  {
    id: 1,
    to: '/user/dashboard',
    text: 'Dashboard',
    icon: <LayoutIcon className="w-6 h-6 mr-4" />
  },
  {
    id: 2,
    to: '/user/initiate-bet',
    text: 'Initiate bet',
    icon: <DollarSignIcon className="w-6 h-6 mr-4" />
  },
  {
    id: 3,
    to: '/user/faq',
    text: 'FAQ',
    icon: <HelpCircleIcon className="w-6 h-6 mr-4" />
  }
];

const LogOutButton: FC = () => {
  const { logOut } = useAuth();

  return (
    <Button className="mt-auto mb-8 flex self-center p-6" onClick={logOut}>
      <LogOutIcon />
      <span className="ml-4">Log Out</span>
    </Button>
  );
};

interface SideNavigationProps {
  isActive?: boolean;
  onClose?: () => void;
  isDesktop?: boolean;
}

export const SideNavigation: FC<SideNavigationProps> = ({ isActive, onClose, isDesktop }) => {
  const router = useRouter();

  if (isDesktop) {
    return (
      <div className="flex flex-col bg-real-dark w-full h-full">
        <nav className="mt-32">
          {navigationItems.map((item) => (
            <LinkButton
              className={classNames(
                `flex items-center text-lg text-left p-6 hover:text-green-cyan w-full mb-4`,
                {
                  'text-green-cyan bg-navy-blue-mamba': router.asPath === item.to
                }
              )}
              onClick={onClose}
              key={item.id}
              to={item.to}
              text={item.text}
              icon={item.icon}
            />
          ))}
        </nav>
        <LogOutButton />
      </div>
    );
  }

  return (
    <Drawer isActive={isActive} onClose={onClose} isDashboard={true}>
      <div className="flex flex-col bg-real-dark w-full h-full">
        <img
          src={LOGO_IMG_SRC}
          alt="IBetYou logo"
          className="h-16 w-16 sm:h-24 sm:w-24 mx-auto mt-8"
        />
        <nav className="mt-16 sm:mt-32">
          {navigationItems.map((item) => (
            <LinkButton
              className={classNames(
                `flex items-center text-md sm:text-lg text-left p-6 hover:text-green-cyan w-full mb-4`,
                {
                  'text-green-cyan bg-navy-blue-mamba': router.asPath === item.to
                }
              )}
              onClick={onClose}
              key={item.id}
              to={item.to}
              text={item.text}
              icon={item.icon}
            />
          ))}
        </nav>
        <LogOutButton />
      </div>
    </Drawer>
  );
};
