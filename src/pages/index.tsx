import React, { useEffect, useState } from "react";
import { AlertCircle, Check, Copy, HelpCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  calculateFee,
  formatTime,
  generatePassword,
  initializePayment,
  verifyPayment,
} from "@/util/helpers";
import { Auth } from "@/service";

interface USDTPaymentProps {
  storeId: string;
  amount: number;
  currency: string;
  description: string;
  callbackUrl: string;
  onSuccess?: (transactionId: string) => void;
}

interface PaymentDetails {
  walletAddress: string;
  expiresAt: string;
}

const USDTPayment: React.FC<USDTPaymentProps> = ({
  storeId,
  amount = 10000,
  currency = "ZAR",
  description = "Delux Ocean View Suite. Check-in: 2024-09-15, Check-out: 2024-09-20. 2 Guests, 5 Nights total",
  callbackUrl,
  onSuccess,
}) => {
  const [step, setStep] = useState<number>(1);
  const [timeRemaining, setTimeRemaining] = useState<number>(1800); // 30 minutes
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [paymentHash, setPaymentHash] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [accountCreated, setAccountCreated] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [usdtEquivalent, setUsdtEquivalent] = useState<number | null>(null);

  const totalAmount = amount + calculateFee(amount);

  useEffect(() => {
    if (paymentDetails || (step === 2 && timeRemaining > 0)) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step, paymentDetails]);

  useEffect(() => {
    const fetchUsdtEquivalent = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=${currency.toLowerCase()}`
        );
        const data = await response.json();
        const usdtPrice = data.tether[currency.toLowerCase()];
        setUsdtEquivalent(amount / usdtPrice);
      } catch (err) {
        console.error("Error fetching USDT equivalent:", err);
        setError("Failed to fetch USDT equivalent");
      }
    };

    fetchUsdtEquivalent();
  }, [amount, currency]);

  const handleInitializePayment = async () => {
    setIsLoading(true);
    // try {
    //   const data = await initializePayment(
    //     storeId,
    //     usdtEquivalent || totalAmount,
    //     description,
    //     callbackUrl
    //   );
    //   setPaymentDetails(data);
    //   setTimeRemaining(
    //     Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000)
    //   );
    // } catch (err) {
    //   setError("Failed to initialize payment");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleVerifyPayment = async () => {
    setIsLoading(true);
    setPaymentStatus("Pending");
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPaymentStatus("Paid");
      setSuccess(true);

      if (accountCreated) {
        setShowAccountModal(true);
      } else {
        setTimeout(() => {
          window.location.href = callbackUrl;
        }, 100);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
      setPaymentStatus("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(
      paymentDetails?.walletAddress ||
        "0xa6fa4331d43811a03433338bb8a866db2a4e3e7c24c0b407fb2fa11fbb1a23c3"
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 3000); // Reset after 3 seconds
  };

  const handleNext = async () => {
    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      email.trim() === ""
    ) {
      setError("All fields are required");
      return;
    }
    setError("");
    const generatedPassword = generatePassword();
    setPassword(generatedPassword);

    try {
      await Auth.signup({
        email: String(email.trim()).toLowerCase(),
        password: generatedPassword,
        terms_of_service: true,
        first_name: firstName,
        last_name: lastName,
      });
      setAccountCreated(true);
    } catch (rej) {
      console.log("Signup api error: ", rej);
    }

    setStep(2);
    handleInitializePayment();
  };

  const handleVerifyAccount = () => {
    window.location.href = "mailto:";
  };

  const handleProceedToCheckout = () => {
    setShowAccountModal(false);
  };

  const renderAccountCreationModal = () => (
    <AlertDialog open={showAccountModal} onOpenChange={setShowAccountModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>BananaCrystal Account Created</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-100">
            Hi {firstName}! Your BananaCrystal account is ready. Verify your
            email now to unlock amazing features like P2P transfers, debit card
            access, and more—or, if you prefer, continue to checkout and you can
            verify later at your convenience.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleProceedToCheckout}>
            Proceed to Checkout
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleVerifyAccount}>
            Verify My Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const renderFirstScreen = () => (
    <Card className="w-full max-w-md mx-auto mt-10 bg-white shadow-lg">
      <CardHeader className="bg-purple-900 text-white">
        <CardTitle>USDT Payment Checkout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="bg-gradient-to-r from-purple-100 to-orange-100 p-4 rounded-lg mb-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-purple-500 mr-2 mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-700 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
          <p className="text-base text-gray-600">Amount:</p>
          <div className="flex items-baseline">
            <span className="text-2xl text-gray-800">{amount.toFixed(2)}</span>
            <span className="ml-1 text-sm text-gray-500">{currency}</span>
          </div>
        </div>
        <div className="flex justify-between items-center bg-orange-100 p-3 rounded-md">
          <p className="text-base text-orange-600">Fee (1.99%):</p>
          <div className="flex items-baseline">
            <span className="text-2xl text-orange-700">
              {calculateFee(amount).toFixed(2)}
            </span>
            <span className="ml-1 text-sm text-orange-500">{currency}</span>
          </div>
        </div>
        <div className="flex justify-between items-center bg-purple-100 p-3 rounded-md">
          <p className="text-base text-purple-600">Total Amount:</p>
          <div className="flex items-baseline">
            <span className="text-2xl text-purple-700">
              {totalAmount.toFixed(2)}
            </span>
            <span className="ml-1 text-sm text-purple-500">{currency}</span>
          </div>
        </div>
        {usdtEquivalent && (
          <div className="flex justify-between items-center bg-blue-50 p-3 rounded-md">
            <p className="text-base text-blue-600">USDT Equivalent:</p>
            <div className="flex items-baseline">
              <span className="text-2xl text-blue-700">
                {usdtEquivalent.toFixed(2)}
              </span>
              <span className="ml-1 text-sm text-blue-500">USDT</span>
            </div>
          </div>
        )}
        <Input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          onClick={handleNext}
          className="w-full bg-purple-900 hover:bg-purple-800"
        >
          Next →
        </Button>
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
  );

  const renderSecondScreen = () => (
    <Card className="w-full max-w-md mx-auto mt-10 bg-white shadow-lg">
      <CardHeader className="bg-purple-900 text-white">
        <CardTitle>USDT Payment Checkout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="bg-gray-100 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold">
              {amount.toFixed(2)} {currency}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Fee (1.99%):</span>
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

        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-purple-800">
            USDT Equivalent
          </h3>
          <p className="text-3xl font-bold text-purple-900">
            {usdtEquivalent?.toFixed(2) || totalAmount.toFixed(2)} USDT
          </p>
        </div>

        <div className="text-center bg-orange-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-800">
            Time Remaining
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {formatTime(timeRemaining)}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-purple-900">
            Recipient USDT Address (Polygon Network)
          </h3>
          <div className="flex">
            <Input
              className="text-gray-500"
              value={
                paymentDetails?.walletAddress ||
                "0xa6fa4331d43811a03433338bb8a866db2a4e3e7c24c0b407fb2fa11fbb1a23c3"
              }
              readOnly
            />
            <Button
              variant="outline"
              size="icon"
              className="ml-2"
              onClick={handleCopyAddress}
            >
              {copied ? (
                <Check className="h-4 w-4 text-purple-900" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Polygon Network Only! Ensure you're sending USDT on the Polygon
            network.
          </AlertDescription>
        </Alert>
        <div className="space-y-2">
          <label
            htmlFor="paymentHash"
            className="flex text-sm font-medium text-gray-700  items-center"
          >
            Transaction Hash
            <div className="relative inline-block ml-2">
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-2 w-64">
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
            </div>
          </label>
          <Input
            id="paymentHash"
            placeholder="Enter your transaction hash"
            value={paymentHash}
            onChange={(e) => setPaymentHash(e.target.value)}
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {paymentStatus && (
          <Alert variant={paymentStatus === "Paid" ? "default" : "warning"}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Payment Status: {paymentStatus}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleVerifyPayment}
          className="w-full bg-purple-900 hover:bg-purple-800 text-white"
          disabled={paymentStatus !== "" || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            "I have paid"
          )}
        </Button>
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
  );

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
          <CardHeader className="bg-purple-900 text-white">
            <CardTitle>Payment Successful</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-800">
                Thank you for your payment. Your transaction has been completed
                successfully.
              </p>
            </div>
            <p className="text-gray-600 text-center">
              Redirecting to merchant site...
            </p>
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
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {step === 1 ? renderFirstScreen() : renderSecondScreen()}
      {renderAccountCreationModal()}
    </div>
  );
};

export default USDTPayment;
