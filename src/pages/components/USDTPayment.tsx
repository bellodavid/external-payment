/* eslint-disable */
// @ts-nocheck

import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Success } from "./Success";
import FirstScreen from "./FirstScreen";
import SecondScreen from "./SecondScreen";

const Loader = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);

// Mock API function to simulate payment verification
const mockVerifyPayment = async (paymentDetails) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 80% success rate
      if (Math.random() < 0.8) {
        resolve({
          success: true,
          transactionId: `TX-${Math.random().toString(36).substr(2, 9)}`,
          message: "Payment verified successfully"
        });
      } else {
        reject(new Error("Payment verification failed. Please try again."));
      }
    }, 2000); // 2 second delay to simulate API call
  });
};

const USDTPayment = ({
  storeId,
  amount = 100,
  currency = "ZAR",
  walletAddress,
  description,
  callbackUrl,
  onSuccess,
}) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "Good@123456",
    signUpConsent: true,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    let newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
    };

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    setIsFormValid(Object.values(newErrors).every((error) => error === ""));
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleVerifyPayment = async () => {
    setIsLoading(true);
    setApiError("");

    try {
      // Using mock API instead of real endpoint
      const response = await mockVerifyPayment({
        storeId,
        amount,
        paymentDetails,
        formData,
      });

      setTransactionData(response);
      setShowSuccessScreen(true);
      
      // Call the onSuccess callback after a delay to allow the success screen to show
      setTimeout(() => {
        onSuccess && onSuccess(response.transactionId);
      }, 3000);
      
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (showSuccessScreen) {
    return (
      <Success
        title="Payment Successful!"
        message={`Transaction ID: ${transactionData.transactionId}`}
        redirectDelay={3000}
        onRedirect={() => {
          // Clean up and reset state before closing
          setStep(1);
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            address: "",
            password: "Good@123456",
            signUpConsent: true,
          });
          setShowSuccessScreen(false);
        }}
      />
    );
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto mt-10 bg-white shadow-lg">
        {apiError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}
        {step === 1 ? (
          <FirstScreen
            amount={amount}
            currency={currency}
            description={description}
            formData={formData}
            errors={errors}
            isFormValid={isFormValid}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onPhoneChange={handlePhoneChange}
            onNext={handleNext}
          />
        ) : (
          <SecondScreen
            amount={amount}
            currency={currency}
            walletAddress={walletAddress}
            paymentDetails={paymentDetails}
            onVerifyPayment={handleVerifyPayment}
            isLoading={isLoading}
            formData={formData}
          />
        )}
      </Card>
    </div>
  );
};

export default USDTPayment;