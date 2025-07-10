import { useState, useEffect } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Send,
  ArrowDownToLine,
  ArrowUpFromLine,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";
import type { WalletData } from "./LandingPage";

interface WalletDashboardProps {
  walletData: WalletData;
  onBack: () => void;
}

export default function WalletDashboard({
  walletData,
  onBack,
}: WalletDashboardProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState<"assets" | "transactions">(
    "assets"
  );
  const [balance, setBalance] = useState<string>(walletData?.balance || "0");
  const [usdPrice, setUsdPrice] = useState<number | null>(null);

  // Fetch TAO balance from chain
  useEffect(() => {
    if (!walletData?.address) return;

    const wsProvider = new WsProvider(
      "wss://bittensor-finney.api.onfinality.io/public-ws"
    );
    let api: ApiPromise;

    async function fetchBalance() {
      try {
        api = await ApiPromise.create({ provider: wsProvider });

        const { data: balanceData } = await api.query.system.account(
          walletData?.address
        );

        const free = balanceData.free.toBigInt();

        // Adjust decimals according to TAO token decimals (9 or 12, check your chain docs)
        const decimals = 9n;
        const divisor = 10n ** decimals;

        const whole = free / divisor;
        const fraction = free % divisor;
        const fractionStr = fraction
          .toString()
          .padStart(Number(decimals), "0")
          .slice(0, 4);

        setBalance(`${whole.toString()}.${fractionStr}`);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance("0");
      }
    }

    fetchBalance();

    return () => {
      if (api) {
        api.disconnect();
      }
    };
  }, [walletData?.address]);

  // Fetch TAO price in USD from Kraken
  useEffect(() => {
    async function fetchPrice() {
      try {
        const response = await fetch(
          "https://api.kraken.com/0/public/Ticker?pair=TAOUSD"
        );
        const data = await response.json();

        const pairKey = Object.keys(data.result)[0];
        const priceStr = data.result[pairKey].c[0];

        setUsdPrice(parseFloat(priceStr));
      } catch (error) {
        console.error("Error fetching TAO price:", error);
        setUsdPrice(null);
      }
    }

    fetchPrice();

    const interval = setInterval(fetchPrice, 60 * 1000); // refresh every minute

    return () => clearInterval(interval);
  }, []);

  const usdValueStr =
    usdPrice && balance !== "0"
      ? `$${(parseFloat(balance) * usdPrice).toFixed(2)}`
      : "≈ $0 USD";

  const transactions = [
    {
      id: "1",
      type: "received",
      amount: "0.5 TAO",
      from: "0x1234...5678",
      timestamp: "2 hours ago",
      status: "confirmed",
    },
    {
      id: "2",
      type: "sent",
      amount: "0.25 TAO",
      to: "0x9876...4321",
      timestamp: "1 day ago",
      status: "confirmed",
    },
    {
      id: "3",
      type: "received",
      amount: "1.0 TAO",
      from: "0x5555...7777",
      timestamp: "3 days ago",
      status: "confirmed",
    },
  ];

  const copyAddress = () => {
    if (walletData) {
      navigator.clipboard.writeText(walletData.address);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Wallet</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Balance Section */}
        <div className="p-6 text-center border-b border-gray-800">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAddress}
              className="text-gray-400 hover:text-white hover:bg-gray-800 text-xs"
            >
              {walletData?.address.slice(0, 6)}...
              {walletData?.address.slice(-4)}
              <Copy className="w-3 h-3 ml-1" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-3xl font-bold text-white">
              {showBalance ? `${balance} TAO` : "•••••••••"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowBalance(!showBalance)}
              className="text-gray-400 hover:text-white w-8 h-8"
            >
              {showBalance ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-gray-400 text-sm">
            {showBalance ? usdValueStr : "••••••"}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 rounded-xl bg-transparent"
            >
              <ArrowDownToLine className="w-4 h-4 mr-2" />
              Receive
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <Button
            variant="ghost"
            className={`flex-1 py-3 rounded-none ${
              activeTab === "assets"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("assets")}
          >
            Assets
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 py-3 rounded-none ${
              activeTab === "transactions"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === "assets" && (
            <div className="space-y-3">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          TAO
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">TAO</h3>
                        <p className="text-gray-400 text-sm">TAO</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{balance} TAO</p>
                      <p className="text-gray-400 text-sm">{usdValueStr}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <Card key={tx.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            tx.type === "received"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        >
                          {tx.type === "received" ? (
                            <ArrowDownToLine className="w-5 h-5 text-white" />
                          ) : (
                            <ArrowUpFromLine className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white capitalize">
                            {tx.type}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {tx.type === "received"
                              ? `From ${tx.from}`
                              : `To ${tx.to}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            tx.type === "received"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {tx.type === "received" ? "+" : "-"}
                          {tx.amount}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-gray-400 text-sm">
                            {tx.timestamp}
                          </p>
                          <Badge
                            variant="secondary"
                            className="bg-green-900 text-green-400 text-xs"
                          >
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
