import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
        <h1 className="text-6xl font-extrabold text-purple-600 mb-4 animate-bounce">404</h1>
        <p className="text-2xl text-gray-700 mb-4 font-semibold">Oups ! Cette page n'existe pas.</p>
        <p className="text-md text-gray-500 mb-6">Le lien <span className="bg-gray-200 px-2 py-1 rounded text-red-500 font-mono">{location.pathname}</span> est introuvable.</p>
        <a href="/" className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition">Retour à l'accueil</a>
      </div>
    </div>
  );
};

export default NotFound;
