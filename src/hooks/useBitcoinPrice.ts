import { useState, useEffect } from 'react';

interface PriceData {
  time: string;
  price: number;
}

export const useBitcoinPrice = () => {
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        // Récupérer les données historiques (7 derniers jours)
        const historicalResponse = await fetch(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=eur&days=7&interval=daily'
        );
        const historicalData = await historicalResponse.json();
        
        // Formater les données pour le graphique
        const formattedData = historicalData.prices.map(([timestamp, price]: [number, number]) => ({
          time: new Date(timestamp).toLocaleDateString(),
          price: Number(price.toFixed(2))
        }));

        setPriceHistory(formattedData);
        setCurrentPrice(formattedData[formattedData.length - 1].price);
      } catch (error) {
        console.error('Erreur lors de la récupération du prix du Bitcoin:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBitcoinPrice();
    // Mettre à jour toutes les 5 minutes
    const interval = setInterval(fetchBitcoinPrice, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { priceHistory, currentPrice, loading };
};
