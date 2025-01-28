/* eslint-disable */
// @ts-nocheck

import React, { useEffect, useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check, Copy, HelpCircle } from "lucide-react";
import { PaymentDetails } from "@/types";
import { formatTime, calculateFee } from "@/util/helpers";
import { useClipboard } from "@/hooks/useClipboard";
import { useUsdtEquivalent } from "@/hooks/useUsdtEquivalent";

interface SecondScreenProps {
  amount: number;
  currency: string;
  walletAddress: string;
  paymentDetails: PaymentDetails;
  onVerifyPayment: () => void;
  isLoading: boolean;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    signUpConsent: boolean;
  };
}

const PAYMENT_TIMEOUT_MINUTES = 30; // 30 minutes timeout

const SecondScreen: React.FC<SecondScreenProps> = ({
  amount,
  currency,
  walletAddress,
  onVerifyPayment,
  isLoading,
  formData,
}) => {
  const [paymentHash, setPaymentHash] = useState("");
  const [showHashTooltip, setShowHashTooltip] = useState(false);
  const { copied, copyToClipboard } = useClipboard();
  const [timeRemaining, setTimeRemaining] = useState(
    PAYMENT_TIMEOUT_MINUTES * 60
  ); // Convert minutes to seconds

  let totalAmount = amount + calculateFee(amount);
  const { usdtEquivalent } = useUsdtEquivalent({ totalAmount, currency });

  // Countdown timer effect
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Format time function
  const formatRemainingTime = (seconds: number) => {
    if (seconds <= 0) return "Time expired";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleVerifyPayment = () => {
    if (timeRemaining <= 0) {
      // Handle expired payment session
      alert("Payment session has expired. Please start over.");
      return;
    }
    onVerifyPayment();
  };

  return (
    <>
      <CardHeader className="bg-[#4c3f84] text-white">
        <CardTitle>USDT Payment Checkout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {/* Payment details */}
        <div className="bg-gray-100 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold">
              {amount.toFixed(2)} {currency}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Fee:</span>
            <span className="font-semibold text-orange-600">
              {calculateFee(amount).toFixed(2)} {currency}
            </span>
          </div>
          <div className="flex justify-between items-center border-t pt-2">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-semibold">
              {totalAmount.toFixed(2)} {currency}
            </span>
          </div>
        </div>

        {/* USDT Equivalent */}
        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-purple-800">
            USDT Equivalent
          </h3>
          <p className="text-3xl font-bold text-purple-900">
            {usdtEquivalent?.toFixed(2) || totalAmount.toFixed(2)} USDT
          </p>
        </div>

        {/* Time Remaining */}
        <div
          className={`text-center p-4 rounded-lg ${
            timeRemaining <= 300 ? "bg-red-100" : "bg-orange-100"
          }`}
        >
          <h3
            className={`text-lg font-semibold ${
              timeRemaining <= 300 ? "text-red-800" : "text-orange-800"
            }`}
          >
            Time Remaining
          </h3>
          <p
            className={`text-3xl font-bold ${
              timeRemaining <= 300 ? "text-red-600" : "text-orange-600"
            }`}
          >
            {formatRemainingTime(timeRemaining)}
          </p>
          {timeRemaining <= 300 && timeRemaining > 0 && (
            <p className="text-red-600 text-sm mt-1">
              Payment session expiring soon!
            </p>
          )}
          {timeRemaining <= 0 && (
            <p className="text-red-600 text-sm mt-1">
              Payment session expired. Please start over.
            </p>
          )}
        </div>

        {/* Recipient USDT Address */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-purple-900">
            Recipient USDT Address (Polygon Network)
          </h3>
          <div className="flex">
            <Input className="text-gray-500" value={walletAddress} readOnly />
            <Button
              variant="outline"
              size="icon"
              className="ml-2"
              onClick={() => copyToClipboard(walletAddress)}
            >
              {copied ? (
                <Check className="h-4 w-4 text-purple-900" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Polygon Network Only! Ensure you're sending USDT on the Polygon
            network.
          </AlertDescription>
        </Alert>

        {/* Transaction Hash Input */}
        <div className="space-y-2">
          <label
            htmlFor="paymentHash"
            className="flex text-sm font-medium text-gray-700 items-center"
          >
            Transaction Hash
            <div className="relative inline-block ml-2">
              <HelpCircle
                className="h-4 w-4 text-gray-400 cursor-help"
                onMouseEnter={() => setShowHashTooltip(true)}
                onMouseLeave={() => setShowHashTooltip(false)}
                onClick={() => setShowHashTooltip(!showHashTooltip)}
              />
              {showHashTooltip && (
                <div className="absolute bg-black text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-2 w-64 z-10">
                  The transaction hash is a unique identifier for your USDT
                  transfer on the Polygon network. You can find it in your
                  wallet's transaction history after sending the payment.
                  <svg
                    className="absolute text-black h-2 w-full left-0 top-full"
                    x="0px"
                    y="0px"
                    viewBox="0 0 255 255"
                    xmlSpace="preserve"
                  >
                    <polygon
                      className="fill-current"
                      points="0,0 127.5,127.5 255,0"
                    />
                  </svg>
                </div>
              )}
            </div>
          </label>
          <Input
            id="paymentHash"
            placeholder="Enter your transaction hash"
            value={paymentHash}
            onChange={(e) => setPaymentHash(e.target.value)}
          />
        </div>

        <Button
          onClick={handleVerifyPayment}
          className="w-full bg-[#4c3f84] hover:bg-[#4c3f84] text-white"
          disabled={isLoading || timeRemaining <= 0}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="ml-2">Processing...</span>
            </div>
          ) : timeRemaining <= 0 ? (
            "Session Expired"
          ) : (
            "I have paid"
          )}
        </Button>
      </CardContent>
    </>
  );
};

export default SecondScreen;
