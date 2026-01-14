import { Button } from "@/components/ui/button";
import { Plus, Unlock, Home, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StickyMenu = () => {
  const navigate = useNavigate();

  const handleCreateWallet = () => {
    navigate("/", { state: { action: "create" } });
  };

  const handleImportWallet = () => {
    navigate("/", { state: { action: "connect" } });
  };

  const handleBackToDashboard = () => {
    window.location.href = "https://app.winedge.io/mon-compte?tab=settings";
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <nav className="sticky">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Winedge
              </span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
{/* 
            <Button
              onClick={handleCreateWallet}
              size="sm"
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Créer wallet</span>
            </Button>

            <Button
              onClick={handleImportWallet}
              size="sm"
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Unlock className="h-4 w-4" />
              <span className="hidden sm:inline">Saisir un wallet</span>
            </Button> */}

            <Button
              onClick={handleBackToDashboard}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Retourner au compte</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StickyMenu;
