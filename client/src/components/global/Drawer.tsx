import { FC, useEffect } from 'react';

interface DrawerProps {
  isActive: boolean;
  onClose: () => void;
}

export const Drawer: FC<DrawerProps> = ({ isActive, onClose, children }) => {
  useEffect(() => {
    document.body.style.overflow = isActive ? 'hidden' : 'auto';
  }, [isActive]);

  return (
    <>
      {/* OVERLAY */}
      <div
        className={`z-10 fixed inset-0 cursor-default lg:hidden ${!isActive ? 'hidden' : ''}`}
        onClick={onClose}
        role="button"
        tabIndex={0}
        onKeyPress={onClose}>
        <div className="absolute inset-0 bg-black opacity-50" />
      </div>
      {/* NAVIGATION */}
      <nav
        className={`z-50 transform ease-in-out transition-all duration-200 flex min-w-min w-5/6 sm:w-2/3 top-0 left-0 h-full fixed lg:hidden ${
          isActive ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {children}
      </nav>
    </>
  );
};
