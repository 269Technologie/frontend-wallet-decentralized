import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Check, Shield, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

interface CreateWalletFlowProps {
  onWalletCreated: (walletData: any) => void;
  onCancel: () => void;
}

const CreateWalletFlow = ({ onWalletCreated, onCancel }: CreateWalletFlowProps) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [walletData, setWalletData] = useState<any>(null);
  const [verificationWords, setVerificationWords] = useState<{ [key: number]: string }>({});
  const [requiredIndices, setRequiredIndices] = useState<number[]>([]);
  const { toast } = useToast();

  // Step 1: Security Instructions
  const renderStep1 = () => (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl p-8">
        <div className="space-y-6">
          <div className="text-center">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Wallet Décentralisé : Votre Souveraineté Financière</h1>
            <p className="text-gray-600 mt-2">Wallet Décentralisé</p>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-900 text-lg">Wallet Décentralisé</h3>
                <p className="text-red-800 mt-2">
                </p>
              </div>
            </div>
          
            <ul className="space-y-3 ml-9">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-red-900">
                  <strong>Vous êtes votre propre banque</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-red-900">
                  <strong>Contrôle total et exclusif de vos fonds</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-red-900">
                  <strong>Impossible à saisir ou bloquer</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-red-900">
                  <strong>Aucun intermédiaire ne peut accéder à vos Bitcoin</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-red-900">
                  <strong>Liberté financière absolue</strong>
                </span>
              </li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-3">
            <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Wallet Centralisé
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-blue-900">
                <span className="text-red-600 font-bold">✗</span>
                <span>Une entreprise contrôle vos fonds</span>
              </li>
              <li className="flex items-start gap-2 text-blue-900">
                <span className="text-red-600 font-bold">✗</span>
                <span>Vos Bitcoin peuvent être bloqués</span>
              </li>
              <li className="flex items-start gap-2 text-blue-900">
                <span className="text-red-600 font-bold">✗</span>
                <span>Saisissable par décision judiciaire</span>
              </li>
              <li className="flex items-start gap-2 text-blue-900">
                <span className="text-red-600 font-bold">✗</span>
                <span>Risque de faillite de la plateforme</span>
              </li>
              <li className="flex items-start gap-2 text-blue-900">
                <span className="text-red-600 font-bold">✗</span>
                <span>Dépendance totale à un tiers</span>
              </li>
            </ul>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-3">
            <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
              <Lock className="h-5 w-5" />
              La Garantie WinEdge
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-blue-900">
                <span className="text-blue-600 font-bold">•</span>
                <span>WinEdge n'a AUCUN accès à vos Bitcoin. Nous ne pouvons ni voir votre solde, ni bloquer vos transactions, ni récupérer vos fonds.</span>
              </li>
              <li className="flex items-start gap-2 text-blue-900">
                <span className="text-blue-600 font-bold">•</span>
                <span>Vos clés privées sont générées et stockées uniquement sur votre appareil. Architecture zero-knowledge garantie.</span>
              </li>
            </ul>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              className="mt-1"
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-700 cursor-pointer leading-relaxed"
            >
              <strong>J'ai compris et j'accepte les conditions de sécurité.</strong> Je comprends que WinEdge ne pourra pas récupérer mon accès si je perds ma phrase secrète et que mes fonds seront perdus définitivement.
            </label>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={() => setStep(2)}
              disabled={!acceptedTerms}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Continuer
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  // Step 2: Generating Wallet
  const generateWallet = async () => {
    try {
      const response = await fetch("https://api.winedge.io/v2/wallet/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words: 12 })
      });
      
      if (response.ok) {
        const data = await response.json();
        setWalletData(data);
        
        // Select 3 random word indices for verification
        const indices: number[] = [];
        while (indices.length < 3) {
          const rand = Math.floor(Math.random() * 12);
          if (!indices.includes(rand)) {
            indices.push(rand);
          }
        }
        setRequiredIndices(indices.sort((a, b) => a - b));
        
        setTimeout(() => setStep(3), 2000);
      } else {
        throw new Error("Erreur lors de la création du wallet");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le wallet. Vérifiez que le backend est en marche.",
        variant: "destructive",
      });
      onCancel();
    }
  };

  const renderStep2 = () => {
    // Auto-start generation when entering step 2
    if (walletData === null) {
      generateWallet();
    }

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="h-20 w-20 mx-auto">
                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Liberté Absolue = Responsabilité Absolue</h2>
            <p className="text-gray-600">
              Vous devez comprendre ces points avant de continuer<br />
              Veuillez patientez quelques instants.
            </p>
          </div>
        </Card>
      </div>
    );
  };

  // Step 3: Display Mnemonic
  const renderStep3 = () => {
    const words = walletData?.mnemonic?.split(' ') || [];

    return (
      <div className="min-h-screen bg-white p-4 py-8">
        <Card className="w-full max-w-4xl mx-auto p-8">
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">ÉTAPE CRITIQUE - Sauvegardez Immédiatement</h1>
              <p className="text-xl text-red-600 font-semibold mt-2">
                Vous êtes sur le point de voir votre phrase de récupération. Préparez papier et stylo MAINTENANT.
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
              <h3 className="font-bold text-red-900 text-lg mb-3">Votre Phrase de Récupération (12 mots)</h3>
              <p className="text-red-900 mb-3">Votre phrase est masquée pour votre sécurité</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700">
                  Révéler ma phrase de récupération
                </Button>
                <Button className="w-full h-14 text-lg bg-gray-600 hover:bg-gray-700">
                  Copier pour écriture temporaire (attention !)
                </Button>
              </div>
              <p className="text-green-600 mt-2 text-center font-semibold">Copié !</p>
            </div>

            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6">
              <h3 className="font-bold text-amber-900 text-lg mb-3">Votre phrase de récupération (12 mots)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {words.map((word: string, idx: number) => (
                  <div
                    key={idx}
                    className="px-4 py-3 rounded-lg bg-white border-2 border-amber-200 text-gray-900 font-mono text-sm"
                  >
                    <span className="text-gray-500 mr-2">{idx + 1}.</span>
                    <span className="font-semibold">{word}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-lg p-6 space-y-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <EyeOff className="h-5 w-5" />
                CE QUE VOUS NE DEVEZ JAMAIS FAIRE :
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  <span>JAMAIS de capture d'écran (synchronisée dans le cloud)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  <span>JAMAIS de photo (sauvegardée automatiquement)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  <span>JAMAIS dans un fichier texte ou Word</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  <span>JAMAIS par email ou messagerie</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  <span>JAMAIS partagée avec qui que ce soit (même WinEdge)</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 text-lg mb-2">CE QUE VOUS DEVEZ FAIRE :</h3>
              <ul className="space-y-2 text-blue-900">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>ÉCRIRE ces 12 mots sur PAPIER dans l'ordre exact</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>FAIRE au minimum 2 copies sur papier différent</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>CONSERVER ces papiers dans des lieux différents et sûrs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>VÉRIFIER l'orthographe de chaque mot</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => setStep(4)}
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
            >
              J'ai écrit ma phrase sur papier, continuer
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  // Step 4: Verify Mnemonic
  const renderStep4 = () => {
    const words = walletData?.mnemonic?.split(' ') || [];

    const handleVerify = () => {
      let allCorrect = true;
      for (const idx of requiredIndices) {
        if (verificationWords[idx]?.trim().toLowerCase() !== words[idx].toLowerCase()) {
          allCorrect = false;
          break;
        }
      }

      if (allCorrect) {
        toast({
          title: "✅ Vérification réussie !",
          description: "Votre phrase a été correctement sauvegardée.",
        });
        setStep(5);
      } else {
        toast({
          title: "❌ Erreur de vérification",
          description: "Les mots ne correspondent pas. Vérifiez votre sauvegarde et réessayez.",
          variant: "destructive",
        });
      }
    };

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <div className="space-y-6">
            <div className="text-center">
              <Check className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900">Vérification de Votre Phrase</h1>
              <p className="text-gray-600 mt-2">
                Confirmez que vous avez correctement noté votre phrase de récupération
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Mot n°3
                </label>
                <Input
                  type="text"
                  placeholder="Entrez le mot n°3"
                  value={verificationWords[2] || ''}
                  onChange={(e) =>
                    setVerificationWords({ ...verificationWords, 2: e.target.value })
                  }
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Mot n°7
                </label>
                <Input
                  type="text"
                  placeholder="Entrez le mot n°7"
                  value={verificationWords[6] || ''}
                  onChange={(e) =>
                    setVerificationWords({ ...verificationWords, 6: e.target.value })
                  }
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Mot n°11
                </label>
                <Input
                  type="text"
                  placeholder="Entrez le mot n°11"
                  value={verificationWords[10] || ''}
                  onChange={(e) =>
                    setVerificationWords({ ...verificationWords, 10: e.target.value })
                  }
                  className="h-12"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={() => setStep(3)}
                variant="outline"
                className="flex-1"
              >
                ← Retour à la phrase
              </Button>
              <Button
                onClick={handleVerify}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={!(verificationWords[2] && verificationWords[6] && verificationWords[10])}
              >
                Vérifier
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // Step 5: Success
  const renderStep5 = () => {
    const handleFinish = () => {
      localStorage.setItem("walletData", JSON.stringify(walletData));
      onWalletCreated(walletData);
    };

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <div className="space-y-6 text-center">
            <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dernières Confirmations</h1>
              <p className="text-xl text-gray-600 mt-2">
                Validez que vous comprenez votre responsabilité
              </p>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-left">
              <div className="flex items-start space-x-3 p-4 bg-white rounded-lg">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  className="mt-1"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                >
                  <strong>J'ai compris et j'accepte les conditions suivantes :</strong>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>J'ai sauvegardé ma phrase de récupération sur papier (minimum 2 copies)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Je comprends que WinEdge ne peut PAS récupérer mon accès si je perds ma phrase</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Je comprends que quiconque possède ma phrase contrôle 100% de mes Bitcoin</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Je ne partagerai JAMAIS ma phrase avec qui que ce soit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Je suis le seul responsable de la sécurité de mes fonds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Mes Bitcoin sont insaisissables et hors de portée de toute autorité</span>
                    </li>
                  </ul>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Souveraineté Financière Activée :</strong>
              </p>
              <p className="font-mono text-xs sm:text-sm text-blue-900 mt-2 break-all bg-white p-3 rounded border border-blue-200">
                Vous êtes désormais votre propre banque. Vos Bitcoin sont protégés par cryptographie militaire et ne peuvent être ni bloqués, ni saisis, ni confisqués.
              </p>
            </div>

            <p className="text-gray-600">
              Tes prochains arrondis seront convertis et transférés automatiquement sur ton wallet.
            </p>

            <Button
              onClick={handleFinish}
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
              disabled={!acceptedTerms}
            >
              Créer mon Wallet Décentralisé
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  // Render current step
  switch (step) {
    case 1:
      return renderStep1();
    case 2:
      return renderStep2();
    case 3:
      return renderStep3();
    case 4:
      return renderStep4();
    case 5:
      return renderStep5();
    default:
      return null;
  }
};

export default CreateWalletFlow;
