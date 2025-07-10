import type { View, WalletData } from "@/components/LandingPage";

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

export function isWalletData(data: any): data is WalletData {
  return (
    data &&
    typeof data === "object" &&
    typeof data.address === "string" &&
    typeof data.balance === "string"
  );
}

export function isView(value: any): value is View {
  return ["welcome", "create", "import", "dashboard"].includes(value);
}
