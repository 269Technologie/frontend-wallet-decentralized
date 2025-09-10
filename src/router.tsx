import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

// Création du routeur
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index onWalletCreated={(wallet) => console.log('Wallet created:', wallet)} />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
], {
  basename: "/v1/wallet"
});

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
