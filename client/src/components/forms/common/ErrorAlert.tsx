import {FC} from "react";

interface ErrorAlertProps {
  message: string;
}

export const ErrorAlert: FC<ErrorAlertProps> = ({ message }) => {
  return (
    <div className="w-full border border-light-red text-light-red text-center p-4 mt-4">
      <span>{message}</span>
    </div>
  );
};