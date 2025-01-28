/* eslint-disable */
// @ts-nocheck

import { useState } from "react";
import { PaymentDetails } from "@/types";
import { verifyPayment } from "@/util/helpers";
import { Auth } from "@/service";

export const usePaymentFlow = (
  storeId: string,
  amount: number,
  description: string,
  callbackUrl: string
) => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  const handleVerifyPayment = () => {};

  return {
    paymentDetails,
    error,
    success,
    isLoading,
    step,
    handleVerifyPayment,
  };
};
