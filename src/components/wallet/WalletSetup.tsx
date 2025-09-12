import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Bitcoin, Key, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WalletSetup = ({ onWalletCreated }: { onWalletCreated: (walletData: any) => void }) => {
  const [loading, setLoading] = useState(false);
  const [mnemonic, setMnemonic] = useState("");
  const [wordCount, setWordCount] = useState("12");
  const { toast } = useToast();

  const createWallet = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.winedge.io/v2/wallet/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          words: parseInt(wordCount)
        })
      });
      
      if (response.ok) {
        const walletData = await response.json();
        console.log("Données du wallet reçues:", walletData); // Pour déboguer
        toast({
          title: "Wallet créé avec succès",
          description: "Votre nouveau wallet Bitcoin a été généré.",
        });
        onWalletCreated(walletData);
      } else {
        const errorData = await response.text();
        console.error("Réponse du serveur:", {
          status: response.status,
          statusText: response.statusText,
          body: errorData
        });
        throw new Error(`Erreur lors de la création du wallet: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur lors de la création du wallet:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le wallet. Vérifiez que le backend est en marche.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const restoreWallet = async () => {
    if (!mnemonic.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une phrase de récupération valide.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://api.winedge.io/v2/wallet/restore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mnemonic }),
      });
      
      if (response.ok) {
        const walletData = await response.json();
        toast({
          title: "Wallet restauré avec succès",
          description: "Votre wallet a été restauré à partir de la phrase de récupération.",
        });
        onWalletCreated(walletData);
      } else {
        throw new Error("Erreur lors de la restauration du wallet");
      }
    } catch (error) {
      console.error("Erreur lors de la restauration du wallet:", error);
      toast({
        title: "Erreur",
        description: "Impossible de restaurer le wallet. Vérifiez votre phrase de récupération.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <Bitcoin className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Création & Récupération
          </h1>
          <p className="text-muted-foreground">
            Créez un nouveau wallet ou restaurez un wallet existant
          </p>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Créer un wallet
            </TabsTrigger>
            <TabsTrigger value="restore" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Restaurer un wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="text-center space-y-4">
              <Key className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">
                Créer un nouveau wallet
              </h2>
                <p className="text-muted-foreground">
                  🔐 Vos fonds, vos clés.
                      Avec WinEdge, vous êtes l’unique détenteur de vos clés privées. Ni WinEdge ni ses partenaires n’y ont accès.

                      👉 Lors de la création de votre wallet, une phrase de récupération unique (12 ou 24 mots) vous sera remise.
                      ⚠️ Conservez-la uniquement sur papier, rangée en lieu sûr.
                      Ne jamais la stocker sur votre téléphone, ordinateur ou par capture d’écran : c’est la seule clé qui protège vos Bitcoins.

                      💡 Ainsi, même en cas de panne ou d’arrêt de l’application, vos cryptos restent toujours accessibles, car elles vous appartiennent réellement.

                      ✨ Notre philosophie :
                      Not your keys, not your coins.
                      Avec WinEdge, votre épargne reste 100 % sous votre contrôle
                </p>
              <div className="space-y-4">
                <Label>Nombre de mots pour la phrase de récupération</Label>
                <RadioGroup
                  defaultValue="12"
                  value={wordCount}
                  onValueChange={setWordCount}
                  className="flex justify-center gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="12" id="r1" />
                    <Label htmlFor="r1">12 mots</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="24" id="r2" />
                    <Label htmlFor="r2">24 mots</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button
                onClick={createWallet}
                disabled={loading}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {loading ? "Création en cours..." : "Créer un nouveau wallet"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="restore" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="mnemonic" className="text-base font-medium">
                  Phrase de récupération (seed phrase)
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Entrez votre phrase de récupération de 12 ou 24 mots
                </p>
                <Textarea
                  id="mnemonic"
                  placeholder="word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"
                  value={mnemonic}
                  onChange={(e) => setMnemonic(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>
              <Button
                onClick={restoreWallet}
                disabled={loading || !mnemonic.trim()}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {loading ? "Restauration en cours..." : "Restaurer le wallet"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default WalletSetup;