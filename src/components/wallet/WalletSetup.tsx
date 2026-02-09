import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Key, Zap, AlertTriangle, Bitcoin, LogIn } from "lucide-react";
import CreateWalletFlow from "./CreateWalletFlow";
import ConnectWalletFlow from "./ConnectWalletFlow";
import StickyMenu from "./StickyMenu";
import BitcoinAddressInput from "./BitcoinAddressInput";

const WalletSetup = ({ onWalletCreated }: { onWalletCreated: (walletData: any) => void }) => {
  const [currentView, setCurrentView] = useState<"menu" | "create" | "connect">("menu");
  const [isFetching, setIsFetching] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    setShowLoginModal(false);
    const uid = localStorage.getItem("uid");
    if (!uid) {
      setShowLoginModal(true);
    } else {
      setShowLoginModal(false);
    }
  }, []);

  // useEffect(() => {
  //   const isSignup = localStorage.getItem("signup")

  // }, []);

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
          {/* Carte Connexion (Blanche) - AVEC MODAL INTÉGRÉE */}
          <BitcoinAddressInput
            onSuccess={async (address, network) => {
              setIsFetching(true);
              let balance = "0.00000000";

              try {
                if (network === "btc") {
                  // Use mempool.space for Bitcoin balance
                  const response = await fetch(`https://mempool.space/api/address/${address}`);
                  // const response = await fetch(`https://mempool.space/api/address/34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo`);
                  if (response.ok) {
                    const data = await response.json();
                    console.log("Data inside BTC response : ", data)
                    const stats = data.chain_stats;
                    // Balance = (funded - spent) in satoshis
                    const satBalance = stats.funded_txo_sum - stats.spent_txo_sum;
                    balance = (satBalance / 100000000).toFixed(8);
                    console.log("Balance inside BTC response : ", balance)
                  }
                } else if (network === "bsc") {
                  // Use Binance Public RPC for BSC balance
                  const response = await fetch("https://bsc-dataseed.binance.org/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      jsonrpc: "2.0",
                      id: 1,
                      method: "eth_getBalance",
                      params: [address, "latest"]
                      // params: ["0x10ED43C718714eb63d5aA57B78B54704E256024E", "latest"]
                    })
                  });
                  if (response.ok) {
                    const data = await response.json();
                    console.log("Data inside BSC response : ", data)
                    if (data.result) {
                      // Result is in Wei (hex), convert to Eth/BNB equivalent (18 decimals)
                      const wei = BigInt(data.result);
                      const eth = Number(wei) / 1e18;
                      balance = eth.toFixed(8);
                      console.log("Balance inside BSC response : ", balance)
                    }
                  }
                }
              } catch (error) {
                console.error("Erreur lors de la récupération du solde initial:", error);
              }

              const walletData = {
                address: address,
                balance: balance,
                isConnected: true,
                connectedAt: new Date().toISOString(),
                network: network,
                isReadOnly: true
              };

              console.log("Data insinde wallet data *******", walletData);

              onWalletCreated(walletData);
              setIsFetching(false);
            }}
          />

          {isFetching && (
            <div className="flex justify-center items-center py-2 animate-pulse">
              <span className="text-sm text-blue-600 font-medium italic">Récupération du solde en cours...</span>
            </div>
          )}
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

      <Dialog open={showLoginModal} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-md [&>button]:hidden" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader className="flex flex-col items-center gap-4 text-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <LogIn className="h-6 w-6 text-blue-600" />
            </div>
            <DialogTitle className="text-2xl font-bold">Connexion Requise</DialogTitle>
            <DialogDescription className="text-gray-600">
              Pour sécuriser votre accès et lier votre wallet à votre compte WinEdge, vous devez d'abord vous connecter à l'application.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg rounded-xl"
              onClick={() => window.location.href = "https://app.winedge.io/login"}
            >
              Aller à la page de connexion
            </Button>
            <p className="text-xs text-center text-gray-400 mt-2">
              Une fois connecté, revenez sur cette page pour configurer votre wallet.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletSetup;