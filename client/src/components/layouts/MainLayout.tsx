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
      <main className="container mx-auto 3xl:px-24">{children}</main>
      <Footer />
    </>
  );
};
