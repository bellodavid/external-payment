export interface PaymentDetails {
  id: string;
  walletAddress: string;
  expiresAt: string;
  timeRemaining: number;
}

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  terms_of_service: boolean;
}

export interface UserFormData extends User {
  phoneNumber: string;
  address: string;
  signUpConsent: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface USDTPaymentProps {
  storeId: string;
  amount: number;
  currency: string;
  walletAddress: string;
  description: string;
  callbackUrl: string;
  onSuccess?: (transactionId: string) => void;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  signUpConsent: boolean;
}