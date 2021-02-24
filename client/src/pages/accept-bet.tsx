import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useReducer, useState } from 'react';

import EyeIcon from '../assets/icons/eye.svg';
import UserIcon from '../assets/icons/user.svg';
import { FormSteps } from '../components/forms/accept-bet';
import { FullScreenLoader } from '../components/global';
import { SecondaryLayout } from '../components/layouts';
import { StepsOverviewContainer } from '../components/steps';
import { useQuery } from '../hooks/useQuery';
import { BetReducer, DefaultBetState } from '../reducers/betReducer';
import { getBet } from '../services/contract';
import { PageWithLayout } from '../types';
import { Web3Context } from './_app';

const steps = [
  {
    id: 1,
    number: 1,
    title: 'Appoint judge',
    icon: <UserIcon />
  },
  {
    id: 2,
    number: 2,
    title: 'Summary',
    icon: <EyeIcon />
  }
];

const AcceptBet: FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bet, setBet] = useReducer(BetReducer, DefaultBetState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const formSteps = FormSteps(setCurrentStep, currentStep, bet, setBet);
  const router = useRouter();
  const query = useQuery();
  const web3 = useContext(Web3Context);

  useEffect(() => {
    if (!query) {
      return;
    }

    if (!query.address) {
      router.push('/');
    }

    const { address } = router.query;
    if (address) {
      getBet(web3, address)
        .then((bet) => {
          setBet({
            type: 'UPDATE_BET',
            payload: bet
          });
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [router, web3.eth.Contract]);

  return (
    <div className="px-6">
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <div className="max-w-xl mx-auto flex flex-col mb-24">
          {/* OVERVIEW */}
          {currentStep <= steps.length && (
            <StepsOverviewContainer steps={steps} currentStep={currentStep} />
          )}
          {/* FORM */}
          {formSteps[currentStep - 1].content}
        </div>
      )}
    </div>
  );
};

(AcceptBet as PageWithLayout).Layout = SecondaryLayout;

export default AcceptBet;
