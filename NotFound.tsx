
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-playbook-light">
        <div className="text-center px-4 py-16">
          <div className="mb-6 text-playbook-primary">
            <h1 className="text-8xl font-bold mb-2">404</h1>
            <div className="w-16 h-1 bg-playbook-primary mx-auto"></div>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Sorry, we couldn't find the page you're looking for.
            The URL may be misspelled or the page you're looking for is no longer available.
          </p>
          
          <Button asChild className="bg-playbook-primary hover:bg-playbook-accent">
            <Link to="/" className="flex items-center gap-2">
              <Home size={16} />
              Return to Home
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
