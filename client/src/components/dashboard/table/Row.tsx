import { FC } from 'react';

export const Row: FC = () => {
  return (
    <tr>
      <td className="text-left pr-8">1.</td>
      <td className="pr-8">I bet you that bitcoin will be at 100,000 $ at the end of this bet</td>
      <td className="pr-8">24 April 2021.</td>
      <td className="pr-8">0.005 ETH</td>
      <td>Active</td>
      <td className="text-right">-</td>
    </tr>
  );
};
