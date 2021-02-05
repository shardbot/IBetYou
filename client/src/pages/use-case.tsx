import { FC } from 'react';

import { MainLayout } from '../components/layouts';
import { CONNECTION_IMG_SRC, MAKE_IT_RAIN_IMG_SRC, MY_UNIVERSE_IMG_SRC } from '../constants';
import { PageWithLayout } from '../types';

const UseCase: FC = () => {
  return (
    <>
      <div className="mt-16 mb-12 lg:my-16 lg:mb-32 text-center">
        <h1 className="text-3xl lg:text-5xl font-bold">Use Case</h1>
        <p className="text-slate-gray mt-4 text-base lg:text-lg">
          You can use IBetYou for an infinite number of reasons and purposes. Here are our three top
          ones.
        </p>
      </div>
      <section className="py-8 mb-24 3xl:mb-64 3xl:px-56">
        {/* FIRST */}
        <article className="mb-24 lg:mb-40 3xl:mb-56">
          <div className="px-4 lg:px-8 text-center flex flex-col lg:flex-row items-center justify-center lg:justify-between">
            <div className="mb-12 lg:mb-0 text-center lg:text-left lg:w-1/2">
              <h1 className="font-bold text-xl lg:text-3xl mb-6">Achieve your goals</h1>
              <div className="lg:pl-12">
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  Do you dream of losing the extra weight you put on during the lockdown? Or maybe
                  you want to learn how to code or speak Spanish, but never find the time to do it?
                </p>
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  Whatever your goals are, one thing’s for certain.{' '}
                  <span className="text-white font-bold">
                    Finding the proper motivation is tough.
                  </span>{' '}
                  And following through is even tougher.
                </p>
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  IBetYou helps you with that. Find that one family member or friend who’s always
                  throwing snarky comments about your lack of self-discipline.
                </p>
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  Create a bet, select them as your opponent, and set a deadline for yourself.
                </p>
                <p className="text-slate-gray text-base lg:text-lg">
                  When you achieve your goals, you take their money AND get to say See? I was right
                  and you were wrong. Now that’s what we call motivation.
                </p>
              </div>
            </div>
            <img src={MY_UNIVERSE_IMG_SRC} alt="my universe" />
          </div>
        </article>
        {/* SECOND */}
        <article className="mb-24 lg:mb-40 3xl:mb-56">
          <div className="px-4 lg:px-8 text-center flex flex-col lg:flex-row-reverse items-center justify-center lg:justify-between">
            <div className="mb-12 lg:mb-0 text-center lg:text-left lg:w-1/2">
              <h1 className="font-bold text-xl lg:text-3xl mb-6">Spice up your relationships</h1>
              <div className="lg:pl-12">
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  Life can get boring, and this quarantine thing certainly doesn’t help. Days seem
                  to merge into one big blob.
                </p>
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  You’re going through the motions day in and day out. Nothing’s happening and
                  everything is just the same, all the time.
                </p>
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  It’s time to make your life exciting again. To add some thrill, surprise, and FUN
                  to it.
                </p>
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  With IBetYou, you can compete against your friends and family and win real money.
                </p>
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  But you can also lose—and that is exactly what makes it so exciting.
                </p>
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  You get only one shot. You have only one goal.{' '}
                  <span className="text-white font-bold">Be right, or be broke!</span>{' '}
                </p>
              </div>
            </div>
            <img src={CONNECTION_IMG_SRC} alt="connection" />
          </div>
        </article>
        {/* THIRD */}
        <article>
          <div className="px-4 lg:px-8 text-center flex flex-col lg:flex-row items-center justify-center lg:justify-between">
            <div className="mb-12 lg:mb-0 text-center lg:text-left lg:w-1/2">
              <h1 className="font-bold text-xl lg:text-3xl mb-6">Win money</h1>
              <div className="lg:pl-12">
                <p className="text-slate-gray mb-2 text-base lg:text-lg">Your hard work is done!</p>
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  Are your friends nowhere to be found when it’s time to pay up? Do you get the
                  infamous oh I thought we were playing for fun line instead of the money you both
                  agreed on?
                </p>
                <p className="text-slate-gray mb-2 text-base lg:text-lg">Not anymore.</p>
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  IBetYou is on a mission to hold you and your friends accountable.
                </p>
                <p className="text-slate-gray mb-2 text-base lg:text-lg">
                  You’ll always specify the exact amount of cryptocurrency you’re betting on, and
                  we’ll automatically transfer it to the winner when the bet expires.
                </p>
                <p className="text-slate-gray text-base lg:text-lg">
                  Oh, and there’s no way to cancel the bet once it’s confirmed by everyone, so
                  you’ll know no one can suddenly bail out.
                </p>
              </div>
            </div>
            <img src={MAKE_IT_RAIN_IMG_SRC} alt="make it rain" />
          </div>
        </article>
      </section>
    </>
  );
};

(UseCase as PageWithLayout).Layout = MainLayout;

export default UseCase;
