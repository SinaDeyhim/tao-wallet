import { useState, useEffect } from "react";
import { hashPassword } from "@/utils/password";

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

export default function WalletExtension() {
  const [currentView, setCurrentView] = useState<View>("welcome");

  const [walletData, setWalletData] = useState<WalletData>(null);
  const [locked, setLocked] = useState<boolean>(true);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlockLoading, setUnlockLoading] = useState(false);

  // Initial load from storage
  useEffect(() => {
    const initialize = async () => {
      const [storedView, storedWalletData, storedLockedState] =
        await Promise.all([
          getFromStorage("walletCurrentView"),
          getFromStorage("walletData"),
          getFromStorage("walletLocked"),
        ]);

      if (isWalletData(storedWalletData)) {
        setWalletData(storedWalletData);
      }
      if (isView(storedView)) {
        setCurrentView(storedView);
      }
      if (storedLockedState === "false") setLocked(false);
    };

    initialize();
  }, []);

  // Keep view in storage
  useEffect(() => {
    setToStorage("walletCurrentView", currentView);
    console.log(">>>>", currentView);
  }, [currentView]);

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
    setCurrentView("create");
  };

  const handleWalletImport = (data: WalletData) => {
    setWalletData(data);
    setCurrentView("import");
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
      const storedPasswordHash = await getFromStorage("walletPassword");
      if (!storedPasswordHash) {
        setUnlockError("No password set.");
        setUnlockLoading(false);
        return;
      }

      const enteredHash = await hashPassword(unlockPassword);
      if (enteredHash === storedPasswordHash) {
        setLocked(false);
        setUnlockPassword("");
        setUnlockError(null);
      } else {
        setUnlockError("Incorrect password.");
      }
    } catch (e) {
      setUnlockError("Error verifying password.");
    } finally {
      setUnlockLoading(false);
    }
  };

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
