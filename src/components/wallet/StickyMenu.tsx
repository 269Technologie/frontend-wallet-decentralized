import { Button } from "@/components/ui/button";
import { Plus, Unlock, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface StickyMenuProps {
  showOnPages?: string[];
}

const StickyMenu = ({ showOnPages = ["/dashboard", "/create", "/connect"] }: StickyMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ne pas afficher le menu si on n'est pas sur les pages spécifiées
  if (!showOnPages.includes(location.pathname)) {
    return null;
  }

  const handleCreateWallet = () => {
    navigate("/", { state: { action: "create" } });
  };

  const handleImportWallet = () => {
    navigate("/", { state: { action: "connect" } });
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40 p-4">
      <div className="flex flex-col gap-3 bg-background/80 backdrop-blur-md rounded-full p-3 border border-border/40 shadow-lg">
        {/* Créer son wallet */}
        <Button
          onClick={handleCreateWallet}
          className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition-all duration-200 tooltip-container group"
          title="Créer un wallet"
        >
          <Plus className="h-5 w-5" />
          <span className="absolute left-16 bg-gray-900 text-white text-sm rounded px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Créer son wallet
          </span>
        </Button>

        {/* Saisir son wallet */}
        <Button
          onClick={handleImportWallet}
          className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-green-600 hover:bg-green-700 transition-all duration-200 tooltip-container group"
          title="Saisir un wallet"
        >
          <Unlock className="h-5 w-5" />
          <span className="absolute left-16 bg-gray-900 text-white text-sm rounded px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Saisir son wallet
          </span>
        </Button>

        {/* Retour au dashboard */}
        <Button
          onClick={handleBackToDashboard}
          className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-purple-600 hover:bg-purple-700 transition-all duration-200 tooltip-container group"
          title="Retour au dashboard"
        >
          <Home className="h-5 w-5" />
          <span className="absolute left-16 bg-gray-900 text-white text-sm rounded px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Retour au dashboard
          </span>
        </Button>
      </div>
    </div>
  );
};

export default StickyMenu;
