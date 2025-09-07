import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowUpRight, Shield, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Fonction pour valider une adresse Bitcoin
const isValidBitcoinAddress = (address: string): boolean => {
  // Validation des adresses Legacy (commence par 1 ou 3)
  const legacyFormat = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  
  // Validation des adresses SegWit (commence par bc1)
  const segwitFormat = /^(bc1)[a-zA-HJ-NP-Z0-9]{25,39}$/;
  
  // Validation des adresses Native SegWit (commence par bc1q)
  const nativeSegwitFormat = /^bc1[ac-hj-np-z02-9]{11,71}$/;
  
  return legacyFormat.test(address) || 
         segwitFormat.test(address) || 
         nativeSegwitFormat.test(address);
};

interface SendTransactionProps {
  walletAddress: string;
  privateKey: string;
  twoFASecret?: string;
}

const SendTransaction = ({ walletAddress, privateKey, twoFASecret }: SendTransactionProps) => {
  const [toAddress, setToAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [amount, setAmount] = useState("");
  const [twoFAToken, setTwoFAToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const sendTransaction = async () => {
    if (!toAddress || !amount || addressError) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    if (twoFASecret && !twoFAToken) {
      toast({
        title: "Erreur",
        description: "Code 2FA requis pour cette transaction.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Convertir le montant en satoshis (1 BTC = 100,000,000 satoshis)
      const amountInSatoshis = Math.floor(parseFloat(amount) * 100000000);

      const response = await fetch("http://localhost:3000/transaction/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAddress: walletAddress,
          toAddress,
          amount: amountInSatoshis,
          privateKeyWIF: privateKey,
          secret: twoFASecret,
          token: twoFAToken,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Transaction envoyée",
          description: `Transaction réussie: ${result.txHash || 'Hash disponible dans la réponse'}`,
        });
        setShowDialog(false);
        setToAddress("");
        setAmount("");
        setTwoFAToken("");
      } else {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de l'envoi de la transaction");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'envoyer la transaction.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button className="w-full h-16 text-lg flex items-center gap-3">
          <ArrowUpRight className="h-6 w-6" />
          Envoyer Bitcoin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5" />
            Envoyer Bitcoin
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="to-address">Adresse de destination</Label>
            <>
              <Input
                id="to-address"
                placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                value={toAddress}
                onChange={(e) => {
                  const address = e.target.value;
                  setToAddress(address);
                  if (address) {
                    if (!isValidBitcoinAddress(address)) {
                      setAddressError("Adresse Bitcoin invalide");
                    } else {
                      setAddressError("");
                    }
                  } else {
                    setAddressError("");
                  }
                }}
                className={`font-mono text-sm ${addressError ? 'border-red-500' : ''}`}
              />
              {addressError && (
                <div className="flex items-center gap-2 mt-1 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {addressError}
                </div>
              )}
            </>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Montant (BTC)</Label>
            <Input
              id="amount"
              type="number"
              step="0.00000001"
              placeholder="0.00123456"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {twoFASecret && (
            <div className="space-y-2">
              <Label htmlFor="2fa-token" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Code 2FA
              </Label>
              <Input
                id="2fa-token"
                placeholder="123456"
                value={twoFAToken}
                onChange={(e) => setTwoFAToken(e.target.value)}
                maxLength={6}
              />
            </div>
          )}

          <div className="space-y-2 pt-4">
            <Button
              onClick={sendTransaction}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Envoi en cours..." : "Confirmer l'envoi"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="w-full"
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendTransaction;