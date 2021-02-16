import { FC } from 'react';

import faqs from '../../data/faqs.json';
import { FaqItem } from './FaqItem';

export const Faqs: FC = () => {
  return (
    <>
      {faqs.map((item) => (
        <div key={`faq-${item.id}`}>
          <FaqItem faq={item} />
          {item.id < faqs.length && (
            <span className="block w-full border-b border-slate-gray my-6" />
          )}
        </div>
      ))}
    </>
  );
};
