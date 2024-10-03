/**
 * AccountCreationModal Component
 *
 * @description
 * A reusable modal component for displaying account creation success
 * with options to verify email or proceed to checkout.
 *
 * @example
 * ```tsx
 * <AccountCreationModal
 *   show={showModal}
 *   onClose={() => setShowModal(false)}
 *   onVerify={() => handleEmailVerification()}
 *   onProceed={() => handleCheckout()}
 * />
 * ```
 */

import React from "react";
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

interface AccountCreationModalProps {
  show: boolean;
  onClose: () => void;
  onVerify: () => void;
  onProceed: () => void;
  firstName?: string;
  title?: string;
  description?: string;
  proceedButtonText?: string;
  verifyButtonText?: string;
}

export const AccountCreationModal: React.FC<AccountCreationModalProps> = ({
  show,
  onClose,
  onVerify,
  onProceed,
  firstName,
  title = "BananaCrystal Account Created",
  description,
  proceedButtonText = "Proceed to Checkout",
  verifyButtonText = "Verify My Account",
}) => {
  const defaultDescription = firstName
    ? `Hi ${firstName}! Your BananaCrystal account is ready. Verify your email now to unlock amazing features like P2P transfers, debit card access, and more—or, if you prefer, continue to checkout and you can verify later at your convenience.`
    : "Your BananaCrystal account is ready. Verify your email now to unlock amazing features like P2P transfers, debit card access, and more—or, if you prefer, continue to checkout and you can verify later at your convenience.";

  return (
    <AlertDialog open={show} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-100">
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onProceed}>
            {proceedButtonText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onVerify}>
            {verifyButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
