import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { Keyring } from "@polkadot/keyring";
import { mnemonicValidate } from "@polkadot/util-crypto";
import { hashPassword } from "@/utils/password";

interface ImportWalletProps {
  onBack: () => void;
  onWalletImported: (data: {
    address: string;
    seedPhrase: string;
    balance: string;
  }) => void;
}

export default function ImportWallet({
  onBack,
  onWalletImported,
}: ImportWalletProps) {
  const [seedPhrase, setSeedPhrase] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setError(null);

    const trimmedSeed = seedPhrase.trim().toLowerCase();
    const words = trimmedSeed.split(/\s+/);

    if (words.length !== 12 && words.length !== 24) {
      setError("Seed phrase must be 12 or 24 words.");
      return;
    }

    if (!mnemonicValidate(trimmedSeed)) {
      setError("Invalid seed phrase.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    //5CY79kUDbN2CFyr3CtgrS5nuNk1ZJ6m7kYcg5QpFeG8RRKam
    //5CY79kUDbN2CFyr3CtgrS5nuNk1ZJ6m7kYcg5QpFeG8RRKam

    setLoading(true);

    try {
      // Generate keypair from mnemonic
      const keyring = new Keyring({ type: "sr25519", ss58Format: 42 });
      const pair = keyring.addFromUri(trimmedSeed);

      // Hash and save password
      const hashed = await hashPassword(password);
      localStorage.setItem("walletPassword", hashed);

      // Call back with wallet data
      onWalletImported({
        address: pair.address,
        seedPhrase: trimmedSeed,
        balance: "0.00", // placeholder; you can fetch real balance later
      });
    } catch (e) {
      setError("Failed to import wallet. Please check your seed phrase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-gray-400 hover:text-white hover:bg-gray-800"
          disabled={loading}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-white">Import Wallet</h1>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">
              Restore Your Wallet
            </h2>
            <p className="text-gray-400 text-sm">
              Enter your seed phrase to restore your wallet
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="seedPhrase" className="text-gray-300">
                Seed Phrase
              </Label>
              <Textarea
                id="seedPhrase"
                value={seedPhrase}
                onChange={(e) => setSeedPhrase(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white mt-1 min-h-[120px]"
                placeholder="Enter your 12 or 24 word seed phrase separated by spaces"
                disabled={loading}
              />
              <p className="text-gray-500 text-xs mt-1">
                Words:{" "}
                {seedPhrase.trim() ? seedPhrase.trim().split(/\s+/).length : 0}
              </p>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300">
                New Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white pr-10"
                  placeholder="Create a new password (min 8 characters)"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <p className="text-blue-400 text-sm">
              <strong>Note:</strong> Make sure you're in a secure environment
              when entering your seed phrase.
            </p>
          </div>

          <Button
            onClick={handleImport}
            disabled={
              seedPhrase.trim().split(/\s+/).length < 12 ||
              password.length < 8 ||
              loading
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
          >
            {loading ? "Importing..." : "Import Wallet"}
          </Button>
        </div>
      </div>
    </div>
  );
}
