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

  const handleVerifyPayment = async () => {
    setIsLoading(true);
    try {
      const result = await verifyPayment(storeId);
      if (result.success) {
        setSuccess(true);
      } else {
        setError("Payment verification failed");
      }
    } catch (err) {
      setError("An error occurred during payment verification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async (formData: any) => {
    try {
      await Auth.signup({
        email: formData.email.toLowerCase(),
        password: formData.password,
        terms_of_service: true,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
    } catch (err) {
      setError("Failed to create account or initialize payment");
    }
  };

  return {
    paymentDetails,
    error,
    success,
    isLoading,

    handleVerifyPayment,
    handleNext,
  };
};
