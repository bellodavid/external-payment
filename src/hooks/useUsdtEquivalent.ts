/* eslint-disable */
// @ts-nocheck

/**
 * Custom hook for fetching and managing USDT equivalent values
 *
 * @description
 * This hook handles the conversion of local currency amounts to USDT equivalent values.
 * It manages loading states, error handling, and automatic refetching when dependencies change.
 *
 * @example
 * ```tsx
 * const { usdtEquivalent, isLoading, error } = useUSDTEquivalent({
 *   amount: 1000,
 *   currency: 'ZAR'
 * });
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 *
 * return <div>USDT Equivalent: {usdtEquivalent}</div>;
 * ```
 */

import { useState, useEffect } from "react";

interface UseUsdtEquivalentProps {
  totalAmount: number;
  currency: string;
}

interface UseUSDTEquivalentReturn {
  usdtEquivalent: number | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUsdtEquivalent({
  totalAmount,
  currency,
}: UseUsdtEquivalentProps): UseUSDTEquivalentReturn {
  const [usdtEquivalent, setUsdtEquivalent] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsdtEquivalent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=${currency.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch USDT rate");
      }

      const data = await response.json();
      const usdtPrice = data.tether[currency.toLowerCase()];

      if (!usdtPrice) {
        throw new Error(`No USDT price found for ${currency}`);
      }

      setUsdtEquivalent(totalAmount / usdtPrice);
    } catch (err) {
      console.error("Error fetching USDT equivalent:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch USDT equivalent"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsdtEquivalent();
  }, [totalAmount, currency]);

  return {
    usdtEquivalent,
    isLoading,
    error,
    refetch: fetchUsdtEquivalent,
  };
}
