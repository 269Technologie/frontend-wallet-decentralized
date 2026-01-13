import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bitcoin, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CreateWalletFlow from "./CreateWalletFlow";
import ConnectWalletFlow from "./ConnectWalletFlow";

const WalletSetup = ({ onWalletCreated }: { onWalletCreated: (walletData: any) => void }) => {
  const [loading] = useState(false);
  const [currentView, setCurrentView] = useState<"menu" | "create" | "connect">("menu");

  // Vue création de wallet avec le nouveau flow
  if (currentView === "create") {
    return (
      <CreateWalletFlow 
        onWalletCreated={onWalletCreated}
        onCancel={() => setCurrentView("menu")}
      />
    );
  }

  // Vue connexion d'un wallet existant
  if (currentView === "connect") {
    return (
      <ConnectWalletFlow 
        onWalletConnected={onWalletCreated}
        onCancel={() => setCurrentView("menu")}
      />
    );
  }

  // Vue Menu Principal
  if (currentView === "menu") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-start p-4 pt-12">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-6">
            <Bitcoin className="h-20 w-20 text-blue-600 mx-auto" />
            
            <h1 className="text-4xl font-bold text-gray-900">
              Création & Récupération
            </h1>
            
            <p className="text-xl text-gray-600">
              Saisissez un portefeuille ou créez un portefeuille décentralisé
            </p>

            <div className="space-y-4 pt-4">
              <Button
                onClick={() => setCurrentView("create")}
                disabled={loading}
                className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Créer un portefeuille
              </Button>

              <Button
                onClick={() => setCurrentView("connect")}
                variant="outline"
                className="w-full h-14 text-lg font-medium border-2 border-gray-300 hover:bg-gray-100 hover:text-black"
                size="lg"
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Saisir un portefeuille
              </Button>
            </div>
          </div>

          <div className="pt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              FAQ – Wallet Décentralisé WinEdge
            </h2>
            
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="item-1" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium text-gray-900">1. C'est quoi un wallet décentralisé ?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 space-y-3 pt-2">
                  <p>Un wallet décentralisé (aussi appelé portefeuille non-custodial) est un coffre-fort numérique dont vous êtes l'unique propriétaire.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Vous seul détenez les clés privées.</li>
                    <li>Personne d'autre — ni WinEdge, ni un partenaire, ni une banque — n'a accès à vos cryptomonnaies.</li>
                    <li>Les fonds sont stockés directement sur la blockchain, et non dans les serveurs d'une entreprise.</li>
                  </ul>
                  <p className="font-medium">👉 En résumé : Votre wallet = votre propriété. À 100 %.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium text-gray-900">2. Pourquoi dit-on que c'est 100% sécurisé ?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 space-y-3 pt-2">
                  <p>Parce que la sécurité dépend uniquement de la clé privée, jamais d'un serveur centralisé.</p>
                  <p className="font-medium">✔ Sécurité niveau militaire</p>
                  <p>Votre portefeuille repose sur :</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>une phrase secrète de 12 mots (seed),</li>
                    <li>un système cryptographique utilisé par les banques, les gouvernements et Bitcoin lui-même.</li>
                  </ul>
                  <p className="font-medium">✔ Même en cas :</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>de panne serveur,</li>
                    <li>de coupure réseau,</li>
                    <li>de piratage mondial,</li>
                    <li>de faillite d'une société,</li>
                  </ul>
                  <p>➡ Vos cryptos restent intactes et accessibles, car elles sont stockées sur la blockchain, pas chez WinEdge.</p>
                  <p className="font-medium">✔ Aucun point de défaillance</p>
                  <p>WinEdge ne stocke pas : vos clés privées, vos seeds, vos mots de passe crypto.</p>
                  <p>Donc, WinEdge ne peut pas être piraté pour voler vos fonds — car nous n'avons tout simplement pas vos fonds.</p>
                  <p className="font-medium">👉 Résultat : 100 % sécurisé, 0 % risque de confiscation.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium text-gray-900">3. Pourquoi dit-on que c'est 100% autonome ?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 space-y-3 pt-2">
                  <p>Parce que vous gardez le contrôle total, en toutes circonstances.</p>
                  <p>Même si :</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>vous changez de téléphone,</li>
                    <li>vous supprimez l'application,</li>
                    <li>WinEdge s'arrête,</li>
                    <li>ou vous partez vivre sur une île 🏝</li>
                  </ul>
                  <p>➡ Vous pouvez retrouver vos Bitcoin en 30 secondes grâce à votre phrase de récupération.</p>
                  <p>Votre épargne ne dépend d'aucune entreprise, d'aucune banque, d'aucune application.</p>
                  <p className="font-medium">👉 Autonomie totale. Indépendance financière réelle.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium text-gray-900">4. WinEdge a-t-il accès à mes Bitcoins ?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 space-y-3 pt-2">
                  <p className="font-medium">Non. Jamais.</p>
                  <p>WinEdge peut uniquement :</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>afficher votre solde,</li>
                    <li>envoyer les BTC que vous avez achetés,</li>
                    <li>créditer votre wallet.</li>
                  </ul>
                  <p>Mais WinEdge ne peut ni déplacer vos BTC, ni les vendre, ni les bloquer.</p>
                  <p>C'est l'opposé d'un système bancaire classique.</p>
                  <p className="font-medium">👉 Philosophie : « Not your keys, not your coins »<br/>Avec WinEdge : vos clés = vos pièces.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium text-gray-900">5. Pourquoi WinEdge n'a pas besoin de l'agrément AMF ?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 space-y-3 pt-2">
                  <p>L'agrément AMF est obligatoire uniquement pour les entreprises qui détiennent les cryptomonnaies des clients (on appelle cela de la "custody").</p>
                  <p>Or, WinEdge ne détient aucune crypto de ses utilisateurs.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Nous n'avons pas leurs clés.</li>
                    <li>Nous n'avons pas leurs fonds.</li>
                    <li>Nous ne contrôlons rien.</li>
                  </ul>
                  <p>Nous sommes un outil, pas un dépositaire.</p>
                  <p className="font-medium">✔ Décentralisation = exemption réglementaire</p>
                  <p>Le cadre européen MiCA et le droit français (PSAN) prévoient clairement que : Si une société ne possède pas les fonds crypto des utilisateurs, elle n'a pas besoin d'agrément AMF.</p>
                  <p>C'est exactement le fonctionnement de WinEdge.</p>
                  <p className="font-medium">✔ Sécurité supérieure à un système centralisé</p>
                  <p>Ironiquement, certaines plateformes agréées (comme FTX) ont : gelé les retraits, détourné les fonds, entraîné des pertes massives. Parce qu'elles possédaient les cryptos des clients.</p>
                  <p>Avec WinEdge : votre wallet = votre propriété, vos cryptos = 100 % entre vos mains.</p>
                  <p className="font-medium">👉 La sécurité ne vient pas d'un papier AMF. La sécurité vient de la décentralisation.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium text-gray-900">6. Que se passe-t-il si WinEdge disparaît ?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 space-y-3 pt-2">
                  <p className="font-medium">Rien.</p>
                  <p>Vous gardez :</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>vos Bitcoins,</li>
                    <li>vos WIT,</li>
                    <li>votre wallet décentralisé,</li>
                    <li>votre autonomie.</li>
                  </ul>
                  <p>Vous pouvez :</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>restaurer votre wallet sur n'importe quelle autre application,</li>
                    <li>continuer à utiliser vos fonds normalement.</li>
                  </ul>
                  <p className="font-medium">👉 Votre épargne ne dépend d'aucune société, seulement de la blockchain.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium text-gray-900">7. Que se passe-t-il si je perds ma phrase secrète ?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 space-y-3 pt-2">
                  <p className="font-medium">Personne ne peut la récupérer.</p>
                  <p>Elle est votre seul accès à vos cryptos.</p>
                  <p>Gardez-la dans un endroit :</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>sûr</li>
                    <li>hors ligne</li>
                    <li>inaccessible aux autres</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium text-gray-900">8. Pourquoi WinEdge a choisi ce modèle ?</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 space-y-3 pt-2">
                  <p>Pour garantir :</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>la sécurité absolue,</li>
                    <li>l'indépendance totale,</li>
                    <li>la propriété réelle des utilisateurs,</li>
                    <li>et respecter l'esprit originel de la crypto.</li>
                  </ul>
                  <p>WinEdge est une fintech européenne, mais avec une philosophie claire :</p>
                  <p className="font-medium">Votre argent doit toujours rester le vôtre, même en cas d'imprévu.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default WalletSetup;