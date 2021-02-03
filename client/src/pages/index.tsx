import { FC } from 'react';

import { MainLayout } from '../components/layouts';
import { PageWithLayout } from '../types';

const Home: FC = () => {
  return (
    <>
      <div>Landing page</div>
    </>
  );
};

(Home as PageWithLayout).Layout = MainLayout;

export default Home;
