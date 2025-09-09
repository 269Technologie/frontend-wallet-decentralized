import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface TransactionHistoryProps {
  address: string;
}

const TransactionHistory = ({ address }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchTransactionHistory();
  }, [address]);

  const fetchTransactionHistory = async () => {
    try {
      const response = await fetch(`https://api.winedge.io/v2/transaction/history/${address}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
      // Fallback data for demo
      setTransactions([
        {
          id: "1",
          type: "received",
          amount: "0.00123456",
          usd: "$53.45",
          address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
          time: "2 hours ago",
          status: "confirmed",
        },
        {
          id: "2",
          type: "sent",
          amount: "-0.00045678",
          usd: "-$19.78",
          address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
          time: "1 day ago",
          status: "confirmed",
        },
      ]);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
        <Badge variant="secondary" className="text-xs">
          {transactions.length} transactions
        </Badge>
      </div>
      
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                tx.type === "received" 
                  ? "bg-green-500/10 text-green-500" 
                  : "bg-red-500/10 text-red-500"
              }`}>
                {tx.type === "received" ? (
                  <ArrowDownLeft className="h-4 w-4" />
                ) : (
                  <ArrowUpRight className="h-4 w-4" />
                )}
              </div>
              <div>
                <div className="font-medium text-foreground capitalize">
                  {tx.type}
                </div>
                <div className="text-sm text-muted-foreground">
                  {tx.address.slice(0, 16)}...
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`font-semibold ${
                tx.type === "received" ? "text-green-500" : "text-red-500"
              }`}>
                {tx.amount} BTC
              </div>
              <div className="text-sm text-muted-foreground">
                {tx.usd}
              </div>
              <div className="text-xs text-muted-foreground">
                {tx.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TransactionHistory;