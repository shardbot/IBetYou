import { ChangeEvent, Dispatch, FC, SetStateAction, SyntheticEvent, useState } from 'react';

import { Button, Input } from '../../global';
import { Header } from '../common';
import { ActionGroup } from '../common/ActionGroup';

type CheckBoxChoices = 'no' | 'yes';

interface ExpirationDateFormProps {
  setStep: Dispatch<SetStateAction<number>>;
  step: number;
}

export const ExpirationDateForm: FC<ExpirationDateFormProps> = ({ setStep, step }) => {
  const [checkBox, setCheckBox] = useState<CheckBoxChoices>('no');

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    setCheckBox(e.target.value as CheckBoxChoices);
  };

  const handleContinue = (e: SyntheticEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleBack = (e: SyntheticEvent) => {
    e.preventDefault();
    setStep(step - 1);
  };

  return (
    <form>
      <Header
        title="Let’s start with your opponent email"
        subText="Please fill in the details below so that we can send the invitation to your opponent."
        className="mb-12 sm:mb-24"
      />

      <div className="mb-12 sm:mb-24">
        <div className="flex flex-col sm:flex-row w-full mx-auto sm:max-w-min">
          {/* FIRST CHOICE - NO*/}
          <div className="radio-box sm:mr-16 cursor-pointer">
            <input
              className="appearance-none"
              id="no"
              type="radio"
              value="no"
              name="no"
              checked={'no' === checkBox}
              onChange={handleCheck}
            />
            <label
              className="rounded-lg border border-slate-gray hover:border-green-cyan mx-auto w-32 h-32 sm:w-48 sm:h-48 block font-bold flex items-center justify-center text-xl cursor-pointer"
              htmlFor="no">
              No
            </label>
          </div>
          {/* FIRST CHOICE - YES*/}
          <div className="radio-box">
            <input
              className="appearance-none"
              id="yes"
              type="radio"
              value="yes"
              name="yes"
              checked={'yes' === checkBox}
              onChange={handleCheck}
            />
            <label
              className="cursor-pointer rounded-lg border border-slate-gray hover:border-green-cyan mx-auto w-32 h-32 sm:w-48 sm:h-48 block font-bold flex items-center justify-center text-xl"
              htmlFor="yes">
              Yes
            </label>
          </div>
        </div>

        <div className={`mt-12 ${checkBox === 'no' ? 'hidden' : ''}`}>
          <Input classes="w-full" name="expirationDate" label="Date of expiry" type="date" />
        </div>
      </div>

      <div className="flex justify-end">
        <ActionGroup handleBack={handleBack} handleContinue={handleContinue} />
      </div>
    </form>
  );
};
