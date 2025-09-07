import { useState, useEffect } from "react";
import WalletHeader from "@/components/wallet/WalletHeader";
import QuickActions from "@/components/wallet/QuickActions";
import TransactionHistory from "@/components/wallet/TransactionHistory";
import PriceChart from "@/components/wallet/PriceChart";
import WalletSetup from "@/components/wallet/WalletSetup";
import SendTransaction from "@/components/wallet/SendTransaction";
import TwoFactorAuth from "@/components/wallet/TwoFactorAuth";

interface IndexProps {
  onWalletCreated: (wallet: any) => void;
}

const Index = ({ onWalletCreated: parentOnWalletCreated }: IndexProps) => {
  const [walletData, setWalletData] = useState<{
    address: string;
    balance?: string;
    mnemonic?: string;
    privateKey?: string;
  } | null>(null);
  const [twoFASecret, setTwoFASecret] = useState<string>("");

  const handleWalletCreated = (wallet: {
    address: string;
    balance?: string;
    mnemonic?: string;
    privateKey?: string;
  }) => {
    setWalletData(wallet);
    localStorage.setItem("walletData", JSON.stringify(wallet));
    parentOnWalletCreated(wallet);
  };

  const handleSecretGenerated = (secret: string) => {
    setTwoFASecret(secret);
  };

  // If no wallet, show setup
  if (!walletData) {
    return <WalletSetup onWalletCreated={handleWalletCreated} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <WalletHeader 
            address={walletData.address} 
            privateKey={walletData.privateKey}
            twoFASecret={twoFASecret}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <SendTransaction 
                  walletAddress={walletData.address}
                  privateKey={walletData.privateKey}
                  twoFASecret={twoFASecret}
                />
                <TwoFactorAuth 
                  userId={walletData.address}
                  onSecretGenerated={handleSecretGenerated}
                />
              </div>
              <QuickActions />
            </div>
            <PriceChart />
          </div>
          
          <TransactionHistory address={walletData.address} />
        </div>
      </div>
    </div>
  );
};

export default Index;
