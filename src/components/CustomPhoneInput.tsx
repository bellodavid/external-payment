import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { countryCodes } from "@/Data/CountryCodes";

interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

interface CustomPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  value,
  onChange,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    countryCodes[0]
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleCountryChange = (country: CountryCode): void => {
    setSelectedCountry(country);
    setIsOpen(false);
  };

  const handlePhoneNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const input = e.target.value.replace(selectedCountry.code, "").trim();
    onChange(input);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
        <button
          type="button"
          className="flex items-center mr-2 text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="mr-1 text-lg">{selectedCountry.flag}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <span className="mr-2 text-gray-600">{selectedCountry.code}</span>
        <input
          type="tel"
          className="flex-grow bg-transparent focus:outline-none text-gray-700"
          value={` ${value}`}
          onChange={handlePhoneNumberChange}
          placeholder="Phone number"
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {countryCodes.map((country) => (
            <div
              key={country.code}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
              onClick={() => handleCountryChange(country)}
            >
              <span className="flex items-center">
                <span className="mr-3 text-lg">{country.flag}</span>
                <span>
                  {country.country} ({country.code})
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomPhoneInput;
