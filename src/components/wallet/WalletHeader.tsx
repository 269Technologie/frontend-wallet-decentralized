import { Bitcoin, Copy, QrCode, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

    if (address) fetchBalance();
  }, [address]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Adresse copiée",
      description: "L'adresse du wallet a été copiée dans le presse-papiers.",
    });
  };
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(
    address || ""
  )}`;

  const downloadQRCode = async () => {
    try {
      const res = await fetch(qrUrl);
      if (!res.ok) throw new Error("Échec du téléchargement du QR");
      const blob = await res.blob();
      const a = document.createElement("a");
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = `${"wallet"}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le QR code.",
      });
    }
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
              <div className="relative">
                {copied && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
                    Copié
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <QrCode className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                  <DialogHeader>
                    <DialogTitle>QR Code de l'adresse</DialogTitle>
                    <div className="mt-4 flex flex-col items-center gap-3">
                      <div className="bg-white p-3 rounded-lg shadow-md">
                        <img
                          src={qrUrl}
                          alt="QR code"
                          className="w-48 h-48 rounded-md"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground break-words text-center px-2">
                        {address}
                      </div>
                    </div>
                  </DialogHeader>
                  <DialogFooter>
                    <div className="w-full flex justify-center gap-2">
                      <Button variant="default" onClick={downloadQRCode}>
                        Télécharger
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WalletHeader;