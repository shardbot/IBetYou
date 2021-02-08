import { FC } from 'react';

import { FaqItem } from '../components/faq';
import { MainLayout } from '../components/layouts';
import faqs from '../data/faqs.json';
import { PageWithLayout } from '../types';

const Faq: FC = () => {
  return (
    <>
      <div className="mt-16 mb-12 lg:my-16 lg:mb-32 text-center">
        <h1 className="text-2xl lg:text-5xl font-bold">Frequently Asked Questions</h1>
      </div>
      <section className="py-8">
        {faqs.map((item) => (
          <div key={`faq-${item.id}`}>
            <FaqItem faq={item} />
            {item.id < faqs.length && (
              <span className="block w-full border-b border-slate-gray my-6" />
            )}
          </div>
        ))}
      </section>
    </>
  );
};

(Faq as PageWithLayout).Layout = MainLayout;

export default Faq;
