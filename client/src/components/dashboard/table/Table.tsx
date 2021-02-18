import { FC } from 'react';

import { Bet } from '../../../types';
import { Header as TableHeader } from './Header';
import { Row } from './Row';

interface TableProps {
  bets: Bet[];
}

export const Table: FC<TableProps> = ({ bets }) => {
  return (
    <table className="table-auto border-separate" style={{ borderSpacing: '0rem 1rem' }}>
      <TableHeader />
      <tbody>
        {bets.map((bet, i) => (
          <Row key={i} bet={bet} number={i + 1} />
        ))}
      </tbody>
    </table>
  );
};
