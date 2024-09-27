export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const generatePassword = () => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let generatedPassword = "";
  for (let i = 0; i < 12; i++) {
    generatedPassword += charset.charAt(
      Math.floor(Math.random() * charset.length)
    );
  }
  return generatedPassword;
};

//TODO: Move this to services and perform calls with axios
const apiEndpoint = "https://app.bananacrystal.com/api/users/sign_up";

export const initializePayment = async (
  storeId: string,
  amount: number,
  description: string,
  callbackUrl: string
) => {
  const response = await fetch(`${apiEndpoint}/initialize-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ storeId, amount, description, callbackUrl }),
  });
  if (!response.ok) {
    throw new Error("Failed to initialize payment");
  }
  return response.json();
};

//TODO: Move this to services and perform calls with axios
export const verifyPayment = async (
  paymentHash: string,
  amount: number,
  storeId: string,
  email: string
) => {
  const response = await fetch(`${apiEndpoint}/verify-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      paymentHash,
      amount,
      storeId,
      email,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to verify payment");
  }

  return data;
};
