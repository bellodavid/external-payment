import React, { useEffect, useState } from "react";
import { AlertCircle, Check, Copy, Info } from "lucide-react";
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
  description,
  callbackUrl,
  onSuccess,
}) => {
  const [step, setStep] = useState<number>(1);
  const [timeRemaining, setTimeRemaining] = useState<number>(1800); // 30 minutes
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
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
    try {
      const data = await initializePayment(
        storeId,
        usdtEquivalent || amount,
        description,
        callbackUrl
      );
      setPaymentDetails(data);
      setTimeRemaining(
        Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000)
      );
    } catch (err) {
      //setError("Failed to initialize payment");
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

  const handleVerifyPayment = async () => {
    setPaymentStatus("Pending");
    try {
      // Commenting out the actual verification for this example
      // const data = await verifyPayment(paymentHash, usdtEquivalent || amount, storeId, email);
      // setPaymentStatus("Paid");
      // setSuccess(true);

      // if (onSuccess) {
      //   onSuccess(data.transactionId);
      // }

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
    }
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
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>USDT Payment Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed">
                {description ||
                  "Deluxe Ocean View Suite. Check-in: 2023-09-15, Check-out: 2023-09-20. 2 Guests, 5 Nights total."}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
            <p className="text-base text-gray-600">Total Amount:</p>
            <div className="flex items-baseline">
              <span className="text-2xl text-gray-800">{amount}</span>
              <span className="ml-1 text-sm text-gray-500">{currency}</span>
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
          <Button onClick={handleNext} className="w-full">
            Next →
          </Button>
        </div>
      </CardContent>
      <div className="text-center text-sm text-gray-500 mt-2 mb-3">
        Powered by BananaCrystal
      </div>
    </Card>
  );

  const renderSecondScreen = () => (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>USDT Payment Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Amount (USDT)</h3>
            <p className="text-3xl font-bold">
              {usdtEquivalent?.toFixed(2) || amount}
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Time Remaining</h3>
            <p className="text-3xl font-bold text-blue-600">
              {formatTime(timeRemaining)}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
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
                  <Check className="h-4 w-4 text-gray-700" />
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
          <Input
            placeholder="Enter your payment hash"
            value={paymentHash}
            onChange={(e) => setPaymentHash(e.target.value)}
          />
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {paymentStatus && (
            //@ts-ignore
            <Alert variant={paymentStatus === "Paid" ? "default" : "warning"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Payment Status: {paymentStatus}
              </AlertDescription>
            </Alert>
          )}
          <Button
            onClick={handleVerifyPayment}
            className="w-full"
            disabled={paymentStatus !== ""}
          >
            I have paid
          </Button>
        </div>
      </CardContent>
      <div className="text-center text-sm text-gray-500 mt-2 mb-3">
        Powered by BananaCrystal
      </div>
    </Card>
  );

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md mx-auto ">
          <CardHeader>
            <CardTitle>Payment Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Thank you for your payment. Your transaction has been completed
              successfully.
            </p>
            <p>Redirecting to merchant site...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {step === 1 ? renderFirstScreen() : renderSecondScreen()}
      {renderAccountCreationModal()}
    </>
  );
};

export default USDTPayment;
