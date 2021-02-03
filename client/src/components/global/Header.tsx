import { useRouter } from 'next/router';
import { FC, useState } from 'react';

import { LOGO_IMG_SRC } from '../../constants';
import { Button } from './Button';
import { LinkButton } from './LinkButton';

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

const MainNavigation: FC<MainNavigationProps> = ({ type, isActive, onClose }) => {
  const router = useRouter();

  if (type === 'desktop') {
    return (
      <nav className="hidden md:flex">
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
      <nav
        className={`flex flex-col p-4 bg-real-dark min-w-min w-5/6 sm:w-2/3 top-0 h-full fixed md:hidden ${
          !isActive && 'hidden'
        }`}>
        <div className="flex items-center justify-between mb-4">
          <img className="h-16 w-16" src={LOGO_IMG_SRC} alt="IBetYou logo" />
          <Button className="md:hidden h-auto" onClick={onClose}>
            {/* Move this to file and import it */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-x">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        </div>
        {navigationItems.map((item) => (
          <LinkButton
            className={`text-sm text-left font-bold p-4 hover:text-green-cyan ${
              router.asPath === item.to ? 'text-green-cyan' : ''
            }`}
            key={item.id}
            to={item.to}
            text={item.text}
          />
        ))}
      </nav>
    );
  }
};

export const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="md:container md:mx-auto">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <Button className="md:hidden h-full mr-4" onClick={toggleMenu}>
              {/* Move this to file and import it */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-menu">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </Button>
            <img src={LOGO_IMG_SRC} alt="IBetYou logo" />
          </div>
          <MainNavigation type="desktop" />
        </div>
        {/* Mobile */}
        <MainNavigation type="mobile" isActive={isMenuOpen} onClose={closeMenu} />
      </header>
    </>
  );
};
