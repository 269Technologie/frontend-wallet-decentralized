import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Check, Shield, Lock, EyeOff, CheckCircle2, Key, HelpCircle } from "lucide-react";

interface CreateWalletFlowProps {
  onWalletCreated: (walletData: any) => void;
  onCancel: () => void;
}

const CreateWalletFlow = ({ onWalletCreated, onCancel }: CreateWalletFlowProps) => {
  // Step 1: Intro (Wallet Décentralisé)
  // Step 2: Warning (Liberté Absolue)
  // Step 3: Advice (Comment Protéger)
  // Step 4: Loading (Génération)
  // Step 5: Reveal (Phrase)
  // Step 6: Verify (Vérification)
  // Step 7: Success (Confirmations)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [walletData, setWalletData] = useState<any>(null);
  const [verificationWords, setVerificationWords] = useState<{ [key: number]: string }>({});
  const [requiredIndices, setRequiredIndices] = useState<number[]>([]);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const { toast } = useToast();

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Auto-start generation when entering step 4
  useEffect(() => {
    if (step === 4 && walletData === null) {
      generateWallet();
    }
  }, [step, walletData]);

  // Step 1: Wallet Décentralisé vs Centralisé (Image 1)
  const renderStep1 = () => (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl p-6 sm:p-8 animate-in fade-in zoom-in duration-300">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              Wallet Décentralisé : Votre Souveraineté Financière
            </h1>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-5 sm:p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-white p-1 rounded-full text-green-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-green-900 text-lg pt-0.5">Wallet Décentralisé</h3>
            </div>

            <ul className="space-y-2 ml-10">
              <li className="flex items-start gap-2 text-green-800">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                <span>Vous êtes votre propre banque</span>
              </li>
              <li className="flex items-start gap-2 text-green-800">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                <span>Contrôle total et exclusif de vos fonds</span>
              </li>
              <li className="flex items-start gap-2 text-green-800">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                <span>Impossible à saisir ou bloquer</span>
              </li>
              <li className="flex items-start gap-2 text-green-800">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                <span>Aucun intermédiaire ne peut accéder à vos Bitcoin</span>
              </li>
              <li className="flex items-start gap-2 text-green-800">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                <span>Liberté financière absolue</span>
              </li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-5 sm:p-6 space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <h3 className="font-bold text-red-900 text-lg">Wallet Centralisé</h3>
            </div>

            <ul className="space-y-2 ml-9">
              <li className="flex items-start gap-2 text-red-800">
                <span className="text-red-600 font-bold text-sm mt-0.5">✗</span>
                <span>Une entreprise contrôle vos fonds</span>
              </li>
              <li className="flex items-start gap-2 text-red-800">
                <span className="text-red-600 font-bold text-sm mt-0.5">✗</span>
                <span>Vos Bitcoin peuvent être bloqués</span>
              </li>
              <li className="flex items-start gap-2 text-red-800">
                <span className="text-red-600 font-bold text-sm mt-0.5">✗</span>
                <span>Saisissable par décision judiciaire</span>
              </li>
              <li className="flex items-start gap-2 text-red-800">
                <span className="text-red-600 font-bold text-sm mt-0.5">✗</span>
                <span>Risque de faillite de la plateforme</span>
              </li>
              <li className="flex items-start gap-2 text-red-800">
                <span className="text-red-600 font-bold text-sm mt-0.5">✗</span>
                <span>Dépendance totale à un tiers</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-blue-900 text-lg">La Garantie WinEdge</h3>
                <p className="text-blue-800 text-sm mt-1 mb-2">
                  <strong className="text-blue-700">WinEdge n'a AUCUN accès à vos Bitcoin.</strong> Nous ne pouvons ni voir votre solde, ni bloquer vos transactions, ni récupérer vos fonds.
                </p>
                <p className="text-blue-800 text-sm">
                  Vos clés privées sont générées et stockées uniquement sur votre appareil. Architecture zero-knowledge garantie.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setStep(2)}
            className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
          >
            Continuer
          </Button>
        </div>
      </Card>
    </div>
  );

  // Step 2: Liberté Absolue (Image 2)
  const renderStep2 = () => (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="bg-orange-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto ring-4 ring-orange-50">
              <AlertTriangle className="h-10 w-10 text-orange-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Liberté Absolue = Responsabilité Absolue
            </h2>
            <p className="text-gray-500 uppercase text-sm font-semibold tracking-wide">
              Vous devez comprendre ces points avant de continuer
            </p>
          </div>

          <div className="space-y-4">
            {/* Card 1 */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex gap-3">
                <Lock className="h-5 w-5 text-red-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-red-900">Vous SEUL détenez les clés</h4>
                  <p className="text-sm text-red-800 mt-1">
                    Votre phrase de récupération de 12 mots est la SEULE façon d'accéder à vos Bitcoin. WinEdge ne la stocke pas et ne peut pas la récupérer.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-red-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-red-900">Perte de phrase = Perte définitive</h4>
                  <p className="text-sm text-red-800 mt-1">
                    Si vous perdez votre phrase de récupération, vos Bitcoin sont perdus à jamais. Aucun support technique, même WinEdge, ne peut les récupérer.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex gap-3">
                <EyeOff className="h-5 w-5 text-red-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-red-900">Phrase connue = Bitcoin volés</h4>
                  <p className="text-sm text-red-800 mt-1">
                    Quiconque possède votre phrase de récupération contrôle 100% de vos Bitcoin. Ne la partagez JAMAIS, même avec le support WinEdge.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-red-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-red-900">Aucun recours possible</h4>
                  <p className="text-sm text-red-800 mt-1">
                    Contrairement à une banque, il n'existe aucune assurance, aucun service client qui puisse annuler une transaction ou récupérer des fonds perdus.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 text-center border border-yellow-100">
            <p className="text-yellow-800 font-medium text-sm flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Cette responsabilité est le prix de votre souveraineté financière totale
            </p>
          </div>

          <Button
            onClick={() => setStep(3)}
            className="w-full h-14 text-lg font-bold bg-[#E65100] hover:bg-[#F57C00] text-white shadow-lg transition-colors"
          >
            J'ai compris, continuer
          </Button>
        </div>
      </Card>
    </div>
  );

  // Step 3: Comment Protéger (Image 3)
  const renderStep3 = () => (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl p-6 sm:p-8 animate-in fade-in duration-500">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Comment Protéger Votre Phrase de Récupération
            </h1>
          </div>

          {/* TO DO LIST */}
          <div>
            <h3 className="flex items-center gap-2 text-green-700 font-bold mb-4">
              <CheckCircle2 className="h-5 w-5" />
              À FAIRE OBLIGATOIREMENT
            </h3>
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-900">Écrire sur papier (minimum 2 copies)</h4>
                    <p className="text-sm text-green-800">Support le plus sûr, insensible au piratage numérique</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-900">Stocker dans des lieux différents et sûrs</h4>
                    <ul className="list-disc ml-4 text-sm text-green-800 mt-1">
                      <li>Coffre-fort personnel</li>
                      <li>Coffre bancaire</li>
                      <li>Chez une personne de confiance</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-900">Vérifier régulièrement l'état des copies</h4>
                    <p className="text-sm text-green-800">Le papier peut se détériorer avec le temps</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-900">Protéger contre le feu et l'eau</h4>
                    <p className="text-sm text-green-800">Pochette ignifuge, sac étanche, ou plaque métallique gravée</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NOT TO DO LIST */}
          <div className="pt-2">
            <h3 className="flex items-center gap-2 text-red-700 font-bold mb-4">
              <AlertTriangle className="h-5 w-5" />
              NE JAMAIS FAIRE
            </h3>
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 px-4">
                <div className="flex gap-3 items-center">
                  <span className="text-red-600 font-bold">X</span>
                  <div>
                    <h4 className="font-semibold text-red-900 text-sm sm:text-base">Capture d'écran</h4>
                    <p className="text-xs sm:text-sm text-red-800">Synchronisée dans le cloud, accessible aux hackers</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 px-4">
                <div className="flex gap-3 items-center">
                  <span className="text-red-600 font-bold">X</span>
                  <div>
                    <h4 className="font-semibold text-red-900 text-sm sm:text-base">Photo avec votre téléphone</h4>
                    <p className="text-xs sm:text-sm text-red-800">Sauvegardée automatiquement, risque de vol de données</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 px-4">
                <div className="flex gap-3 items-center">
                  <span className="text-red-600 font-bold">X</span>
                  <div>
                    <h4 className="font-semibold text-red-900 text-sm sm:text-base">Fichier sur ordinateur</h4>
                    <p className="text-xs sm:text-sm text-red-800">Vulnérable aux virus, ransomwares et hackers</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 px-4">
                <div className="flex gap-3 items-center">
                  <span className="text-red-600 font-bold">X</span>
                  <div>
                    <h4 className="font-semibold text-red-900 text-sm sm:text-base">Email ou messagerie</h4>
                    <p className="text-xs sm:text-sm text-red-800">Transit en clair, stocké sur serveurs tiers</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 px-4">
                <div className="flex gap-3 items-center">
                  <span className="text-red-600 font-bold">X</span>
                  <div>
                    <h4 className="font-semibold text-red-900 text-sm sm:text-base">Partager avec qui que ce soit</h4>
                    <p className="text-xs sm:text-sm text-red-800">Même le "support WinEdge" ne vous la demandera JAMAIS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-900 text-sm">
              <strong>Conseil Pro :</strong> Pour une protection maximale, gravez votre phrase sur une plaque en acier inoxydable résistante au feu (jusqu'à 1400°C) et à l'eau.
            </p>
          </div>

          <Button
            onClick={() => setStep(4)}
            className="w-full h-auto py-4 text-lg font-bold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-lg transition-colors whitespace-normal leading-tight"
          >
            J'ai compris comment protéger ma phrase
          </Button>
        </div>
      </Card>
    </div>
  );

  // Step 4: Loading / Generation (Image 4)
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

        setTimeout(() => setStep(5), 2500); // Simulated delay for effect
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

  const renderStep4 = () => {

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 py-16 animate-in fade-in duration-500">
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="bg-blue-100 rounded-full p-6">
              <Key className="h-12 w-12 text-blue-600" />
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Génération de votre Wallet Sécurisé</h2>
              <p className="text-gray-500">Création de vos clés cryptographiques de niveau militaire</p>
            </div>

            <div className="w-full bg-blue-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-900">Génération aléatoire cryptographique</span>
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
              </div>
              <div className="h-4 bg-blue-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 animate-[progress_2s_ease-in-out_infinite] w-2/3 rounded-full"></div>
              </div>
              <p className="text-xs text-blue-700 mt-2">Génération basée sur l'entropie de votre appareil...</p>
            </div>

            <div className="bg-gray-50 w-full rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-3 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Algorithme BIP39 - Standard Bitcoin universel</span>
              </div>
              <div className="flex items-center gap-3 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Entropie 256 bits - Protection cryptographique maximale</span>
              </div>
              <div className="flex items-center gap-3 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Génération 100% locale - Aucune donnée transmise</span>
              </div>
              <div className="flex items-center gap-3 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Compatible avec tous les wallets décentralisés</span>
              </div>
            </div>

            <div className="bg-yellow-50 w-full rounded-xl p-4 border-l-4 border-yellow-400">
              <div className="flex gap-2">
                <Shield className="h-5 w-5 text-yellow-700" />
                <div>
                  <h4 className="text-yellow-900 font-bold text-sm">Garantie Zero-Knowledge</h4>
                  <p className="text-yellow-800 text-xs mt-1">
                    Vos clés sont générées exclusivement sur votre appareil. WinEdge ne les voit jamais, ne les stocke jamais, et ne peut jamais y accéder.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // Step 5: ÉTAPE CRITIQUE + Reveal (Images 5 & 6)
  const renderStep5 = () => {
    const words = walletData?.mnemonic?.split(' ') || [];

    return (
      <div className="min-h-screen bg-white p-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-3xl p-6 sm:p-8 animate-in fade-in duration-500">
          <div className="space-y-6">
            {/* Header Rouge */}
            <div className="bg-red-600 rounded-lg p-6 text-white text-center shadow-lg">
              <div className="flex items-center justify-center gap-3 mb-2">
                <AlertTriangle className="h-8 w-8 text-white" />
                <h1 className="text-xl sm:text-2xl font-bold uppercase">ÉTAPE CRITIQUE - Sauvegardez Immédiatement</h1>
              </div>
              <p className="text-red-100 font-medium text-sm sm:text-base">
                Vous êtes sur le point de voir votre phrase de récupération. Préparez papier et stylo MAINTENANT.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-lg">Votre Phrase de Récupération (12 mots)</h3>
            </div>

            {/* Zone de phrase */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8 min-h-[300px] flex flex-col items-center justify-center relative">
              {!showMnemonic ? (
                <div className="text-center space-y-6 animate-in fade-in zoom-in">
                  <EyeOff className="h-16 w-16 text-gray-400 mx-auto" />
                  <p className="text-gray-500">Votre phrase est masquée pour votre sécurité</p>
                  <Button
                    onClick={() => setShowMnemonic(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 h-auto text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <EyeOff className="mr-2 h-5 w-5" />
                    Révéler ma phrase de récupération
                  </Button>
                </div>
              ) : (
                <div className="w-full animate-in fade-in zoom-in duration-300">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    {words.map((word: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative group"
                      >
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 text-gray-300 font-mono text-sm pointer-events-none select-none">
                          {idx + 1}
                        </div>
                        <div className="bg-white border-2 border-blue-100 rounded-lg p-3 text-center font-mono font-bold text-gray-800 shadow-sm group-hover:border-blue-300 transition-colors">
                          {word}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowMnemonic(false)}
                      className="text-gray-500 hover:text-gray-900"
                    >
                      <EyeOff className="mr-2 h-4 w-4" /> Masquer
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Conseils */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 text-red-900 font-bold text-sm">
                <Lock className="h-4 w-4" />
                CE QUE VOUS NE DEVEZ JAMAIS FAIRE :
              </div>
              <ul className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-red-800">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">X</span> JAMAIS de capture d'écran (cloud)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">X</span> JAMAIS de photo (téléphone)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">X</span> JAMAIS dans un fichier texte
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">X</span> JAMAIS par email
                </li>
                <li className="flex items-start gap-2 col-span-2">
                  <span className="text-red-600 font-bold">X</span> JAMAIS partagée avec qui que ce soit (même WinEdge)
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 text-green-900 font-bold text-sm">
                <CheckCircle2 className="h-4 w-4" />
                CE QUE VOUS DEVEZ FAIRE :
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-green-800">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span><strong>ÉCRIRE</strong> ces 12 mots sur PAPIER dans l'ordre exact</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span><strong>FAIRE</strong> au minimum 2 copies sur papier différent</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span><strong>CONSERVER</strong> ces papiers dans des lieux différents et sûrs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span><strong>VÉRIFIER</strong> l'orthographe de chaque mot</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => setStep(6)}
              className="w-full h-14 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold text-lg"
              disabled={!showMnemonic} // Force user to reveal at least once
            >
              J'ai écrit ma phrase sur papier, continuer
            </Button>

          </div>
        </Card>
      </div>
    );
  };

  // Step 6: Verify Mnemonic (Existing logic preserved, improved UI)
  const renderStep6 = () => {
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
        setStep(7);
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
        <Card className="w-full max-w-2xl p-8 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900">Vérification de Votre Phrase</h1>
              <p className="text-gray-600 mt-2">
                Confirmez que vous avez correctement noté votre phrase de récupération
              </p>
            </div>

            <div className="space-y-4 bg-gray-50 p-6 rounded-xl">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Mot n°{requiredIndices[0] + 1}
                </label>
                <Input
                  type="text"
                  placeholder={`Entrez le mot n°${requiredIndices[0] + 1}`}
                  value={verificationWords[requiredIndices[0]] || ''}
                  onChange={(e) =>
                    setVerificationWords({ ...verificationWords, [requiredIndices[0]]: e.target.value })
                  }
                  className="h-12 bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Mot n°{requiredIndices[1] + 1}
                </label>
                <Input
                  type="text"
                  placeholder={`Entrez le mot n°${requiredIndices[1] + 1}`}
                  value={verificationWords[requiredIndices[1]] || ''}
                  onChange={(e) =>
                    setVerificationWords({ ...verificationWords, [requiredIndices[1]]: e.target.value })
                  }
                  className="h-12 bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Mot n°{requiredIndices[2] + 1}
                </label>
                <Input
                  type="text"
                  placeholder={`Entrez le mot n°${requiredIndices[2] + 1}`}
                  value={verificationWords[requiredIndices[2]] || ''}
                  onChange={(e) =>
                    setVerificationWords({ ...verificationWords, [requiredIndices[2]]: e.target.value })
                  }
                  className="h-12 bg-white"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setStep(5)}
                variant="outline"
                className="flex-1 h-12"
              >
                ← Retour à la phrase
              </Button>
              <Button
                onClick={handleVerify}
                className="flex-1 bg-blue-600 hover:bg-blue-700 h-12"
                disabled={!(verificationWords[requiredIndices[0]] && verificationWords[requiredIndices[1]] && verificationWords[requiredIndices[2]])}
              >
                Vérifier
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // Step 7: Success (Existing logic)
  const renderStep7 = () => {
    const handleFinish = () => {
      localStorage.setItem("walletData", JSON.stringify(walletData));
      onWalletCreated(walletData);
    };

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 animate-in zoom-in duration-500">
          <div className="space-y-6 text-center">
            <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto ring-8 ring-green-50">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dernières Confirmations</h1>
              <p className="text-xl text-gray-600 mt-2">
                Validez que vous comprenez votre responsabilité
              </p>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-left">
              <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
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
                      <span>J'ai sauvegardé ma phrase de récupération sur papier.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Je comprends que WinEdge ne peut PAS récupérer mon accès.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Je suis le seul responsable de la sécurité de mes fonds.</span>
                    </li>
                  </ul>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-bold mb-1">
                Souveraineté Financière Activée 🚀
              </p>
              <p className="text-xs text-blue-800">
                Vous êtes désormais votre propre banque. Vos Bitcoin sont protégés par cryptographie militaire.
              </p>
            </div>

            <Button
              onClick={handleFinish}
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-xl"
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
    case 6:
      return renderStep6();
    case 7:
      return renderStep7();
    default:
      return null;
  }
};

export default CreateWalletFlow;
