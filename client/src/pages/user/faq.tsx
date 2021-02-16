import { FC } from 'react';

import { Faqs } from '../../components/faq';
import { SecondaryLayout } from '../../components/layouts';
import { PageWithLayout } from '../../types';

const Faq: FC = () => {
  return (
    <div className="px-4 xs:px-8 md:px-12 xl:px-16 2xl:px-32 3xl:px-64">
      <h1 className="font-bold text-3xl mb-2">FAQ</h1>
      <span className="text-slate-gray">Frequently asked questions</span>
      {/* FAQ */}
      <div className="mt-16 mb-16">
        <Faqs />
      </div>
    </div>
  );
};

(Faq as PageWithLayout).Layout = SecondaryLayout;

export default Faq;
