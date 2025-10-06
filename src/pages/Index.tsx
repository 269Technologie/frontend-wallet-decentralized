import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WalletHeader from "@/components/wallet/WalletHeader";
import WalletSetup from "@/components/wallet/WalletSetup";
import TwoFactorAuth from "@/components/wallet/TwoFactorAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogIn, ExternalLink, Copy, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [showWelcome2FA, setShowWelcome2FA] = useState(false);
  const { toast } = useToast();
  const [copiedMnemonic, setCopiedMnemonic] = useState(false);

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

  const handleCopyMnemonic = () => {
    if (!walletData?.mnemonic) return;
    navigator.clipboard.writeText(walletData.mnemonic);
    toast({
      title: "Copié",
      description: "Phrase de récupération copiée dans le presse-papiers.",
    });
    setCopiedMnemonic(true);
    setTimeout(() => setCopiedMnemonic(false), 1500);
  };

  const handleDownloadMnemonic = () => {
    if (!walletData?.mnemonic) return;
    const blob = new Blob([walletData.mnemonic], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seed-phrase.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // If no wallet, show setup
  if (!walletData) {
    return <WalletSetup onWalletCreated={handleWalletCreated} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome 2FA dialog removed as requested */}
        <div className="space-y-6">
                    <WalletHeader 
            address={walletData.address} 
            privateKey={walletData.privateKey}
            twoFASecret={twoFASecret}
          />
          
          <div className="space-y-4">
            {/* <TwoFactorAuth 
              userId={walletData.address} 
              onSecretGenerated={handleSecretGenerated}
            /> */}

            {walletData.mnemonic && (
              <Card className="p-6 border border-amber-300/50 bg-amber-50/30 dark:bg-amber-500/5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="sm:max-w-[60%]">
                    <h3 className="text-lg font-semibold">Phrase de récupération</h3>
                    <p className="text-sm text-muted-foreground">
                      Conservez ces mots en lieu sûr. Ne les partagez jamais. Ils permettent de restaurer l'accès à votre wallet.
                    </p>
                  </div>
                  <div className="flex flex-wrap w-full sm:w-auto gap-2">
                    <div className="relative flex-1 min-w-[120px]">
                      {copiedMnemonic && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
                          Copié
                        </div>
                      )}
                      <Button variant="outline" size="sm" onClick={handleCopyMnemonic} className="w-full">
                        <Copy className="h-4 w-4 mr-2" /> Copier
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDownloadMnemonic} className="flex-1 min-w-[120px]">
                      Télécharger
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {walletData.mnemonic.split(' ').map((word, idx) => (
                        <div key={idx} className="px-2 py-2 rounded-md bg-muted text-foreground font-mono text-xs sm:text-sm break-words">
                          <span className="text-muted-foreground mr-2">{idx + 1}.</span>
                          {word}
                        </div>
                      ))}
                    </div>
                </div>
              </Card>
            )}

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
