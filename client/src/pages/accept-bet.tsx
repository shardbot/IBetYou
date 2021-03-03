import { useRouter } from 'next/router';
import { FC, useEffect, useReducer, useState } from 'react';

import EyeIcon from '../assets/icons/eye.svg';
import UserIcon from '../assets/icons/user.svg';
import { FormSteps } from '../components/forms/accept-bet';
import { Error, FullScreenLoader } from '../components/global';
import { SecondaryLayout } from '../components/layouts';
import { StepsOverviewContainer } from '../components/steps';
import { useQuery, useWeb3 } from '../hooks';
import { BetReducer, DefaultBetState } from '../reducers/betReducer';
import { getBet } from '../services/contract';
import { PageWithLayout } from '../types';
import { checkIfIsValidAddress } from '../utils';

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
  const router = useRouter();
  const query = useQuery();
  const { web3 } = useWeb3();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>(undefined);
  const [bet, setBet] = useReducer(BetReducer, DefaultBetState);
  const formSteps = FormSteps(setCurrentStep, currentStep, bet, setBet);

  useEffect(() => {
    if (!query) {
      return;
    }

    if (!query.address || !checkIfIsValidAddress(web3, query.address)) {
      setError(`You are trying to accept the bet that doesn't exist!`);
      return;
    }

    const { address } = router.query;
    if (address && checkIfIsValidAddress(web3, address)) {
      getBet(web3, address)
        .then((bet) => {
          // check if bet is in the right state
          if (+bet.betState === 1) {
            setBet({
              type: 'UPDATE_BET',
              payload: bet
            });
            setIsLoading(false);
          } else {
            setError(`You are trying to accept the bet that is already accepted!`);
            return;
          }
        })
        .catch((e) => {
          setError(`You are trying to accept the bet that doesn't exist!`);
          console.log(e);
        });
    }
  }, [router, web3.eth.Contract]);

  if (error) {
    return (
      <div className="px-6">
        <Error message={error} />
      </div>
    );
  }

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
