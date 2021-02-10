import { FC, MouseEventHandler } from 'react';

import { Button } from '../../global';

interface ActionGroupProps {
  handleBack?: MouseEventHandler<HTMLButtonElement>;
  handleContinue?: MouseEventHandler<HTMLButtonElement>;
  isSubmit?: boolean;
  isLoading?: boolean;
  error?: boolean;
}

export const ActionGroup: FC<ActionGroupProps> = ({
  handleBack,
  handleContinue,
  isSubmit,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <Button className="btn-primary w-1/3 disabled:opacity-50 " disabled onClick={handleContinue}>
        Please wait...
      </Button>
    );
  }

  return (
    <>
      {handleBack && (
        <Button className="btn-secondary w-1/3 mr-4" onClick={handleBack}>
          Back
        </Button>
      )}
      <Button className="btn-primary w-1/3" disabled={error} onClick={handleContinue}>
        {isSubmit ? 'Confirm' : 'Next'}
      </Button>
    </>
  );
};
