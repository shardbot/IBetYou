import { FC } from 'react';
import { createPortal } from 'react-dom';

import { useModal } from '../../hooks';
import { Button } from './Button';
import XIcon from '../../assets/icons/x.svg';

const Modal: FC = () => {
  const { content, hideModal, isVisible } = useModal();

  return (
    isVisible &&
    createPortal(
      <>
        {/* Overlay */}
        <div
          className="fixed top-0 left-0 h-screen w-full flex items-center justify-center "
          style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="bg-navy-blue-mamba relative p-5 flex flex-col items-start w-auto rounded-lg shadow-lg">
            {/*Header*/}
            <div className="flex w-full items-end justify-end text-white mb-4">
              <Button onClick={hideModal}>
                <XIcon />
              </Button>
            </div>
            {/*Content*/}
            <div className="flex w-full">{content()}</div>
          </div>
        </div>
      </>,
      document.querySelector('#modal')
    )
  );
};

export default Modal;
