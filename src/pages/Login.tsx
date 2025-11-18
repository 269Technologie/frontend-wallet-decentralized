import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Bitcoin, Lock, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [step, setStep] = useState<"address" | "2fa">("address");
  const [address, setAddress] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fonction de validation d'adresse Bitcoin
  const isValidBitcoinAddress = (addr: string): boolean => {
    // Vérifier si l'adresse est vide
    if (!addr || addr.trim() === "") return false;

    // Regex pour les différents formats d'adresses Bitcoin
    const p2pkhRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/; // Legacy (commence par 1 ou 3)
    const bech32Regex = /^(bc1|tb1)[a-z0-9]{39,87}$/i; // SegWit (commence par bc1)
    const bech32mRegex = /^(bc1p|tb1p)[a-z0-9]{58,}$/i; // Taproot (commence par bc1p)

    // Tester tous les formats
    return (
      p2pkhRegex.test(addr) ||
      bech32Regex.test(addr) ||
      bech32mRegex.test(addr)
    );
  };

  const handleAddressSubmit = async () => {
    if (!address) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre adresse Bitcoin",
        variant: "destructive",
      });
      return;
    }

    // Validation du format de l'adresse Bitcoin
    if (!isValidBitcoinAddress(address)) {
      toast({
        title: "Adresse invalide",
        description: "Le format de l'adresse Bitcoin n'est pas valide. Veuillez vérifier et réessayer.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Vérifie si l'adresse existe et a le 2FA activé
      const response = await fetch(`https://api.winedge.io/v2/wallet/verify/${address}`);
      if (response.ok) {
        toast({
          title: "Adresse vérifiée",
          description: "Veuillez entrer votre code 2FA",
        });
        setStep("2fa");
      } else {
        throw new Error("Adresse non trouvée ou 2FA non activé");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Adresse non trouvée ou 2FA non activé sur cette adresse",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!twoFACode) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer le code 2FA",
        variant: "destructive",
      });
      return;
    }

    if (twoFACode.length !== 6 || !/^\d+$/.test(twoFACode)) {
      toast({
        title: "Code invalide",
        description: "Le code 2FA doit contenir exactement 6 chiffres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://api.winedge.io/v2/wallet/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          token: twoFACode,
        }),
      });

      if (response.ok) {
        const walletData = await response.json();
        // Stocker les données du wallet dans le localStorage ou un état global
        localStorage.setItem("wallet", JSON.stringify(walletData));
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre wallet",
        });
        // Redirection vers le dashboard (à implémenter selon votre routing)
        console.log("Redirection vers dashboard avec les données:", walletData);
      } else {
        throw new Error("Code 2FA invalide");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Code 2FA incorrect. Veuillez réessayer.",
        variant: "destructive",
      });
      setTwoFACode(""); // Réinitialise le code pour réessayer
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Bitcoin className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Accès au Wallet</h1>
        </div>

        {step === "address" ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address">Adresse Bitcoin</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="address"
                  placeholder="Entrez votre adresse Bitcoin"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10"
                />
              </div>
              
            </div>

            <Button
              onClick={handleAddressSubmit}
              disabled={loading || !address}
              className="w-full"
            >
              {loading ? "Vérification..." : "Continuer"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="2fa">Code d'authentification</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="2fa"
                  type="text"
                  inputMode="numeric"
                  placeholder="Code à 6 chiffres"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Entrez le code généré par votre application d'authentification
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleLogin}
                disabled={loading || twoFACode.length !== 6}
                className="w-full"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStep("address");
                  setTwoFACode("");
                }}
                className="w-full"
              >
                Retour
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Login;