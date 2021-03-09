import { FC } from 'react';

export const Header: FC = () => {
  return (
    <thead>
      <tr className="text-left text-slate-gray text-xs 2xl:text-base">
        <th className="w-1/6 py-8 text-left">BET NUMBER</th>
        <th className="w-1/3">BET DESCRIPTION</th>
        <th className="w-1/5">EXPIRATION DATE</th>
        <th className="w-1/6">STATUS</th>
        <th className="w-1/6">STAKE (MATIC)</th>
        <th className="w-1/4 text-right">ACTION</th>
      </tr>
    </thead>
  );
};
