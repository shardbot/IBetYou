import { FC } from 'react';

import { MainLayout } from '../components/layouts';
import { POSITIVE_ATTITUDE_IMG_SRC, PRODUCT_TEARDOWN_IMG_SRC, SAVINGS_IMG_SRC } from '../constants';
import { PageWithLayout } from '../types';

const Onboarding: FC = () => {
  return (
    <>
      <div className="mt-16 mb-12 lg:my-16 lg:mb-32 text-center">
        <h1 className="text-3xl lg:text-5xl font-bold">Onboarding</h1>
      </div>
      <section className="py-8 mb-24 3xl:mb-64 3xl:px-56">
        {/* FIRST */}
        <article className="mb-24 lg:mb-40 3xl:mb-56">
          <div className="px-4 lg:px-8 text-center flex flex-col lg:flex-row items-center justify-center lg:justify-between">
            <div className="mb-12 lg:mb-0 text-center lg:text-left lg:w-1/2">
              <h1 className="font-bold text-xl lg:text-3xl mb-6">
                A) Prove you’re right and win money.
              </h1>
              <div className="lg:pl-12">
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  Select your opponent, specify your bet, and appoint a judge from your side by
                  adding their name and email.
                </p>
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  When you initiate a bet, you choose how much money will be at stake.
                </p>
                <p className="text-slate-gray text-base lg:text-lg">
                  Click confirm when you’re all set.
                </p>
              </div>
            </div>
            <img src={SAVINGS_IMG_SRC} alt="savings" />
          </div>
        </article>
        {/* SECOND */}
        <article className="mb-24 lg:mb-40 3xl:mb-56">
          <div className="px-4 lg:px-8 text-center flex flex-col lg:flex-row items-center justify-center lg:justify-between">
            <div className="mb-12 lg:mb-0 text-center lg:text-left lg:w-1/2">
              <h1 className="font-bold text-xl lg:text-3xl mb-6">B) Get everyone on board</h1>
              <div className="lg:pl-12">
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  Once you hit the confirmation button, we send a message to the opponent and judge
                  you selected.
                </p>
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  We ask them to confirm that they agree with your terms and that they’re up for the
                  challenge.
                </p>
              </div>
            </div>
            <img src={POSITIVE_ATTITUDE_IMG_SRC} alt="positive attitude" />
          </div>
        </article>
        {/* THIRD */}
        <article>
          <div className="px-4 lg:px-8 text-center flex flex-col lg:flex-row items-center justify-center lg:justify-between">
            <div className="mb-12 lg:mb-0 text-center lg:text-left lg:w-1/2">
              <h1 className="font-bold text-xl lg:text-3xl mb-6">C) Your opponent’s turn</h1>
              <div className="lg:pl-12">
                <p className="text-slate-gray mb-2 text-base lg:text-lg">Your hard work is done!</p>
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  Now you just wait for your opponent to fill in the same details.
                </p>
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  To keep things fair, he gets to choose a judge from his side too. We’ll also ask
                  him to lock in the amount you specified when creating the bet.
                </p>
                <p className="text-slate-gray text-base lg:text-lg">Your hard work is done!</p>
              </div>
            </div>
            <img src={PRODUCT_TEARDOWN_IMG_SRC} alt="product teardown" />
          </div>
        </article>
      </section>
    </>
  );
};

(Onboarding as PageWithLayout).Layout = MainLayout;

export default Onboarding;
