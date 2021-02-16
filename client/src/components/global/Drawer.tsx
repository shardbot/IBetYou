import classNames from 'classnames';
import { FC, useEffect } from 'react';

interface DrawerProps {
  isActive: boolean;
  onClose: () => void;
  isDashboard?: boolean;
}

export const Drawer: FC<DrawerProps> = ({ isActive, onClose, children, isDashboard }) => {
  useEffect(() => {
    document.body.style.overflow = isActive ? 'hidden' : 'auto';
  }, [isActive]);

  return (
    <>
      {/* OVERLAY */}
      <div
        className={classNames('z-10 fixed inset-0 cursor-default', {
          hidden: !isActive,
          'lg:hidden': !isDashboard,
          'xl:hidden': isDashboard
        })}
        onClick={onClose}
        role="button"
        tabIndex={0}
        onKeyPress={onClose}>
        <div className="absolute inset-0 bg-black opacity-50" />
      </div>
      {/* NAVIGATION */}
      <div
        className={classNames(
          'z-50 transform ease-in-out transition-all duration-200 flex min-w-min w-5/6 sm:w-2/3 max-w-lg top-0 left-0 h-full fixed',
          {
            'translate-x-0': isActive,
            '-translate-x-full': !isActive,
            'lg:hidden': !isDashboard,
            'xl:hidden': isDashboard
          }
        )}>
        {children}
      </div>
    </>
  );
};
