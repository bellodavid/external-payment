import React from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CustomPhoneInput from "@/components/CustomPhoneInput";

interface FirstScreenProps {
  amount: number;
  currency: string;
  description: string;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    signUpConsent: boolean;
  };
  errors: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
  isFormValid: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (value: string) => void;
  onNext: () => void;
}

const FirstScreen: React.FC<FirstScreenProps> = ({
  amount,
  currency,
  description,
  formData,
  errors,
  isFormValid,
  onInputChange,
  onPhoneChange,
  onNext,
}) => {
  return (
    <>
    <div>
      <CardHeader className="bg-[#4c3f84] text-white">
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
            <span className="text-2xl text-gray-800">{amount}</span>
            <span className="ml-1 text-sm text-gray-500">{currency}</span>
          </div>
        </div>

        <div>
          <Input
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
            required
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={onInputChange}
            required
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>

        <div>
          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <CustomPhoneInput
            value={formData.phoneNumber}
            onChange={onPhoneChange}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={onInputChange}
            required
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="signup-consent"
            color="bg-purple-700"
            checked={formData.signUpConsent}
            onCheckedChange={(checked) => {
              onInputChange({
                target: { name: "signUpConsent", value: checked },
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            className="rounded-sm border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <label htmlFor="signup-consent" className="text-xs text-gray-500">
            Sign me up on BananaCrystal
          </label>
        </div>

        <Button
          onClick={onNext}
          className="w-full bg-[#4c3f84] hover:bg-[#4c3f84]"
          disabled={!isFormValid}
        >
          Next →
        </Button>

        <div className="text-center">
          <a
            href="https://www.bananacrystal.com/docs/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-orange-600 hover:text-orange-800"
          >
            Need help?
          </a>
        </div>
      </CardContent>
      </div>
    </>
  );
};

export default FirstScreen;
