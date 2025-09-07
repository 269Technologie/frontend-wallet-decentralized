import { useQuery } from '@tanstack/react-query';

export const useWalletBalance = (address: string) => {
  return useQuery({
    queryKey: ['balance', address],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/balance/${address}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du solde');
      }
      return response.json();
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });
};
