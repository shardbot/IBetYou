import { FC, useEffect, useState } from 'react';

import DollarSignIcon from '../../assets/icons/dollar-sign.svg';
import { BetCard, Table, Tabs } from '../../components/dashboard';
import { InformationCard } from '../../components/dashboard/card/InformationCard';
import { Loader } from '../../components/global';
import { SecondaryLayout } from '../../components/layouts';
import { EMPTY_IMG_SRC } from '../../constants';
import { useBets } from '../../hooks/useBets';
import { Bet, PageWithLayout } from '../../types';

const Dashboard: FC = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [filteredBets, setFilteredBets] = useState<Bet[]>([]);
  const { isLoading, totalStake, fetchBets, bets } = useBets();

  useEffect(() => {
    fetchBets();
  }, []);

  useEffect(() => {
    if (activeTab === 1) {
      // active
      const filtered = bets.filter((bet) => +bet.betState <= 5);
      setFilteredBets(filtered);
    } else {
      // history
      const filtered = bets.filter((bet) => +bet.betState > 5);
      setFilteredBets(filtered);
    }
  }, [activeTab, bets]);

  return (
    <>
      <div className="px-6 xs:px-8 md:px-12 xl:px-16 2xl:px-24 3xl:px-32">
        <h1 className="font-bold text-3xl mb-2">My bets</h1>
        <span className="text-slate-gray">Welcome to your bets</span>
        {isLoading ? (
          <span className="flex justify-center mt-16">
            <Loader classes="w-12 h-12" />
          </span>
        ) : (
          <>
            {/* TOTAL */}
            <InformationCard
              iconBackground="bg-green-100"
              accentText={`${totalStake} ETH`}
              subText="Total stake">
              <DollarSignIcon className="w-8 h-8 text-green-cyan" />
            </InformationCard>
            {/* TABS */}
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {filteredBets.length < 1 ? (
              <div className="flex flex-col text-center justify-center items-center mt-16">
                <img src={EMPTY_IMG_SRC} alt="empty state" className="w-64 h-64" />
                <h3 className="font-bold">Nothing here!</h3>
              </div>
            ) : (
              <>
                {/* MOBILE */}
                <div className="mt-8 lg:hidden space-y-4">
                  {filteredBets.map((bet, i) => (
                    <BetCard key={i} bet={bet} number={i + 1} handleFetch={fetchBets} />
                  ))}
                </div>

                {/* DESKTOP */}
                <div className="mx-auto hidden lg:flex flex-col mb-24 mt-8">
                  <Table bets={filteredBets} handleFetch={fetchBets} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

(Dashboard as PageWithLayout).Layout = SecondaryLayout;

export default Dashboard;
