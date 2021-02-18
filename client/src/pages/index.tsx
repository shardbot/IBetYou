import { useRouter } from 'next/router';
import { FC, SyntheticEvent } from 'react';

import ArrowRightIcon from '../assets/icons/arrow-right.svg';
import DollarSignIcon from '../assets/icons/dollar-sign.svg';
import KeyIcon from '../assets/icons/key.svg';
import DashboardIcon from '../assets/icons/layout.svg';
import PlusCircleIcon from '../assets/icons/plus-circle.svg';
import UnlockIcon from '../assets/icons/unlock.svg';
import { Button } from '../components/global';
import { MainLayout } from '../components/layouts';
import {
  DIGITAL_CURRENCY_IMG_SRC,
  MONEY_TRANSFER_IMG_SRC,
  ONLINE_TRANSACTIONS_IMG_SRC,
  SECURITY_ON_IMG_SRC
} from '../constants';
import { useAuth } from '../hooks/useAuth';
import { PageWithLayout } from '../types';

const Home: FC = () => {
  const { connectWallet, isLoggedIn } = useAuth();
  const router = useRouter();

  const handleGetStarted = async (e: SyntheticEvent) => {
    const connect = await connectWallet();

    if (connect) {
      router.push('user/dashboard');
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="py-8 mb-24 lg:mt-24 xl:my-24 3xl:my-64">
        <div className="px-4 lg:px-8 text-center flex flex-col lg:flex-row items-center justify-center lg:justify-between">
          <div className="mb-12 lg:mb-0 text-center lg:text-left lg:w-1/2">
            <h1 className="font-bold text-3xl lg:text-6xl mb-6">
              Create irreversible bets in under 10 minutes, prove you’re right, and win money.
            </h1>
            <p className="text-slate-gray mb-6 text-base lg:text-lg">
              IBetYou is a smarter way to place and track your bets. Keep ‘em all in one place, make
              sure no one bails out, and win money in your favorite cryptocurrency.
            </p>
            <Button
              className="btn-primary text-xs lg:text-base px-16 lg:px-24 py-4"
              onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>
          <img
            className="lg:w-1/2 lg:h-1/2 lg:ml-16"
            src={MONEY_TRANSFER_IMG_SRC}
            alt="money transfer"
          />
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="py-8 mb-24 3xl:mb-64">
        {/* FIRST */}
        <article className="mb-24 lg:mb-40 3xl:mb-56">
          <div className="px-4 lg:px-8 text-center flex flex-col lg:flex-row-reverse items-center justify-center lg:justify-between">
            <div className="mb-12 lg:mb-0 text-center lg:text-left lg:w-1/2">
              <h1 className="font-bold text-2xl lg:text-5xl mb-6">
                Prove you’re right and win money.
              </h1>
              <p className="text-slate-gray mb-2 text-base lg:text-lg">
                There are few more satisfying things in life than proving you’re right. IBetYou
                couples this with winning money in a cryptocurrency of your choice.
              </p>
              <p className="text-slate-gray mb-2 text-base lg:text-lg">
                Win a bet and we’ll deliver your opponent’s money straight to your existing crypto
                wallet.{' '}
              </p>
              <p className="text-slate-gray text-base lg:text-lg">
                Prove you’re right. Show they’re wrong.{' '}
                <span className="text-white font-bold">Get sweet, sweet crypto</span>.
              </p>
            </div>
            <img src={DIGITAL_CURRENCY_IMG_SRC} alt="money transfer" />
          </div>
        </article>
        {/* SECOND */}
        <article className="mb-24 lg:mb-40 3xl:mb-56">
          <div className="px-4 lg:px-8 text-center flex flex-col lg:flex-row items-center justify-center lg:justify-between">
            <div className="mb-12 lg:mb-0 text-center lg:text-left lg:w-1/2">
              <h1 className="font-bold text-2xl lg:text-5xl mb-6">
                Set your own rules, assign custom deadlines, and track your bets — all in one place.
              </h1>
              <p className="text-slate-gray mb-2 text-base lg:text-lg">
                IBetYou is an all-in-one betting platform that lets you choose who to bet with, what
                to bet on, and when your bet expires.
              </p>
              <p className="text-slate-gray mb-2 text-base lg:text-lg">
                It also stores all your past and active bets so you can track how much money you
                earned and how many times you won.
              </p>
              <p className="text-slate-gray text-base lg:text-lg">
                No limitations. No guesswork.{' '}
                <span className="text-white font-bold">No forgetting.</span>.
              </p>
            </div>
            <img src={ONLINE_TRANSACTIONS_IMG_SRC} alt="money transfer" />
          </div>
        </article>
        {/* THIRD */}
        <article>
          <div className="px-4 lg:px-8 text-center flex flex-col lg:flex-row-reverse items-center justify-center lg:justify-between">
            <div className="mb-12 lg:mb-0 text-center lg:text-left lg:w-1/2">
              <h1 className="font-bold text-2xl lg:text-5xl mb-6">
                Secure your payouts and play for free, forever.
              </h1>
              <p className="text-slate-gray mb-2 text-base lg:text-lg">
                When you and your friends confirm a bet, we instantly put a smart contract in place.
                That means no one can wriggle their way out of paying when the bet expires.
              </p>
              <p className="text-slate-gray mb-2 text-base lg:text-lg">
                You get all that—and more—for free, because we want to put a stop to false promises
                and unfulfilled bets worldwide.
              </p>
              <p className="text-slate-gray text-base lg:text-lg">
                No extra fees. No hidden costs.{' '}
                <span className="text-white font-bold">Entirely free.</span>.
              </p>
            </div>
            <img src={SECURITY_ON_IMG_SRC} alt="money transfer" />
          </div>
        </article>
      </section>

      {/* FEATURES */}
      <section className="py-8 mb-24 3xl:mb-64 xl:px-24">
        <div className="px-4 lg:px-8 text-center flex flex-col items-center justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-16 lg:mb-24">IBetYou Features</h1>
          <ul className="flex flex-col lg:flex-row">
            <li className="p-4 mb-8 lg:mb-0 flex flex-col items-center">
              <span className="mb-6 md:mb-12">
                <DashboardIcon className="h-16 2xl:h-24 w-16 2xl:w-24" />
              </span>
              <h3 className="mb-4 font-bold text-xl 2xl:text-2xl">BEGINNER-FRIENDLY DASHBOARD</h3>
              <p className="text-slate-gray mb-2 text-base lg:text-lg">
                When you and your friends confirm a bet, we instantly put a smart contract in place.
                That means no one can wriggle their way out of paying when the bet expires.
              </p>
              <p className="text-slate-gray text-base lg:text-lg">
                After you’ve used it once, you kinda become an expert.
              </p>
            </li>
            <li className="p-4 mb-8 lg:mb-0 flex flex-col items-center">
              <span className="mb-6 md:mb-12">
                <KeyIcon className="h-16 2xl:h-24 w-16 2xl:w-24" />
              </span>
              <h3 className="mb-4 font-bold text-xl 2xl:text-2xl">EASY LOGIN</h3>
              <p className="text-slate-gray text-base lg:text-lg">
                You don’t need to create a new account to access IBetYou. Just log in with your
                existing crypto wallet account and you’re in.
              </p>
            </li>
            <li className="p-4 flex flex-col items-center">
              <span className="mb-6 md:mb-12">
                <DollarSignIcon className="h-16 2xl:h-24 w-16 2xl:w-24" />
              </span>
              <h3 className="mb-4 font-bold text-xl 2xl:text-2xl">NO IN-APP PURCHASES</h3>
              <p className="text-slate-gray text-base lg:text-lg">
                No, this isn’t yet another freemium that will pitch you upsells later. Our app is
                free, will remain free, and will never try to sell you silly upgrades.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* HOW DO I GET STARTED */}
      <section className="py-8 mb-16 xl:px-24">
        <div className="px-4 lg:px-8 text-center flex flex-col items-center justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-16 lg:mb-24">How do I get started?</h1>
          <ul className="flex flex-col lg:flex-row">
            <li className="p-4 mb-8 lg:mb-0 flex flex-col items-center flex-1">
              <span className="mb-6 lg:mb-12">
                <UnlockIcon className="h-16 2xl:h-24 w-16 2xl:w-24" />
              </span>
              <p className="text-slate-gray text-base lg:text-lg">
                Log in with your existing crypto wallet.
              </p>
            </li>
            <span className="transform rotate-90 lg:rotate-0 self-center mb-8 lg:mx-8">
              <ArrowRightIcon className="h-12 2xl:h-18 w-12 2xl:w-18" />
            </span>
            <li className="p-4 mb-8 lg:mb-0 flex flex-col items-center flex-1">
              <span className="mb-6 lg:mb-12">
                <PlusCircleIcon className="h-16 2xl:h-24 w-16 2xl:w-24" />
              </span>
              <p className="text-slate-gray text-base lg:text-lg">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>
            </li>
            <span className="transform rotate-90 lg:rotate-0 self-center mb-8 lg:mx-8">
              <ArrowRightIcon className="h-12 2xl:h-18 w-12 2xl:w-18" />
            </span>
            <li className="p-4 flex flex-col items-center flex-1">
              <span className="mb-6 lg:mb-12">
                <DollarSignIcon className="h-16 2xl:h-24 w-16 2xl:w-24" />
              </span>
              <p className="text-slate-gray text-base lg:text-lg">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>
            </li>
          </ul>
        </div>
      </section>
      <div className="flex justify-center">
        <Button
          className="btn-primary text-xs lg:text-base px-16 lg:px-24 py-4"
          onClick={handleGetStarted}>
          Get Started
        </Button>
      </div>
    </>
  );
};

(Home as PageWithLayout).Layout = MainLayout;

export default Home;
