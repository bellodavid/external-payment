export interface PaymentDetails {
  id: string;
  walletAddress: string;
  expiresAt: string;
  timeRemaining: number;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  address: string;
  signUpConsent: boolean;
}
