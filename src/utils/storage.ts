import type { View, WalletData } from "@/components/LandingPage";

/**
 * Retrieves a value from Chrome's local storage by key.
 * @template T - The expected type of the stored value.
 * @param key The key to look up in storage.
 * @returns A promise that resolves to the stored value, or null if not found or unavailable.
 */
export function getFromStorage<T>(key: string): Promise<T | null> {
  return new Promise((resolve) => {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] ?? null);
      });
    } else {
      console.warn("[getFromStorage] chrome.storage.local is not available");
      resolve(null);
    }
  });
}

/**
 * Saves a value to Chrome's local storage under a specified key.
 * @template T - The type of the value to store.
 * @param key The key to store the value under.
 * @param value The value to store.
 * @returns A promise that resolves when the value is stored, or rejects on error.
 */
export function setToStorage<T>(key: string, value: T): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    } else {
      console.warn("[setToStorage] chrome.storage.local is not available");
      resolve(); // Optionally reject if you'd rather enforce extension-only
    }
  });
}

/**
 * Removes a value from Chrome's local storage by key.
 * @param key The key to remove from storage.
 * @returns A promise that resolves when the key is removed, or rejects on error.
 */
export function removeFromStorage(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      chrome.storage.local.remove(key, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    } else {
      console.warn("[removeFromStorage] chrome.storage.local is not available");
      resolve();
    }
  });
}

/**
 * Type guard that checks if the given value conforms to the WalletData shape.
 * @param data The value to check.
 * @returns True if the value is a WalletData object, false otherwise.
 */
export function isWalletData(data: any): data is WalletData {
  return (
    data &&
    typeof data === "object" &&
    typeof data.address === "string" &&
    typeof data.balance === "string"
  );
}

/**
 * Type guard that checks if the given value is a valid View.
 * @param value The value to check.
 * @returns True if the value is a valid View, false otherwise.
 */
export function isView(value: any): value is View {
  return ["welcome", "create", "import", "dashboard"].includes(value);
}
