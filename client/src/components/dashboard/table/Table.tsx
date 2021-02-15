import { FC } from 'react';

import { Header as TableHeader } from './Header';
import { Row } from './Row';

export const Table: FC = () => {
  return (
    <table className="table-auto">
      <TableHeader />
      <tbody>
        <Row />
      </tbody>
    </table>
  );
};
