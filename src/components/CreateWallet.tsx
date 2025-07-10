import { useEffect, useState } from "react";
import {
  getFromStorage,
  setToStorage,
  removeFromStorage,
} from "@/utils/storage";
import { hashPassword } from "@/utils/password";
import { mnemonicGenerate } from "@polkadot/util-crypto";
import { Keyring } from "@polkadot/keyring";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateWalletProps {
  onBack: () => void;
  onWalletCreated: (data: {
    address: string;
    seedPhrase: string;
    balance: string;
  }) => void;
}

export default function CreateWallet({
  onBack,
  onWalletCreated,
}: CreateWalletProps) {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [address, setAddress] = useState<string | null>(null);
  const [copiedSeed, setCopiedSeed] = useState(false);

  // Initialize from storage except seed phrase
  useEffect(() => {
    const initialize = async () => {
      const [
        storedStep,
        storedPassword,
        storedConfirmPassword,
        storedShowPassword,
        storedShowConfirmPassword,
        storedAddress,
      ] = await Promise.all([
        getFromStorage<number>("createWalletStep"),
        getFromStorage<string>("createWalletPassword"),
        getFromStorage<string>("createWalletConfirmPassword"),
        getFromStorage<string>("createWalletShowPassword"),
        getFromStorage<string>("createWalletShowConfirmPassword"),
        getFromStorage<string>("createWalletAddress"),
      ]);

      if (storedStep) setStep(storedStep);
      if (storedPassword) setPassword(storedPassword);
      if (storedConfirmPassword) setConfirmPassword(storedConfirmPassword);
      if (storedShowPassword === "true") setShowPassword(true);
      if (storedShowConfirmPassword === "true") setShowConfirmPassword(true);
      if (storedAddress) setAddress(storedAddress);
    };

    initialize();
  }, []);

  useEffect(() => {
    setToStorage("createWalletStep", step);
  }, [step]);

  useEffect(() => {
    setToStorage("createWalletPassword", password);
  }, [password]);

  useEffect(() => {
    setToStorage("createWalletConfirmPassword", confirmPassword);
  }, [confirmPassword]);

  useEffect(() => {
    setToStorage("createWalletShowPassword", showPassword.toString());
  }, [showPassword]);

  useEffect(() => {
    setToStorage(
      "createWalletShowConfirmPassword",
      showConfirmPassword.toString()
    );
  }, [showConfirmPassword]);

  // NOTE: Seed phrase is NOT saved to storage

  useEffect(() => {
    if (address) {
      setToStorage("createWalletAddress", address);
    } else {
      removeFromStorage("createWalletAddress");
    }
  }, [address]);

  const handlePasswordSubmit = async () => {
    if (password.length >= 8 && password === confirmPassword) {
      const hashed = await hashPassword(password);
      await setToStorage("walletPassword", hashed);

      const mnemonic = mnemonicGenerate(12);
      const keyring = new Keyring({ type: "sr25519", ss58Format: 42 });
      const pair = keyring.addFromUri(mnemonic);

      setSeedPhrase(mnemonic.split(" "));
      setAddress(pair.address);
      setStep(2);
    }
  };

  const handleCopySeed = () => {
    navigator.clipboard.writeText(seedPhrase.join(" "));
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 2000);
  };

  const handleFinishSetup = async () => {
    if (!address) return;

    // Clean up Chrome storage except seed phrase
    await Promise.all([
      removeFromStorage("createWalletStep"),
      removeFromStorage("createWalletPassword"),
      removeFromStorage("createWalletConfirmPassword"),
      removeFromStorage("createWalletShowPassword"),
      removeFromStorage("createWalletShowConfirmPassword"),
      removeFromStorage("createWalletAddress"),
    ]);

    onWalletCreated({
      address,
      seedPhrase: seedPhrase.join(" "),
      balance: "0.00",
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-white">Create Wallet</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">
                Secure Your Wallet
              </h2>
              <p className="text-gray-400 text-sm">
                Create a strong password to protect your wallet
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white pr-10"
                    placeholder="Enter password (min 8 characters)"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/4 w-4 h-4 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 mr-1" />
                    ) : (
                      <Eye className="w-4 h-4 mr-1" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirm Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white pr-10"
                    placeholder="Confirm your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/4 w-4 h-4 text-gray-400 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 mr-1" />
                    ) : (
                      <Eye className="w-4 h-4 mr-1" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePasswordSubmit}
              disabled={password.length < 8 || password !== confirmPassword}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">
                Backup Your Wallet
              </h2>
              <p className="text-gray-400 text-sm">
                Write down your seed phrase and keep it safe
              </p>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center justify-between">
                  Seed Phrase
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopySeed}
                    className="text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                  >
                    {copiedSeed ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {seedPhrase.map((word, index) => (
                    <div
                      key={index}
                      className="bg-gray-700 p-2 rounded text-center text-sm text-gray-300"
                    >
                      {word}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-400 text-sm">
                <strong>Warning:</strong> Never share your seed phrase with
                anyone. Store it securely offline.
              </p>
            </div>

            <Button
              onClick={handleFinishSetup}
              variant="secondary"
              className="w-full"
            >
              I've Saved My Seed Phrase
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
