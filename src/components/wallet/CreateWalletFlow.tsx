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
            <h1 className="text-3xl font-bold text-gray-900">Création de votre wallet sécurisé</h1>
            <p className="text-gray-600 mt-2">Lisez attentivement les consignes de sécurité</p>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-900 text-lg">⚠️ AVERTISSEMENT CRITIQUE</h3>
                <p className="text-red-800 mt-2">
                  Vous allez créer un wallet décentralisé. Cela signifie que :
                </p>
              </div>
            </div>

            <ul className="space-y-3 ml-9">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span className="text-red-900">
                  <strong>VOUS seul détenez les clés</strong> de votre wallet
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span className="text-red-900">
                  <strong>WinEdge ne peut PAS récupérer</strong> votre accès si vous perdez votre phrase secrète
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span className="text-red-900">
                  <strong>Personne ne peut vous aider</strong> si vous perdez cette phrase (même pas le support)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span className="text-red-900">
                  <strong>Sans cette phrase, vos Bitcoin sont PERDUS À JAMAIS</strong>
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-3">
            <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Règles de sécurité essentielles
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-blue-900">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Vous devrez noter votre phrase de récupération de <strong>12 mots</strong> sur papier</span>
              </li>
              <li className="flex items-start gap-2 text-blue-900">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Conservez cette phrase dans un lieu <strong>sûr et hors ligne</strong></span>
              </li>
              <li className="flex items-start gap-2 text-blue-900">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Ne la partagez JAMAIS</strong> avec qui que ce soit</span>
              </li>
              <li className="flex items-start gap-2 text-blue-900">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Ne la stockez JAMAIS</strong> numériquement (pas de photo, pas de fichier)</span>
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
              Générer mon wallet
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
            <h2 className="text-2xl font-bold text-gray-900">Génération de votre wallet sécurisé...</h2>
            <p className="text-gray-600">
              Création de vos clés cryptographiques de niveau militaire.<br />
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
              <h1 className="text-3xl font-bold text-gray-900">⚠️ ÉTAPE CRITIQUE</h1>
              <p className="text-xl text-red-600 font-semibold mt-2">
                Sauvegardez votre phrase de récupération
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
              <h3 className="font-bold text-red-900 text-lg mb-3">🚨 CE QUE VOUS DEVEZ FAIRE ABSOLUMENT :</h3>
              <ol className="space-y-2 list-decimal list-inside text-red-900">
                <li><strong>ÉCRIVEZ</strong> ces 12 mots sur PAPIER (dans l'ordre exact)</li>
                <li><strong>ÉCRIVEZ-les en DOUBLE</strong> (2 copies papier minimum)</li>
                <li><strong>CONSERVEZ</strong> ces papiers dans des lieux DIFFÉRENTS et SÛRS :
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li>Coffre-fort personnel</li>
                    <li>Coffre bancaire</li>
                    <li>Chez un proche de confiance</li>
                  </ul>
                </li>
              </ol>
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
                  <span className="text-red-500">❌</span>
                  <span>JAMAIS de capture d'écran</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  <span>JAMAIS sur téléphone (ni dans Notes, ni dans Photos, ni dans Cloud)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  <span>JAMAIS sur ordinateur (ni dans Word, ni dans fichier texte)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  <span>JAMAIS par email ou messagerie</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  <span>JAMAIS partager avec QUICONQUE (même pas WinEdge !)</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 text-lg mb-2">💡 POURQUOI C'EST SI IMPORTANT ?</h3>
              <ul className="space-y-2 text-blue-900">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Si vous perdez l'accès à votre compte WinEdge, cette phrase est le SEUL moyen de récupérer vos Bitcoin</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Sans cette phrase, vos Bitcoin sont PERDUS À JAMAIS</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Avec cette phrase, vous pouvez récupérer votre wallet sur n'importe quelle autre plateforme compatible</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => setStep(4)}
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
            >
              J'ai sauvegardé ma phrase en sécurité → Vérifier
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
              <h1 className="text-3xl font-bold text-gray-900">Vérification de votre phrase</h1>
              <p className="text-gray-600 mt-2">
                Pour confirmer que vous avez bien noté votre phrase, entrez les mots demandés
              </p>
            </div>

            <div className="space-y-4">
              {requiredIndices.map((idx) => (
                <div key={idx} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mot n°{idx + 1}
                  </label>
                  <Input
                    type="text"
                    placeholder={`Entrez le mot n°${idx + 1}`}
                    value={verificationWords[idx] || ''}
                    onChange={(e) =>
                      setVerificationWords({ ...verificationWords, [idx]: e.target.value })
                    }
                    className="h-12"
                  />
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900">
                <strong>💡 Conseil :</strong> Vérifiez l'orthographe et l'ordre exact des mots sur votre sauvegarde papier.
              </p>
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
                disabled={requiredIndices.some(idx => !verificationWords[idx]?.trim())}
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
              <h1 className="text-3xl font-bold text-gray-900">🎉 Félicitations !</h1>
              <p className="text-xl text-gray-600 mt-2">
                Votre wallet Bitcoin décentralisé est créé et sécurisé
              </p>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-left">
              <h3 className="font-bold text-green-900 text-lg mb-3">✅ Ton wallet est opérationnel</h3>
              <p className="text-green-900 mb-3">Tu peux maintenant :</p>
              <ul className="space-y-2 text-green-900">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Voir ton adresse de réception Bitcoin</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Consulter ton solde en temps réel</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Recevoir tes Bitcoin automatiquement chaque lundi</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>📍 Adresse de ton wallet :</strong>
              </p>
              <p className="font-mono text-xs sm:text-sm text-blue-900 mt-2 break-all bg-white p-3 rounded border border-blue-200">
                {walletData?.address}
              </p>
            </div>

            <p className="text-gray-600">
              Tes prochains arrondis seront convertis et transférés automatiquement sur ton wallet.
            </p>

            <Button
              onClick={handleFinish}
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
            >
              Accéder à mon wallet
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
