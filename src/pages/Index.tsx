import { useState } from "react";
import WalletHeader from "@/components/wallet/WalletHeader";
import WalletSetup from "@/components/wallet/WalletSetup";
import TwoFactorAuth from "@/components/wallet/TwoFactorAuth";
import { Button } from "@/components/ui/button";

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
          
          <div className="space-y-4">
            <TwoFactorAuth 
              userId={walletData.address}
              onSecretGenerated={handleSecretGenerated}
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => (window.location.href = "/v1/wallet/login")}>
                Se connecter au Wallet
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  window.open("https://app.winedge.io/login", "_blank", "noopener,noreferrer")
                }
              >
                Se connecter à l'application Winedge
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
