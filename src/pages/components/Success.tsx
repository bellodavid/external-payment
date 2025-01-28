/* eslint-disable */
// @ts-nocheck

import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface SuccessProps {
  title?: string;
  message?: string;
  redirectUrl?: string;
  redirectDelay?: number;
  onRedirect?: () => void;
  transactionId?: string;
}

export const Success: React.FC<SuccessProps> = ({
  title = "Payment Successful",
  message = "Thank you for your payment. Your transaction has been completed successfully.",
  redirectUrl,
  redirectDelay = 3000,
  onRedirect,
  transactionId,
}) => {
  const [countdown, setCountdown] = useState(redirectDelay / 1000);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    // Redirect timer
    const redirectTimer = setTimeout(() => {
      if (onRedirect) {
        onRedirect();
      } else if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }, redirectDelay);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [redirectUrl, redirectDelay, onRedirect]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
        <CardHeader className="bg-[#2e3b61] text-white">
          <CardTitle className="text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-2">{message}</p>
            {transactionId && (
              <p className="text-sm text-gray-600 mb-4">
                Transaction ID: {transactionId}
              </p>
            )}
          </div>
          
          {(redirectUrl || onRedirect) && (
            <div className="text-center">
              <p className="text-gray-600">
                Redirecting{redirectUrl && " to merchant site"} in {countdown} seconds...
              </p>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-3">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${(countdown / (redirectDelay / 1000)) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>

        <div className="text-center text-sm text-gray-500 mt-2 mb-3 flex items-center justify-center">
          <img
            src="https://media.bananacrystal.com/wp-content/uploads/2024/07/24181620/Logo-128x128-2.png"
            alt="BananaCrystal Logo"
            className="h-6 mr-2"
          />
          Powered by BananaCrystal
        </div>
      </Card>
    </div>
  );
};