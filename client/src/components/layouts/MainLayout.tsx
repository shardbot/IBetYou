import { FC, ReactNode } from 'react';

import { Header } from '../global/Header';
import { Meta } from '../global/Meta';

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Meta title="IBetYou" />
      <Header />
      <main className="main main-container">{children}</main>
    </>
  );
};
