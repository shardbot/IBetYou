import { FC } from 'react';

import { Header as TableHeader } from './Header';
import { Row } from './Row';

export const Table: FC = () => {
  return (
    <table className="table-auto border-separate" style={{ borderSpacing: '0rem 1rem' }}>
      <TableHeader />
      <tbody>
        <Row />
        <Row />
      </tbody>
    </table>
  );
};
