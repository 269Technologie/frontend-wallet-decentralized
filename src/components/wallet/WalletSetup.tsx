import { useState } from "react";
import { Key, Zap, AlertTriangle, Bitcoin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CreateWalletFlow from "./CreateWalletFlow";
import ConnectWalletFlow from "./ConnectWalletFlow";
import StickyMenu from "./StickyMenu";

const WalletSetup = ({ onWalletCreated }: { onWalletCreated: (walletData: any) => void }) => {
  const [currentView, setCurrentView] = useState<"menu" | "create" | "connect">("menu");

  // --- LOGIQUE DE NAVIGATION ---
  if (currentView === "create") {
    return (
      <CreateWalletFlow 
        onWalletCreated={onWalletCreated}
        onCancel={() => setCurrentView("menu")}
      />
    );
  }

  if (currentView === "connect") {
    return (
      <ConnectWalletFlow 
        onWalletConnected={onWalletCreated}
        onCancel={() => setCurrentView("menu")}
      />
    );
  }

  // --- VUE MENU PRINCIPAL (DESIGN IMAGE) ---
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-4 pt-12">
      <div className="w-full max-w-2xl space-y-10">
        <StickyMenu />

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Votre Wallet Bitcoin
          </h1>
          <p className="text-slate-500 font-medium">
            Sécurité maximale • Contrôle total • Liberté financière
          </p>
        </div>

        {/* Grille de sélection */}
        <div className="space-y-4">
          {/* Carte Création (Bleue) */}
          <button
            onClick={() => setCurrentView("create")}
            className="w-full bg-[#2563EB] hover:bg-blue-700 text-white rounded-2xl p-6 flex justify-between items-center transition-all shadow-lg shadow-blue-100 group"
          >
            <div className="text-left">
              <h3 className="text-xl font-semibold">Créer un nouveau wallet</h3>
              <p className="text-blue-100 text-sm mt-1">Recommandé pour les nouveaux utilisateurs</p>
            </div>
            <Key className="h-7 w-7 opacity-80 group-hover:scale-110 transition-transform" />
          </button>

          {/* Carte Connexion (Blanche) */}
          <button
            onClick={() => setCurrentView("connect")}
            className="w-full bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-900 rounded-2xl p-6 flex justify-between items-center transition-all group"
          >
            <div className="text-left">
              <h3 className="text-xl font-semibold">Connecter une adresse Bitcoin existante</h3>
              <p className="text-slate-500 text-sm mt-1">Vous avez déjà un wallet Bitcoin</p>
            </div>
            <Zap className="h-7 w-7 text-slate-400 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Bloc d'avertissement jaune */}
        <div className="bg-[#FFFBEB] border-l-4 border-[#FBBF24] p-5 rounded-r-xl flex gap-4">
          <AlertTriangle className="h-6 w-6 text-[#D97706] shrink-0" />
          <div className="space-y-1">
            <h4 className="font-bold text-[#92400E]">Important à savoir</h4>
            <p className="text-[#B45309] text-sm leading-relaxed">
              WinEdge ne stocke <span className="font-bold underline">JAMAIS</span> vos clés privées. 
              Vous êtes le seul propriétaire de vos Bitcoin.
            </p>
          </div>
        </div>

        {/* --- SECTION FAQ --- */}
        <div className="pt-12 border-t border-slate-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            FAQ – Wallet Décentralisé WinEdge
          </h2>
          
          <Accordion type="single" collapsible className="w-full space-y-3">
            <AccordionItem value="item-1" className="border rounded-xl px-4 bg-white shadow-sm">
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="font-semibold text-gray-900 text-lg">1. C'est quoi un wallet décentralisé ?</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 space-y-3 pt-2 pb-5">
                <p>Un wallet décentralisé (aussi appelé portefeuille non-custodial) est un coffre-fort numérique dont vous êtes l'unique propriétaire.</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Vous seul détenez les clés privées.</li>
                  <li>Personne d'autre n'a accès à vos cryptomonnaies.</li>
                  <li>Les fonds sont stockés sur la blockchain.</li>
                </ul>
                <p className="font-bold text-blue-600">👉 En résumé : Votre wallet = votre propriété. À 100 %.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-xl px-4 bg-white shadow-sm">
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="font-semibold text-gray-900 text-lg">2. Pourquoi dit-on que c'est 100% sécurisé ?</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 space-y-3 pt-2 pb-5 text-sm leading-relaxed">
                <p>Parce que la sécurité dépend uniquement de la clé privée, jamais d'un serveur centralisé.</p>
                <p className="font-medium">✔ Sécurité niveau militaire</p>
                <p>Votre Wallet repose sur une phrase secrète de 12 mots (seed).</p>
                <p>Même en cas de panne serveur ou de faillite d'une société, vos cryptos restent intactes.</p>
                <p className="font-bold">👉 Résultat : 100 % sécurisé, 0 % risque de confiscation.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-xl px-4 bg-white shadow-sm">
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="font-semibold text-gray-900 text-lg">3. Pourquoi dit-on que c'est 100% autonome ?</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 space-y-3 pt-2 pb-5 text-sm">
                <p>Même si WinEdge s'arrête ou si vous supprimez l'application, vous retrouvez vos Bitcoin grâce à votre phrase de récupération.</p>
                <p className="font-bold text-blue-600">👉 Autonomie totale. Indépendance financière réelle.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-xl px-4 bg-white shadow-sm">
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="font-semibold text-gray-900 text-lg">4. WinEdge a-t-il accès à mes Bitcoins ?</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 space-y-3 pt-2 pb-5 text-sm">
                <p className="font-bold">Non. Jamais.</p>
                <p>WinEdge peut afficher votre solde, mais ne peut ni déplacer vos BTC, ni les vendre, ni les bloquer.</p>
                <p className="italic font-medium text-slate-500">« Not your keys, not your coins »</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-xl px-4 bg-white shadow-sm">
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="font-semibold text-gray-900 text-lg">5. Pourquoi WinEdge n'a pas besoin de l'agrément AMF ?</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 space-y-3 pt-2 pb-5 text-sm leading-relaxed">
                <p>L'agrément AMF est obligatoire pour les entreprises qui détiennent les cryptomonnaies des clients.</p>
                <p>WinEdge ne possède pas vos fonds. Nous sommes un outil, pas un dépositaire. Le cadre européen MiCA confirme que si une société ne possède pas les fonds, elle n'a pas besoin d'agrément.</p>
                <p className="font-bold">👉 La sécurité vient de la décentralisation, pas d'un papier.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-xl px-4 bg-white shadow-sm">
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="font-semibold text-gray-900 text-lg">6. Que se passe-t-il si WinEdge disparaît ?</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 space-y-3 pt-2 pb-5 text-sm">
                <p className="font-bold">Rien.</p>
                <p>Vous restaurez votre wallet sur n'importe quelle autre application (Electrum, BlueWallet, etc.) et continuez à utiliser vos fonds normalement.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-xl px-4 bg-white shadow-sm">
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="font-semibold text-gray-900 text-lg">7. Que se passe-t-il si je perds ma phrase secrète ?</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 space-y-3 pt-2 pb-5 text-sm">
                <p className="font-bold text-red-600">Personne ne peut la récupérer.</p>
                <p>Gardez-la hors ligne, dans un endroit sûr et inaccessible aux autres.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border rounded-xl px-4 bg-white shadow-sm">
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="font-semibold text-gray-900 text-lg">8. Pourquoi WinEdge a choisi ce modèle ?</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 space-y-3 pt-2 pb-5 text-sm leading-relaxed">
                <p>Pour garantir la propriété réelle et respecter l'esprit originel de la crypto.</p>
                <p className="font-bold">Votre argent doit toujours rester le vôtre.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default WalletSetup;