import { useState, useEffect } from "react";
import { verifyPassword } from "@/utils/password";

import CreateWallet from "./CreateWallet";
import WelcomeScreen from "./WelcomeScreen";
import ImportWallet from "./ImportWallet";
import WalletDashboard from "./WalletDashboard";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import {
  getFromStorage,
  setToStorage,
  removeFromStorage,
  isWalletData,
  isView,
} from "@/utils/storage";

export type View = "welcome" | "create" | "import" | "dashboard";

export type WalletData = { address: string; balance: string } | null;

export default function LandingPage() {
  const [currentView, setCurrentView] = useState<View>("welcome");
  const [walletData, setWalletData] = useState<WalletData>(null);
  const [locked, setLocked] = useState<boolean>(true);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      const [storedView, storedWalletData, storedLockedState] =
        await Promise.all([
          getFromStorage("walletCurrentView"),
          getFromStorage("walletData"),
          getFromStorage("walletLocked"),
        ]);

      let initialView: View = "welcome";
      let initialLockedState: boolean = true;

      if (isWalletData(storedWalletData)) {
        setWalletData(storedWalletData);

        if (storedView === "create" || storedView === "import") {
          initialView = "dashboard";
        } else if (isView(storedView)) {
          initialView = storedView;
        } else {
          initialView = "dashboard";
        }

        if (storedLockedState === "false") {
          initialLockedState = false;
        } else {
          initialLockedState = true;
        }
      } else {
        initialLockedState = false;
        if (isView(storedView)) {
          initialView = storedView;
        }
      }

      setCurrentView(initialView);
      setLocked(initialLockedState);
      setIsLoading(false);
    };

    initialize();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setToStorage("walletCurrentView", currentView);
    }
  }, [currentView, isLoading]);

  // Sync wallet data and lock state with storage
  useEffect(() => {
    if (walletData) {
      setToStorage("walletData", walletData);
      setLocked(false);
      setToStorage("walletLocked", "false");
    } else {
      removeFromStorage("walletData");
      setLocked(true);
      setToStorage("walletLocked", "true");
    }
  }, [walletData]);

  useEffect(() => {
    setToStorage("walletLocked", locked.toString());
  }, [locked]);

  const handleWalletCreate = (data: WalletData) => {
    setWalletData(data);
    setCurrentView("dashboard");
  };

  const handleWalletImport = (data: WalletData) => {
    setWalletData(data);
    setCurrentView("dashboard");
  };

  const backToWelcome = () => {
    setCurrentView("welcome");
  };

  const handleLogout = async () => {
    setWalletData(null);
    setCurrentView("welcome");
    setUnlockPassword("");
    setUnlockError(null);
    await removeFromStorage("walletPassword");
  };

  const handleLock = () => {
    setLocked(true);
    setUnlockPassword("");
    setUnlockError(null);
  };

  const handleUnlock = async () => {
    setUnlockLoading(true);
    setUnlockError(null);

    try {
      const storedPasswordHash = (await getFromStorage(
        "walletPassword"
      )) as string;
      if (!storedPasswordHash) {
        setUnlockError("No password set.");
        setUnlockLoading(false);
        return;
      }

      const isPasswordCorrect = await verifyPassword(
        unlockPassword,
        storedPasswordHash
      );
      if (isPasswordCorrect) {
        setLocked(false);
        setUnlockPassword("");
        setUnlockError(null);
      } else {
        setUnlockError("Authentication failed.");
      }
    } catch {
      setUnlockError("Error verifying password.");
    } finally {
      setUnlockLoading(false);
    }
  };

  // Display a loading screen while state is being initialized
  if (isLoading) {
    return (
      <div className="w-[375px] h-[600px] bg-gray-900 text-white flex flex-col justify-center items-center p-6">
        <p className="text-xl">Loading wallet state...</p>
      </div>
    );
  }

  if (locked && walletData) {
    return (
      <div className="w-[375px] h-[600px] bg-gray-900 text-white flex flex-col justify-center items-center p-6">
        <h2 className="text-xl font-semibold mb-4">Unlock Wallet</h2>

        <input
          type="password"
          value={unlockPassword}
          onChange={(e) => setUnlockPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white mb-3"
          disabled={unlockLoading}
        />
        {unlockError && (
          <p className="text-red-500 mb-2 text-sm">{unlockError}</p>
        )}

        <Button
          onClick={handleUnlock}
          disabled={unlockPassword.length === 0 || unlockLoading}
          className="w-full"
        >
          {unlockLoading ? "Unlocking..." : "Unlock"}
        </Button>

        <Button variant="ghost" onClick={handleLogout} className="mt-4 w-full">
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="w-[375px] h-[600px] bg-gray-900 text-white relative">
      {currentView === "dashboard" && (
        <div className="absolute top-2 right-2 z-50">
          <Button
            size="sm"
            variant="outline"
            onClick={handleLock}
            className="text-gray-400 hover:text-white mt-1"
          >
            Lock
            <Lock className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {currentView === "welcome" && (
        <WelcomeScreen
          onCreateWallet={() => setCurrentView("create")}
          onImportWallet={() => setCurrentView("import")}
        />
      )}
      {currentView === "create" && (
        <CreateWallet
          onBack={backToWelcome}
          onWalletCreated={handleWalletCreate}
        />
      )}
      {currentView === "import" && (
        <ImportWallet
          onBack={backToWelcome}
          onWalletImported={handleWalletImport}
        />
      )}
      {currentView === "dashboard" && (
        <WalletDashboard
          walletData={walletData}
          onBack={() => {
            if (walletData) setLocked(true);
            setCurrentView("welcome");
          }}
        />
      )}
    </div>
  );
}
