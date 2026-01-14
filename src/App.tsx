import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import StickyMenu from "./components/wallet/StickyMenu";

const queryClient = new QueryClient();

const App = () => {
  const [walletData, setWalletData] = useState<{
    address: string;
    balance?: string;
    mnemonic?: string;
  } | null>(null);

  useEffect(() => {
    // Vérifie si un wallet est déjà stocké
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet) {
      setWalletData(JSON.parse(storedWallet));
    }
  }, []);

  const handleWalletCreated = (data: {
    address: string;
    balance?: string;
    mnemonic?: string;
  }) => {
    setWalletData(data);
  };

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <StickyMenu />
        <Routes>
          <Route 
            path="/" 
            element={
              walletData ? 
                <Navigate to="/dashboard" /> : 
                <Index onWalletCreated={setWalletData} />
            } 
          />
          <Route 
            path="/login" 
            element={
              walletData ? 
                <Navigate to="/dashboard" /> : 
                <Login />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              walletData ? 
                <Dashboard walletData={walletData} /> : 
                <Navigate to="/" />
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
