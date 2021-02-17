import { FC } from 'react';

import { StatusBadge } from '../../global';

export const Row: FC = () => {
  return (
    <tr className="bg-real-dark shadow-lg">
      <td className="text-left pr-8 pl-8 py-10 rounded-tl-lg rounded-bl-lg font-bold">1.</td>
      <td className="pr-8 2xl:pr-24">
        I bet you that bitcoin will be at 100,000 $ at the end of this bet
      </td>
      <td className="pr-8">24 April 2021.</td>
      <td>
        <StatusBadge type="active" />
      </td>
      <td className="pr-8 font-bold">0.005 ETH</td>
      <td className="text-right pr-8 rounded-tr-lg rounded-br-lg font-bold">-</td>
    </tr>
  );
};
