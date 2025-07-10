import { useState } from "react";

import CreateWallet from "./CreateWallet";
import WelcomeScreen from "./WelcomeScreen";
import ImportWallet from "./ImportWallet";
import WalletDashboard from "./WalletDashboard";

export default function WalletExtension() {
  const [currentView, setCurrentView] = useState<
    "welcome" | "create" | "import" | "dashboard"
  >("welcome");
  const [walletData, setWalletData] = useState<unknown>(null);

  const handleWalletCreated = (data: unknown) => {
    setWalletData(data);
    setCurrentView("dashboard");
  };

  const handleWalletImported = (data: unknown) => {
    setWalletData(data);
    setCurrentView("dashboard");
  };

  return (
    <div className="w-[375px] h-[600px] bg-gray-900 text-white ">
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
          onBack={() => setCurrentView("welcome")}
        />
      )}
    </div>
  );
}
