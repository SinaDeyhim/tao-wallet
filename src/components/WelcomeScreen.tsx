import { Button } from "@/components/ui/button";
import { Wallet, Plus, Download } from "lucide-react";

interface WelcomeScreenProps {
  onCreateWallet: () => void;
  onImportWallet: () => void;
}

export default function WelcomeScreen({
  onCreateWallet,
  onImportWallet,
}: WelcomeScreenProps) {
  return (
    <div className="h-full flex flex-col bg-gray-900 justify-between">
      {/* Header */}
      <div className="p-6 text-center border-b border-gray-800">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Crucible</h1>
        </div>
        <p className="text-gray-400 text-sm">Secure & Smart Crypto Wallet</p>
      </div>

      {/* Features */}
      <div className="p-6">
        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onCreateWallet}
            className="w-full bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 hover:from-indigo-600 hover:via-blue-500 hover:to-cyan-400"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Wallet
          </Button>

          <Button
            onClick={onImportWallet}
            variant="secondary"
            className="w-full hover:bg-gradient-to-r hover:from-gray-800 hover:via-gray-700 hover:to-gray-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Import Existing Wallet
          </Button>
        </div>
      </div>
    </div>
  );
}
