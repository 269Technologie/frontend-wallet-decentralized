import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bitcoin, ArrowUpRight, ArrowDownLeft, History, Copy, Shield } from "lucide-react"
import { useWalletBalance } from "@/hooks/useWalletBalance"
import { useBitcoinPrice } from "@/hooks/useBitcoinPrice"
import SendTransaction from "@/components/wallet/SendTransaction"
import TransactionHistory from "@/components/wallet/TransactionHistory"
import TwoFactorAuth from "@/components/wallet/TwoFactorAuth"
import PriceChart from "@/components/wallet/PriceChart"

interface DashboardProps {
  walletData: {
    address: string;
    balance?: string;
    mnemonic?: string;
    privateKey?: string;
    twoFASecret?: string;
  };
}

const Dashboard = ({ walletData }: DashboardProps) => {
  const { data: balanceData } = useWalletBalance(walletData.address);
  const { priceHistory, currentPrice, loading: priceLoading } = useBitcoinPrice();
  const [twoFASecret, setTwoFASecret] = useState<string>("");
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handle2FAGenerated = (secret: string) => {
    setTwoFASecret(secret);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Header avec effet de verre */}
      <div className="backdrop-blur-md bg-background/60 border-b border-border/40 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Bitcoin className="h-8 w-8 text-yellow-500 animate-pulse" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
                Golden Gate Vault
              </h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => {}}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="M4.93 4.93l1.41 1.41" />
                <path d="M17.66 17.66l1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="M6.34 17.66l-1.41 1.41" />
                <path d="M19.07 4.93l-1.41 1.41" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-8 space-y-6">
            {/* Carte principale avec balance */}
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-none">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-medium text-muted-foreground">Balance totale</h2>
                    <p className="text-4xl font-bold mt-2">{balanceData?.balance ?? "0.00"} BTC</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      ≈ {((parseFloat(balanceData?.balance ?? "0") * currentPrice) || 0).toLocaleString('fr-FR')} €
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-green-500 hover:bg-green-600">
                      <ArrowDownLeft className="h-4 w-4 mr-2" />
                      Recevoir
                    </Button>
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Envoyer
                    </Button>
                  </div>
                </div>

                {/* Adresse avec effet de copie */}
                <div className="p-4 rounded-lg bg-background/40 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Adresse Bitcoin</p>
                      <p className="font-mono text-sm">{walletData.address}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(walletData.address)}
                      className="hover:bg-primary/10"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Graphique du cours Bitcoin */}
            <PriceChart data={priceHistory} loading={priceLoading} />

            {/* Statistiques rapides */}
            <div className="grid sm:grid-cols-3 gap-6 mt-8 mb-12">
              <Card className="p-6 hover:bg-accent/5 transition-colors">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                  </div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Derniers 30 jours</p>
                </div>
              </Card>
              <Card className="p-6 hover:bg-accent/5 transition-colors">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-2">
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Envoyé</p>
                  </div>
                  <p className="text-2xl font-bold">0 BTC</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </Card>
              <Card className="p-6 hover:bg-accent/5 transition-colors">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-2">
                    <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Reçu</p>
                  </div>
                  <p className="text-2xl font-bold">0 BTC</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Barre latérale */}
          <div className="lg:col-span-4 space-y-6">
            {/* Sécurité 2FA */}
            <Card className="p-6 border-primary/20 bg-primary/5">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Sécurité</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Protégez votre wallet avec l'authentification à deux facteurs
                  </p>
                  <TwoFactorAuth userId={walletData.address} onSecretGenerated={handle2FAGenerated} />
                  {twoFASecret && (
                    <div className="flex items-center gap-2 text-sm text-green-500">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      2FA activé et configuré
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Formulaire d'envoi */}
        <SendTransaction 
          walletAddress={walletData.address}
          privateKey={walletData.privateKey || ''}
          twoFASecret={walletData.twoFASecret}
        />
      </div>

      {/* Historique des transactions */}
      <TransactionHistory address={walletData.address} />

      {/* Section de sécurité - Visible uniquement si mnemonic est présent */}
      {walletData.mnemonic && (
        <Card className="p-6 border-2 border-orange-500 bg-orange-100 dark:bg-orange-900">
          <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-100 mb-4">
            ⚠️ Important : Sauvegardez votre phrase de récupération
          </h2>
          <p className="text-orange-700 dark:text-orange-200 mb-4 font-medium">
            Notez ces mots dans l'ordre et conservez-les en lieu sûr. Cette phrase est la seule façon de restaurer votre wallet.
          </p>
          <div className="bg-orange-50 dark:bg-orange-800 p-6 rounded-lg border-2 border-orange-300 dark:border-orange-600">
            <p className="font-mono text-lg break-all text-orange-900 dark:text-orange-50">{walletData.mnemonic}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
