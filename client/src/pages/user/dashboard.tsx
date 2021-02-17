import { FC, useState } from 'react';

import DollarSignIcon from '../../assets/icons/dollar-sign.svg';
import { BetCard, Table, Tabs } from '../../components/dashboard';
import { InformationCard } from '../../components/dashboard/card/InformationCard';
import { SecondaryLayout } from '../../components/layouts';
import { PageWithLayout } from '../../types';

const Dashboard: FC = () => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="px-6 xs:px-8 md:px-12 xl:px-16 2xl:px-32 3xl:px-64">
      <h1 className="font-bold text-3xl mb-2">My bets</h1>
      <span className="text-slate-gray">Welcome to your bets</span>
      {/* TOTAL */}
      <InformationCard iconBackground="bg-green-100" accentText="0.005 ETH" subText="Total stake">
        <DollarSignIcon className="w-8 h-8 text-green-cyan" />
      </InformationCard>
      {/* TABS */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* MOBILE */}
      <div className="mt-8 lg:hidden space-y-4">
        <BetCard />
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
