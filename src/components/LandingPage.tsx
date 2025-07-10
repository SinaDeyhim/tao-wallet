import { useState, useEffect } from "react";
import { hashPassword } from "@/utils/password";

import CreateWallet from "./CreateWallet";
import WelcomeScreen from "./WelcomeScreen";
import ImportWallet from "./ImportWallet";
import WalletDashboard from "./WalletDashboard";
import { Button } from "@/components/ui/button";

export type WalletData = { address: string; balance: string } | null;

export default function WalletExtension() {
  const [currentView, setCurrentView] = useState<
    "welcome" | "create" | "import" | "dashboard"
  >(() => {
    const saved = localStorage.getItem("walletCurrentView");
    const savedWalletData = localStorage.getItem("walletData");
    if (
      !savedWalletData &&
      saved !== "welcome" &&
      saved !== "create" &&
      saved !== "import"
    ) {
      return "welcome";
    }
    return (saved as any) || "welcome";
  });

  const [walletData, setWalletData] = useState<WalletData>(() => {
    const saved = localStorage.getItem("walletData");
    return saved ? JSON.parse(saved) : null;
  });

  const [locked, setLocked] = useState<boolean>(() => {
    const savedLocked = localStorage.getItem("walletLocked");
    return savedLocked === "true" || walletData === null;
  });

  const [unlockPassword, setUnlockPassword] = useState("");
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlockLoading, setUnlockLoading] = useState(false);

  // Effect to persist currentView
  useEffect(() => {
    localStorage.setItem("walletCurrentView", currentView);
  }, [currentView]);

  // Effect to handle walletData changes (creation/import/logout)
  useEffect(() => {
    if (walletData) {
      localStorage.setItem("walletData", JSON.stringify(walletData));
      setLocked(false);
      localStorage.setItem("walletLocked", "false");
    } else {
      localStorage.removeItem("walletData");

      localStorage.setItem("walletLocked", "true");
    }
  }, [walletData]);

  // Effect to persist locked state explicitly
  useEffect(() => {
    localStorage.setItem("walletLocked", locked.toString());
  }, [locked]);

  const handleWalletCreated = (data: WalletData) => {
    setWalletData(data);
    setCurrentView("dashboard");
  };

  const handleWalletImported = (data: WalletData) => {
    setWalletData(data);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setWalletData(null);
    setCurrentView("welcome");
    setUnlockPassword("");
    setUnlockError(null);
    localStorage.removeItem("walletPassword");
  };

  useEffect(() => {
    console.log(">>>> locked", locked);
  }, [locked]);

  const handleLock = () => {
    setLocked(true);
    setUnlockPassword("");
    setUnlockError(null);
  };

  const handleUnlock = async () => {
    setUnlockLoading(true);
    setUnlockError(null);

    try {
      const savedHash = localStorage.getItem("walletPassword");
      if (!savedHash) {
        setUnlockError("No password set.");
        setUnlockLoading(false);
        return;
      }

      const enteredHash = await hashPassword(unlockPassword);

      if (enteredHash === savedHash) {
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
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium"
        >
          {unlockLoading ? "Unlocking..." : "Unlock"}
        </Button>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="mt-4 text-gray-400 hover:text-white"
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="w-[375px] h-[600px] bg-gray-900 text-white relative">
      {/* Lock button top-right */}
      {currentView === "dashboard" && (
        <div className="absolute top-2 right-2 z-50">
          <Button
            size="sm"
            variant="outline"
            onClick={handleLock}
            className="text-gray-400 hover:text-white"
          >
            Lock
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
          onBack={() => setCurrentView("welcome")}
          onWalletCreated={handleWalletCreated}
        />
      )}
      {currentView === "import" && (
        <ImportWallet
          onBack={() => setCurrentView("welcome")}
          onWalletImported={handleWalletImported}
        />
      )}
      {currentView === "dashboard" && (
        <WalletDashboard
          walletData={walletData}
          onBack={() => {
            if (walletData) {
              setLocked(true);
            }
            setCurrentView("welcome");
          }}
        />
      )}
    </div>
  );
}
