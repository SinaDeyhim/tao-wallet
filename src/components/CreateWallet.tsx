import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hashPassword } from "@/utils/password";

import { mnemonicGenerate } from "@polkadot/util-crypto";
import { Keyring } from "@polkadot/keyring";

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
  // Load state from localStorage or fallback to defaults
  const [step, setStep] = useState<number>(() => {
    const saved = localStorage.getItem("createWalletStep");
    return saved ? Number(saved) : 1;
  });

  const [password, setPassword] = useState<string>(() => {
    return localStorage.getItem("createWalletPassword") || "";
  });

  const [confirmPassword, setConfirmPassword] = useState<string>(() => {
    return localStorage.getItem("createWalletConfirmPassword") || "";
  });

  const [showPassword, setShowPassword] = useState<boolean>(() => {
    const saved = localStorage.getItem("createWalletShowPassword");
    return saved === "true";
  });

  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(
    () => {
      const saved = localStorage.getItem("createWalletShowConfirmPassword");
      return saved === "true";
    }
  );

  const [seedPhrase, setSeedPhrase] = useState<string[]>(() => {
    const saved = localStorage.getItem("createWalletSeedPhrase");
    return saved ? JSON.parse(saved) : [];
  });

  const [address, setAddress] = useState<string | null>(() => {
    return localStorage.getItem("createWalletAddress");
  });

  const [copiedSeed, setCopiedSeed] = useState(false);

  // Save step
  useEffect(() => {
    localStorage.setItem("createWalletStep", step.toString());
  }, [step]);

  // Save password (WARNING: consider security for production!)
  useEffect(() => {
    localStorage.setItem("createWalletPassword", password);
  }, [password]);

  useEffect(() => {
    localStorage.setItem("createWalletConfirmPassword", confirmPassword);
  }, [confirmPassword]);

  useEffect(() => {
    localStorage.setItem("createWalletShowPassword", showPassword.toString());
  }, [showPassword]);

  useEffect(() => {
    localStorage.setItem(
      "createWalletShowConfirmPassword",
      showConfirmPassword.toString()
    );
  }, [showConfirmPassword]);

  useEffect(() => {
    localStorage.setItem("createWalletSeedPhrase", JSON.stringify(seedPhrase));
  }, [seedPhrase]);

  useEffect(() => {
    if (address) {
      localStorage.setItem("createWalletAddress", address);
    } else {
      localStorage.removeItem("createWalletAddress");
    }
  }, [address]);

  const handlePasswordSubmit = async () => {
    if (password.length >= 8 && password === confirmPassword) {
      const hashed = await hashPassword(password);
      localStorage.setItem("walletPassword", hashed);

      // Generate mnemonic and keypair
      const mnemonic = mnemonicGenerate(12);
      const keyring = new Keyring({ type: "sr25519", ss58Format: 22 });
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

  const handleFinishSetup = () => {
    if (!address) return;

    // Clear localStorage for sensitive info after finishing setup
    localStorage.removeItem("createWalletStep");
    localStorage.removeItem("createWalletPassword");
    localStorage.removeItem("createWalletConfirmPassword");
    localStorage.removeItem("createWalletShowPassword");
    localStorage.removeItem("createWalletShowConfirmPassword");
    localStorage.removeItem("createWalletSeedPhrase");
    localStorage.removeItem("createWalletAddress");

    onWalletCreated({
      address,
      seedPhrase: seedPhrase.join(" "),
      balance: "0.00", // placeholder
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

      <div className="flex-1 p-6">
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
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
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
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePasswordSubmit}
              disabled={password.length < 8 || password !== confirmPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
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
                      <span className="text-gray-500 text-xs">
                        {index + 1}.
                      </span>{" "}
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
            >
              I've Saved My Seed Phrase
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
