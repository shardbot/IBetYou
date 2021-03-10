import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useReducer, useState } from 'react';

import EyeIcon from '../assets/icons/eye.svg';
import { FormSteps } from '../components/forms/judge-accept';
import { Error, FullScreenLoader } from '../components/global';
import { SecondaryLayout } from '../components/layouts';
import { StepsOverviewContainer } from '../components/steps';
import { useQuery } from '../hooks';
import { BetReducer, DefaultBetState } from '../reducers/betReducer';
import { getBet } from '../services/contract';
import { PageWithLayout } from '../types';
import { Web3Context } from './_app';
import { checkIfIsValidAddress } from '../utils';

const steps = [
  {
    id: 1,
    number: 1,
    title: 'Summary',
    icon: <EyeIcon />
  }
];

const Judge: FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bet, setBet] = useReducer(BetReducer, DefaultBetState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>(undefined);
  const formSteps = FormSteps(setCurrentStep, currentStep, bet);
  const router = useRouter();
  const web3 = useContext(Web3Context);
  const query = useQuery();

  useEffect(() => {
    if (!query) {
      return;
    }

    if ((!query.address && !query.type) || !checkIfIsValidAddress(web3, query.address)) {
      setError(`You are trying to accept the bet that doesn't exist!`);
      return;
    }

    const { address } = query;
    if (address) {
      getBet(web3, address)
        .then((bet) => {
          // check if bet is in the right state
          if (+bet.betState === 2) {
            setBet({
              type: 'UPDATE_BET',
              payload: bet
            });
            setIsLoading(false);
          } else {
            setError(`You are trying to be a judge on the bet that already have appointed judges!`);
          }
        })
        .catch((e) => {
          setError(`You are trying to be a judge on the bet that doesn't exist!`);
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

(Judge as PageWithLayout).Layout = SecondaryLayout;

export default Judge;
