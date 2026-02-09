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
  network?: "btc" | "bsc";
  privateKey?: string;
  twoFASecret?: string;
}

const WalletHeader = ({ address, network = "btc", privateKey, twoFASecret }: WalletHeaderProps) => {
  const [balance, setBalance] = useState("0.00000000");
  const [usdValue, setUsdValue] = useState("$0.00");
  const { toast } = useToast();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (network === "btc") {
          // Use mempool.space for Bitcoin balance
          const response = await fetch(`https://mempool.space/api/address/${address}`);
          if (response.ok) {
            const data = await response.json();
            const stats = data.chain_stats;
            const satBalance = stats.funded_txo_sum - stats.spent_txo_sum;
            const btcBalance = satBalance / 100000000;
            setBalance(btcBalance.toFixed(8));
            setUsdValue(`$${(btcBalance * 43720).toFixed(2)}`); // Assuming BTC price
          }
        } else if (network === "bsc") {
          // Use Binance Public RPC for BSC balance
          const response = await fetch("https://bsc-dataseed.binance.org/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "eth_getBalance",
              params: [address, "latest"]
            })
          });
          if (response.ok) {
            const data = await response.json();
            if (data.result) {
              const wei = BigInt(data.result);
              const bnbBalance = Number(wei) / 1e18;
              setBalance(bnbBalance.toFixed(18).slice(0, 10)); // Show manageable decimals
              setUsdValue(`$${(bnbBalance * 300).toFixed(2)}`); // Assuming BNB price
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du solde:", error);
      }
    };

    if (address) fetchBalance();
  }, [address, network]);

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
          {balance} {network === "btc" ? "BTC" : "BNB/WIT"}
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