import { useRouter } from 'next/router';
import { FC } from 'react';

import DollarSignIcon from '../../../assets/icons/dollar-sign.svg';
import HelpCircleIcon from '../../../assets/icons/help-circle.svg';
import LayoutIcon from '../../../assets/icons/layout.svg';
import { LOGO_IMG_SRC } from '../../../constants';
import { Drawer } from '../Drawer';
import { LinkButton } from '../LinkButton';

const navigationItems = [
  {
    id: 1,
    to: '/dashboard',
    text: 'Dashboard',
    icon: <LayoutIcon className="w-6 h-6 mr-4" />
  },
  {
    id: 2,
    to: '/initiate-bet',
    text: 'Initiate bet',
    icon: <DollarSignIcon className="w-6 h-6 mr-4" />
  },
  {
    id: 3,
    to: '/faq',
    text: 'FAQ',
    icon: <HelpCircleIcon className="w-6 h-6 mr-4" />
  }
];

interface SideNavigationProps {
  isActive?: boolean;
  onClose?: () => void;
  isDesktop?: boolean;
}

export const SideNavigation: FC<SideNavigationProps> = ({ isActive, onClose, isDesktop }) => {
  const router = useRouter();

  if (isDesktop) {
    return (
      <div className="flex flex-col p-4 bg-real-dark w-full">
        <div className="mt-32">
          {navigationItems.map((item) => (
            <LinkButton
              className={`flex items-center text-lg text-left p-4 hover:text-green-cyan w-full mb-4 ${
                router.asPath === item.to ? 'text-green-cyan' : ''
              }`}
              onClick={onClose}
              key={item.id}
              to={item.to}
              text={item.text}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Drawer isActive={isActive} onClose={onClose}>
      <div className="flex flex-col p-4 bg-real-dark w-full">
        <img
          src={LOGO_IMG_SRC}
          alt="IBetYou logo"
          className="h-16 w-16 sm:h-24 sm:w-24 mx-auto mt-8"
        />
        <div className="mt-16 sm:mt-32">
          {navigationItems.map((item) => (
            <LinkButton
              className={`flex items-center text-md sm:text-lg text-left p-4 hover:text-green-cyan w-full mb-4 ${
                router.asPath === item.to ? 'text-green-cyan' : ''
              }`}
              onClick={onClose}
              key={item.id}
              to={item.to}
              text={item.text}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </Drawer>
  );
};
