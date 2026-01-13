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

  // Fonction de validation d'adresse Bitcoin
  const validateBitcoinAddress = (address: string): boolean => {
    try {
      // Vérifier les formats d'adresse Bitcoin courants
      // Legacy (P2PKH): commence par "1"
      // Script (P2SH): commence par "3"
      // SegWit (Bech32): commence par "bc1"
      
      if (!address || address.trim().length === 0) {
        return false;
      }

      // Vérification basique du format
      if (address.startsWith('1') || address.startsWith('3')) {
        // Legacy ou P2SH
        try {
          bitcoin.address.toOutputScript(address, bitcoin.networks.bitcoin);
          return true;
        } catch (e) {
          return false;
        }
      } else if (address.toLowerCase().startsWith('bc1')) {
        // Bech32 (SegWit)
        try {
          bitcoin.address.toOutputScript(address, bitcoin.networks.bitcoin);
          return true;
        } catch (e) {
          return false;
        }
      }
      
      return false;
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
            <h1 className="text-3xl font-bold text-gray-900">Connecter un wallet existant</h1>
            <p className="text-gray-600 mt-2">
              Saisissez votre adresse Bitcoin pour recevoir vos arrondis
            </p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 text-lg mb-3">📋 Instructions</h3>
            <ol className="space-y-2 text-blue-900 list-decimal list-inside">
              <li>Ouvrez votre wallet Bitcoin existant (MetaMask, Ledger, Trezor, etc.)</li>
              <li>Copiez votre adresse de réception Bitcoin</li>
              <li>Collez cette adresse dans le champ ci-dessous</li>
            </ol>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900">
              Adresse Bitcoin (BTC)
            </label>
            <p className="text-sm text-gray-600 mb-2">
              L'adresse commence généralement par "bc1...", "1..." ou "3..."
            </p>
            <Input
              type="text"
              placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
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
              <strong>⚠️ Important :</strong> Assurez-vous de saisir une adresse <strong>Bitcoin (BTC)</strong> uniquement. 
              Les adresses Ethereum, Binance ou autres cryptomonnaies ne fonctionneront pas.
            </p>
          </div>

          <Button
            onClick={() => {
              if (!bitcoinAddress.trim()) {
                toast({
                  title: "Erreur",
                  description: "Veuillez saisir une adresse Bitcoin",
                  variant: "destructive",
                });
                return;
              }
              setStep(2);
            }}
            className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
            disabled={!bitcoinAddress.trim()}
          >
            Vérifier l'adresse
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
    
    const valid = validateBitcoinAddress(bitcoinAddress.trim());
    setIsValid(valid);
    
    if (valid) {
      toast({
        title: "✅ Adresse Bitcoin valide",
        description: "Votre adresse a été vérifiée avec succès",
      });
      setTimeout(() => setStep(3), 1000);
    } else {
      toast({
        title: "❌ Adresse invalide",
        description: "Cette adresse n'est pas compatible Bitcoin (BTC). Vérifiez que vous avez bien copié une adresse Bitcoin.",
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
                  Vérification de la validité de votre adresse Bitcoin.<br />
                  Veuillez patienter quelques instants.
                </p>
              </>
            )}

            {isValid === false && (
              <>
                <div className="bg-red-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto">
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">❌ Adresse non valide</h2>
                <p className="text-red-600 text-lg font-semibold">
                  Cette adresse n'est pas compatible Bitcoin
                </p>
                
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-left">
                  <h3 className="font-bold text-red-900 mb-3">Vérifiez que :</h3>
                  <ul className="space-y-2 text-red-900">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Vous avez copié une adresse <strong>Bitcoin (BTC)</strong> et non Ethereum (ETH), Binance (BNB), etc.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>L'adresse commence par "bc1...", "1..." ou "3..."</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>L'adresse est complète (pas de caractères manquants)</span>
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
        title: "✅ Wallet connecté avec succès",
        description: "Votre wallet est maintenant connecté à WinEdge",
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
            <h1 className="text-3xl font-bold text-gray-900">✅ Adresse Bitcoin valide</h1>
            <p className="text-xl text-gray-600 mt-2">
              Votre adresse a été vérifiée avec succès
            </p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 text-lg mb-3">📍 Votre adresse Bitcoin</h3>
            <div className="bg-white p-4 rounded border border-blue-200">
              <p className="font-mono text-sm break-all text-gray-900">
                {bitcoinAddress}
              </p>
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <h3 className="font-bold text-green-900 text-lg mb-3">✅ Prochaines étapes</h3>
            <ul className="space-y-2 text-green-900">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Ton wallet sera connecté à WinEdge</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Tes Bitcoin seront envoyés automatiquement à cette adresse</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Chaque lundi, tes arrondis convertis y seront transférés</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="flex-1"
            >
              ← Modifier l'adresse
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
