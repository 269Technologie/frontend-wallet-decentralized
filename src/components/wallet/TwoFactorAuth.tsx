import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TwoFactorAuthProps {
  userId: string;
  onSecretGenerated: (secret: string) => void;
}

const TwoFactorAuth = ({ userId, onSecretGenerated }: TwoFactorAuthProps) => {
  const [secret, setSecret] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [step, setStep] = useState<"generate" | "verify">("generate");
  const { toast } = useToast();

  const generate2FA = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.winedge.io/v2/wallet/2fa/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      
      if (response.ok) {
        const result = await response.json();
        setSecret(result.secret);
        setQrCode(result.qrCode);
        setStep("verify");
        toast({
          title: "2FA généré",
          description: "Scannez le QR code avec votre application d'authentification.",
        });
      } else {
        throw new Error("Erreur lors de la génération du 2FA");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le 2FA.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async () => {
    if (!verificationToken) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer le code de vérification.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://api.winedge.io/v2/wallet/2fa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret,
          token: verificationToken,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.verified) {
          toast({
            title: "2FA activé",
            description: "L'authentification à deux facteurs a été activée avec succès.",
          });
          onSecretGenerated(secret);
          setShowDialog(false);
        } else {
          toast({
            title: "Code invalide",
            description: "Le code de vérification est incorrect.",
            variant: "destructive",
          });
        }
      } else {
        throw new Error("Erreur lors de la vérification du 2FA");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de vérifier le code 2FA.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Configurer 2FA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentification à deux facteurs
          </DialogTitle>
        </DialogHeader>
        
        {step === "generate" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre wallet.
            </p>
            <Button
              onClick={generate2FA}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Génération en cours..." : "Générer le 2FA"}
            </Button>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-4">
            {qrCode && (
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Scannez ce QR code avec votre application d'authentification (Google Authenticator, Authy, etc.)
                </p>
                <Card className="p-4 bg-white">
                  <img src={qrCode} alt="QR Code 2FA" className="mx-auto" />
                </Card>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="verification-token">Code de vérification</Label>
              <Input
                id="verification-token"
                placeholder="123456"
                value={verificationToken}
                onChange={(e) => setVerificationToken(e.target.value)}
                maxLength={6}
              />
            </div>

            <div className="space-y-2">
              <Button
                onClick={verify2FA}
                disabled={loading || !verificationToken}
                className="w-full"
              >
                {loading ? "Vérification en cours..." : "Vérifier et activer"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep("generate")}
                className="w-full"
              >
                Retour
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorAuth;