import { Button } from "@/components/ui/button";
import { Plus, Unlock, Home } from "lucide-react";
import winedgeLogo from "../../assets/images/winedgewhite.png";
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
    const isSignup = localStorage.getItem("signup") != null ? true : false
    if (isSignup) {
      localStorage.removeItem("signup");
      window.location.href = "https://app.winedge.io/inscription-done?wallet_done=false";
      // window.location.href = "http://localhost:5173/inscription-done?wallet_done=false";
    } else {
      window.location.href = "https://app.winedge.io/mon-compte?tab=settings";
    }
    // window.location.href = "https://app.winedge.io/mon-compte?tab=settings";
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
              <img src={winedgeLogo} alt="Winedge Logo" className="h-20 w-20 object-contain" />
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
