import React, { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Success } from "./components/Sucess";
import { AccountCreationModal } from "./components/ACModal";
import { CURRENCY } from "@/constants";
import { usePaymentFlow } from "@/hooks/usePaymentFlow";
import { PaymentDetails } from "@/types";
import FirstScreen from "./components/FirstScreen";
import SecondScreen from "./components/SecondScreen";

interface USDTPaymentProps {
  storeId: string;
  amount: number;
  currency: string;
  walletAddress: string;
  description: string;
  callbackUrl: string;
  onSuccess?: (transactionId: string) => void;
}

/**
 * USDTPayment Component
 *
 * This component manages the entire USDT payment flow, including user information collection,
 * payment processing, and success handling.
 *
 * @param {USDTPaymentProps} props - The component props
 * @returns {React.ReactElement} The rendered component
 */
const USDTPayment: React.FC<USDTPaymentProps> = ({
  storeId,
  amount = 100,
  currency = "ZAR",
  walletAddress,
  description = "Delux Ocean View Suite. Check-in: 2024-09-15, Check-out: 2024-09-20. 2 Guests, 5 Nights total",
  callbackUrl,
  onSuccess,
}) => {
  const [step, setStep] = useState<number>(1);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const {
    paymentDetails,
    error,
    success,
    isLoading,
    handleVerifyPayment,
    handleNext,
  } = usePaymentFlow(storeId, amount, description, callbackUrl);

  const handleProceedToCheckout = () => {
    setShowAccountModal(false);
  };

  const handleVerifyAccount = () => {
    window.location.href = "mailto:";
  };

  if (success) {
    return <Success />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto mt-10 bg-white shadow-lg">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {step === 1 ? (
          <FirstScreen
            amount={amount}
            currency={currency}
            description={description}
            onNext={handleNext}
          />
        ) : (
          <SecondScreen
            amount={amount}
            currency={currency}
            walletAddress={walletAddress}
            paymentDetails={paymentDetails as PaymentDetails}
            onVerifyPayment={handleVerifyPayment}
            isLoading={isLoading}
          />
        )}
      </Card>
      <AccountCreationModal
        show={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onProceed={handleProceedToCheckout}
        onVerify={handleVerifyAccount}
      />
    </div>
  );
};

export default USDTPayment;
