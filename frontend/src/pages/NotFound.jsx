import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";
import { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      window.location.pathname
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4">
      <div className="text-center animate-scale-in">
        <div className="mb-8">
          <AlertCircle className="h-24 w-24 text-blue-500 mx-auto mb-4" />
          <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </p>
        </div>

        <Link to="/">
          <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 text-lg rounded-xl hover:shadow-lg hover:scale-105 transition-all">
            <Home className="h-5 w-5" />
            Return to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
