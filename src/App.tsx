import { Toaster } from "@/components/ui/toaster";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();

  const [walletData, setWalletData] = useState<{
    address: string;
    balance?: string;
    isConnected: boolean;
    connectedAt: string;
    isReadOnly: boolean;
    network: "btc" | "bsc";
    mnemonic?: string;
    privateKey?: string;
  } | null>(null);

  useEffect(() => {
    // Vérifie si un wallet est déjà stocké
    const stored = localStorage.getItem("walletData");
    if (stored) {
      const parsed = JSON.parse(stored);
      setWalletData(parsed);
    }
  }, []);

  const redirectToSignupApp = () => {
    const isSignup = localStorage.getItem("signup") != null ? true : false;

    if (isSignup) {
      localStorage.removeItem("signup");
      setTimeout(() => {
        window.location.href = 'https://app.winedge.io/inscription-done?wallet_done=true';
      }, 1500);
    }
  }

  const handleWalletCreated = (data: {
    address: string;
    balance?: string;
    isConnected: boolean;
    connectedAt: string;
    isReadOnly: boolean;
    network: "btc" | "bsc";
    mnemonic?: string;
    privateKey?: string;
  }) => {
    setWalletData(data);

    // If from winedge signup, redirect back there
    redirectToSignupApp()
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
                  // <Index onWalletCreated={setWalletData} />
                  <Index onWalletCreated={handleWalletCreated} />
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
