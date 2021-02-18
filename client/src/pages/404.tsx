import { FC } from 'react';

import { LinkButton, Meta } from '../components/global';
import { LOGO_IMG_SRC } from '../constants';

const Custom404: FC = () => {
  return (
    <>
      <Meta title="IBetYou" />

      <div className="container mx-auto">
        <div className="flex flex-col items-center mt-16">
          <img src={LOGO_IMG_SRC} alt="IBetYou logo" />
          <div className="text-center my-16">
            <h1 className="font-bold text-3xl lg:text-5xl">Ooops!</h1>
            <p className="mt-8 text-lg lg:text-xl">We can't find the page you are looking for!</p>
          </div>
          <LinkButton className="btn-primary px-12" to="/" text="Home" />
        </div>
      </div>
    </>
  );
};

export default Custom404;
