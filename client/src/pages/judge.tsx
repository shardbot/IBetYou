import { FC, useContext, useEffect, useReducer, useState } from 'react';

import EyeIcon from '../assets/icons/eye.svg';
import { FormSteps } from '../components/forms/judge-accept';
import { SecondaryLayout } from '../components/layouts';
import { StepsOverviewContainer } from '../components/steps';
import { PageWithLayout } from '../types';
import { FullScreenLoader } from '../components/global';
import { useRouter } from 'next/router';
import { getBet } from '../services/contract';
import { Web3Context } from './_app';
import { BetReducer, DefaultBetState } from '../reducers/betReducer';

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
  const formSteps = FormSteps(setCurrentStep, currentStep, bet);
  const router = useRouter();
  const web3 = useContext(Web3Context);

  useEffect(() => {
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

(Judge as PageWithLayout).Layout = SecondaryLayout;

export default Judge;
