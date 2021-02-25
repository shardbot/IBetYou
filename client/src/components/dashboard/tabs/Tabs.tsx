import { Dispatch, FC, SetStateAction, useState } from 'react';

import { Tab } from './Tab';

const tabs = [
  {
    id: 1,
    position: 1,
    label: 'Active'
  },
  {
    id: 2,
    position: 2,
    label: 'History'
  }
];

interface TabsProps {
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
}

export const Tabs: FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const handleTabSwitch = (position: number) => {
    setActiveTab(position);
  };

  return (
    <div className="flex justify-around md:justify-start text-xl">
      {tabs.map((item) => (
        <Tab key={item.id} tab={item} handleSwitch={handleTabSwitch} selectedPosition={activeTab} />
      ))}
    </div>
  );
};
