import { FC, useState } from 'react';

import MinusIcon from '../../assets/icons/minus.svg';
import PlusIcon from '../../assets/icons/plus.svg';

interface FaqItemProps {
  faq: {
    id: number;
    title: string;
    content: Array<string>;
  };
}

export const FaqItem: FC<FaqItemProps> = ({ faq }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="px-4">
      <div className="flex items-center">
        <button className="mr-4 self-start pt-0.5" onClick={handleToggle}>
          {isVisible ? <MinusIcon /> : <PlusIcon />}
        </button>
        <h1 className="font-bold text-lg">{faq.title}</h1>
      </div>
      <div className={['lg:pl-12 mt-2', `${!isVisible ? 'hidden' : ''}`].join(' ')}>
        {faq.content.map((text, i) => (
          <p key={`faq-item${i}`} className="sub-text mb-2">
            {text}
          </p>
        ))}
      </div>
    </div>
  );
};
