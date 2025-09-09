import { Bitcoin, Copy, QrCode, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface WalletHeaderProps {
  address: string;
  privateKey?: string;
  twoFASecret?: string;
}

const WalletHeader = ({ address, privateKey, twoFASecret }: WalletHeaderProps) => {
  const [balance, setBalance] = useState("0.00000000");
  const [usdValue, setUsdValue] = useState("$0.00");
  const { toast } = useToast();

  useEffect(() => {
    fetchBalance();
  }, [address]);

  const fetchBalance = async () => {
    try {
      const response = await fetch(`https://api.winedge.io/v2/balance/${address}`);
      if (response.ok) {
        const data = await response.json();
        setBalance((data.balance / 100000000).toFixed(8)); // Convert from satoshis to BTC
        setUsdValue(`$${(data.balance / 100000000 * 43720).toFixed(2)}`); // Assuming BTC price
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du solde:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Adresse copiée",
      description: "L'adresse du wallet a été copiée dans le presse-papiers.",
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-card to-secondary border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bitcoin className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Bitcoin Wallet</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="text-center">
        <div className="text-4xl font-bold text-primary mb-2">
          {balance} BTC
        </div>
        <div className="text-lg text-muted-foreground mb-6">
          ≈ {usdValue} USD
        </div>
        
        <div className="bg-background rounded-lg p-4 border border-border">
          <div className="text-sm text-muted-foreground mb-2">Wallet Address</div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-mono text-foreground truncate">
              {address}
            </div>
            <div className="flex gap-2 ml-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={copyToClipboard}
                className="h-8 w-8"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WalletHeader;