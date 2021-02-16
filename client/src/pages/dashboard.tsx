import { FC, useState } from 'react';

import { BetCard, Table, Tabs } from '../components/dashboard';
import { SecondaryLayout } from '../components/layouts';
import { PageWithLayout } from '../types';

const Dashboard: FC = () => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="px-4 xs:px-8 md:px-12 xl:px-16 2xl:px-32 3xl:px-64">
      <h1 className="font-bold text-3xl mb-2">My bets</h1>
      <span className="text-slate-gray">Welcome to your bets</span>
      {/* TOTAL */}
      <div className="h-auto w-full md:w-max bg-real-dark rounded-lg lg:px-16 lg:py-12 flex flex-col mt-8 mb-16 p-8">
        <h3 className="text-lg mb-4">Total stake</h3>
        <span className="font-bold text-3xl">1.005 ETH</span>
      </div>
      {/* TABS */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* MOBILE */}
      <div className="mt-8 lg:hidden">
        <BetCard />
      </div>

      {/* DESKTOP */}
      <div className="mx-auto hidden lg:flex flex-col mb-24 mt-8">
        <Table />
      </div>
    </div>
  );
};

(Dashboard as PageWithLayout).Layout = SecondaryLayout;

export default Dashboard;
