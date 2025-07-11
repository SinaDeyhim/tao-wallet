import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { Keyring } from "@polkadot/keyring";
import { mnemonicValidate } from "@polkadot/util-crypto";
import { hashPassword } from "@/utils/password";
import { setToStorage } from "@/utils/storage";
import { PasswordChecklist } from "@/components/PasswordCheck";

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
  const [blurred, setBlurred] = useState(false);

  const handleImport = async () => {
    console.log(">>>>>>>>>");
    setError(null);
    const trimmedSeed = seedPhrase.trim().toLowerCase();
    const words = trimmedSeed.split(/\s+/);

    console.log(">>>>>>>>>", words.length);
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

    setLoading(true);

    try {
      const keyring = new Keyring({ type: "sr25519", ss58Format: 42 });
      const pair = keyring.addFromUri(trimmedSeed);

      const hashed = await hashPassword(password);
      await setToStorage("walletPassword", hashed);

      onWalletImported({
        address: pair.address,
        seedPhrase: trimmedSeed,
        balance: "0.00",
      });
    } catch (e) {
      setError("Failed to import wallet. Please check your seed phrase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!seedPhrase) {
      setBlurred(false);
    }
  }, [seedPhrase]);

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
          aria-label="back"
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
              <Label
                htmlFor="seedPhrase"
                className="text-gray-300 flex justify-between items-center"
              >
                Seed Phrase
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                  onClick={() => setBlurred(!blurred)}
                  aria-label={blurred ? "show seed phrase" : "hide seed phrase"}
                >
                  {blurred ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
              </Label>

              <Textarea
                id="seedPhrase"
                value={seedPhrase}
                onChange={(e) => {
                  setSeedPhrase(e.target.value);
                  setBlurred(true);
                }}
                onPaste={() => {
                  setBlurred(true);
                }}
                className={`bg-gray-800 border-gray-700 text-white mt-1 min-h-[120px] transition-all text-sm ${
                  blurred ? "blur-sm select-none" : ""
                }`}
                placeholder="Enter your 12 or 24 word seed phrase separated by spaces"
                disabled={loading}
                aria-label="seed phrase"
              />

              <p className="text-gray-500 text-xs mt-1">
                Words:{" "}
                {seedPhrase.trim() ? seedPhrase.trim().split(/\s+/).length : 0}
              </p>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300 pb-1">
                New Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white pr-10 text-sm"
                  placeholder="Create a new password (min 8 characters)"
                  disabled={loading}
                  aria-label="new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/4 w-4 h-4 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? "hide password" : "show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <PasswordChecklist password={password} />
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
            className="w-full"
            aria-label="import wallet"
          >
            {loading ? "Importing..." : "Import Wallet"}
          </Button>
        </div>
      </div>
    </div>
  );
}
