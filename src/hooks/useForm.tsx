/* eslint-disable */
// @ts-nocheck

/**
 * Custom hook for managing form state in the USDT payment flow
 *
 * @description
 * This hook handles form state management for user details in the payment process.
 * It includes validation, error handling, and form submission.
 *
 * @example
 * ```tsx
 * const { formData, handleInputChange, handleSubmit } = useForm({
 *   firstName: "",
 *   lastName: "",
 *   email: "",
 *   phoneNumber: "",
 *   address: "",
 *   signUpConsent: true,
 * });
 * ```
 */

import { useState, useCallback } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  signUpConsent: boolean;
}

type FormEvent = React.FormEvent<HTMLFormElement>;
type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

interface UseFormProps {
  initialValues?: Partial<FormData>;
}

interface UseFormReturn {
  formData: FormData;
  error: string;
  isLoading: boolean;
  handleInputChange: (
    e: InputChangeEvent | { target: { name: string; value: any } }
  ) => void;
  handleSubmit: (e: FormEvent, onNext: (formData: FormData) => void) => void;
}

export function useForm({
  initialValues = {},
}: UseFormProps = {}): UseFormReturn {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    signUpConsent: true,
    ...initialValues,
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = useCallback(
    (e: InputChangeEvent | { target: { name: string; value: any } }) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setError("");
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "address",
    ];
    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        setError(
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: FormEvent, onNext: (formData: FormData) => void) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        if (validateForm()) {
          onNext(formData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateForm]
  );

  return {
    formData,
    error,
    isLoading,
    handleInputChange,
    handleSubmit,
  };
}
