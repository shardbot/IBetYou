import { FC } from 'react';

import { Faqs } from '../components/faq';
import { MainLayout } from '../components/layouts';
import { PageWithLayout } from '../types';

const Faq: FC = () => {
  return (
    <>
      <div className="mt-16 mb-12 lg:my-16 lg:mb-32 text-center">
        <h1 className="text-2xl lg:text-5xl font-bold">Frequently Asked Questions</h1>
      </div>
      <section className="py-8">
        <Faqs />
      </section>
    </>
  );
};

(Faq as PageWithLayout).Layout = MainLayout;

export default Faq;
