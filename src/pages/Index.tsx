import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WalletHeader from "@/components/wallet/WalletHeader";
import WalletSetup from "@/components/wallet/WalletSetup";
import TwoFactorAuth from "@/components/wallet/TwoFactorAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogIn, ExternalLink, Sparkles } from "lucide-react";

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
  const navigate = useNavigate();

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
          <div className="flex justify-center">
            <Card className="w-full max-w-3xl mx-auto text-center p-6 bg-gradient-to-br from-background to-muted/50 border-border shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2 text-primary">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium">Bienvenue</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Bienvenue dans votre Wallet décentralisé</h2>
              <p className="text-muted-foreground">
                Si vous souhaitez vous connecter à votre wallet, veuillez d'abord générer et activer le 2FA.
              </p>
            </Card>
          </div>
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
              <Button
                onClick={() => navigate("/login")}
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-lg hover:opacity-90 transition"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Se connecter au Wallet
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  window.open("https://app.winedge.io/login", "_blank", "noopener,noreferrer")
                }
                className="h-12 px-6 rounded-xl border-2 hover:bg-muted/50 transition"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
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
