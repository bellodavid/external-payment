import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CustomPhoneInput from "@/components/CustomPhoneInput";
import { useForm } from "@/hooks/useForm";

interface FirstScreenProps {
  amount: number;
  currency: string;
  description: string;
  onNext: (formData: any) => void;
}

/**
 * FirstScreen Component
 *
 * This component renders the first step of the payment process, collecting user information.
 *
 * @param {FirstScreenProps} props - The component props
 * @returns {React.ReactElement} The rendered component
 */
const FirstScreen: React.FC<FirstScreenProps> = ({
  amount,
  currency,
  description,
  onNext,
}) => {
  const [signUpConsent, setSignUpConsent] = useState(true);
  const { formData, handleInputChange, handleSubmit } = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      signUpConsent: signUpConsent, // reference your state variable
    },
  });

  return (
    <>
      <CardHeader className="bg-purple-700 text-white">
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

        <Input
          placeholder="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
        <Input
          placeholder="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <CustomPhoneInput
          value={formData.phoneNumber}
          onChange={(value) =>
            handleInputChange({ target: { name: "phoneNumber", value } })
          }
        />
        <Input
          placeholder="Address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="signup-consent"
            color="bg-purple-700"
            checked={signUpConsent} // Reflect the current state value here
            onCheckedChange={() => setSignUpConsent(!signUpConsent)}
            className="rounded-sm border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <label htmlFor="signup-consent" className="text-xs text-gray-500">
            Sign me up for BananaCrystal
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-800"
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
    </>
  );
};

export default FirstScreen;
