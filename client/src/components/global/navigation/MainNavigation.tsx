import { useRouter } from 'next/router';
import { FC } from 'react';

import XIcon from '../../../assets/icons/x.svg';
import { LOGO_IMG_SRC } from '../../../constants';
import { Button } from '../Button';
import { Drawer } from '../Drawer';
import { LinkButton } from '../LinkButton';

const navigationItems = [
  {
    id: 1,
    to: '/',
    text: 'Home'
  },
  {
    id: 2,
    to: '/use-case',
    text: 'Use Case'
  },
  {
    id: 3,
    to: '/onboarding',
    text: 'Onboarding'
  },
  {
    id: 4,
    to: '/faq',
    text: 'FAQ'
  }
];

interface MainNavigationProps {
  type: 'mobile' | 'desktop';
  isActive?: boolean;
  onClose?: () => void;
}

export const MainNavigation: FC<MainNavigationProps> = ({ type, isActive, onClose }) => {
  const router = useRouter();

  if (type === 'desktop') {
    return (
      <nav className="hidden lg:flex">
        {navigationItems.map((item) => (
          <div key={item.to} className="p-8 focus:outline-none">
            <LinkButton
              className={`text-sm font-bold hover:text-green-cyan ${
                router.asPath === item.to ? 'text-green-cyan' : ''
              }`}
              key={item.id}
              to={item.to}
              text={item.text}
            />
          </div>
        ))}
      </nav>
    );
  }

  if (type === 'mobile') {
    return (
      <Drawer isActive={isActive} onClose={onClose}>
        <nav className="flex flex-col p-4 bg-real-dark w-full">
          <div className="flex items-center justify-between mb-8">
            <img className="h-16 w-16" src={LOGO_IMG_SRC} alt="IBetYou logo" />
            <Button className="h-auto" onClick={onClose}>
              <XIcon />
            </Button>
          </div>
          {navigationItems.map((item) => (
            <LinkButton
              className={`text-sm text-left font-bold p-4 hover:text-green-cyan ${
                router.asPath === item.to ? 'text-green-cyan' : ''
              }`}
              onClick={onClose}
              key={item.id}
              to={item.to}
              text={item.text}
            />
          ))}
        </nav>
      </Drawer>
    );
  }
};
