import { FC, ReactNode } from 'react';

import { Footer, Header } from '../global';
import { Meta } from '../global';

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Meta title="IBetYou" />
      <Header />
      <main className="container mx-auto h-auto xl:px-36">{children}</main>
      <Footer />
    </>
  );
};
