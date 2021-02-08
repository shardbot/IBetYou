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
      <main className="container mx-auto h-auto xl:px-24 2xl:px-34 3xl:px-48 mb-32 flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
};
