/**
 * SuccessScreen Component
 *
 * @description
 * A reusable success screen component for displaying payment confirmation
 * with optional redirection functionality.
 *
 * @example
 * ```tsx
 * <SuccessScreen
 *   title="Payment Successful"
 *   message="Your transaction has been completed successfully."
 *   redirectUrl="/dashboard"
 *   redirectDelay={3000}
 * />
 * ```
 */

import React, { useEffect } from "react";
import { Check } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface SuccessProps {
  title?: string;
  message?: string;
  redirectUrl?: string;
  redirectDelay?: number;
  onRedirect?: () => void;
}

export const Success: React.FC<SuccessProps> = ({
  title = "Payment Successful",
  message = "Thank you for your payment. Your transaction has been completed successfully.",
  redirectUrl,
  redirectDelay = 3000,
  onRedirect,
}) => {
  useEffect(() => {
    if (redirectUrl || onRedirect) {
      const timer = setTimeout(() => {
        if (onRedirect) {
          onRedirect();
        } else if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      }, redirectDelay);

      return () => clearTimeout(timer);
    }
  }, [redirectUrl, redirectDelay, onRedirect]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
        <CardHeader className="bg-purple-900 text-white">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-800">{message}</p>
          </div>
          {(redirectUrl || onRedirect) && (
            <p className="text-gray-600 text-center">
              Redirecting{redirectUrl && " to merchant site"}...
            </p>
          )}
        </CardContent>

        <div className="text-center text-sm text-gray-500 mt-2 mb-3 flex items-center justify-center">
          <img
            src="https://i.ibb.co/YhgZz9B/bc-icon.png"
            alt="BananaCrystal Logo"
            className="h-6 mr-2"
          />
          Powered by BananaCrystal
        </div>
      </Card>
    </div>
  );
};
