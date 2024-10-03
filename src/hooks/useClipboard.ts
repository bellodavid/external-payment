/**
 * Custom hook for managing clipboard operations
 *
 * @description
 * This hook provides functionality to copy text to clipboard with a temporary
 * success state indicator. Useful for copy-to-clipboard buttons and similar UI elements.
 *
 * @example
 * ```tsx
 * const { copied, copyToClipboard } = useClipboard();
 *
 * return (
 *   <button onClick={() => copyToClipboard("Text to copy")}>
 *     {copied ? "Copied!" : "Copy"}
 *   </button>
 * );
 * ```
 */

import { useState, useCallback } from "react";

interface UseClipboardReturn {
  copied: boolean;
  copyToClipboard: (text: string) => Promise<void>;
}

export function useClipboard(resetDelay = 3000): UseClipboardReturn {
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, resetDelay);
      } catch (err) {
        console.error("Failed to copy text:", err);
      }
    },
    [resetDelay]
  );

  return {
    copied,
    copyToClipboard,
  };
}
