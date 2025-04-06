import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogIn, BarChart2, Users, BookOpen, LogOut, Dumbbell, Calendar, UserSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  
  // Check authentication status on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    const email = localStorage.getItem("userEmail") || "";
    
    setIsAuthenticated(authStatus);
    setUserEmail(email);
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account."
    });
    
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-playbook-neutral bg-white/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-playbook-primary" />
          <span className="font-heading text-2xl font-extrabold text-playbook-primary">
            PlayBook
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/features" className="text-sm font-medium hover:text-playbook-primary transition-colors">
            Features
          </Link>
          <Link to="/pricing" className="text-sm font-medium hover:text-playbook-primary transition-colors">
            Pricing
          </Link>
          <Link to="/sports" className="text-sm font-medium hover:text-playbook-primary transition-colors">
            Sports
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-playbook-primary transition-colors">
            About
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-playbook-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/workouts" className="text-sm font-medium hover:text-playbook-primary transition-colors flex items-center gap-1">
                <Dumbbell size={16} />
                Workouts
              </Link>
              <Link to="/workout-plans" className="text-sm font-medium hover:text-playbook-primary transition-colors flex items-center gap-1">
                <Calendar size={16} />
                Plans
              </Link>
              <Link to="/matches" className="text-sm font-medium hover:text-playbook-primary transition-colors flex items-center gap-1">
                <UserSearch size={16} />
                Match
              </Link>
              <Link to="/teams" className="text-sm font-medium hover:text-playbook-primary transition-colors">
                Teams
              </Link>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={() => navigate("/profile")}>
                  <User size={16} />
                  {userEmail ? userEmail.split('@')[0] : "Profile"}
                </Button>
                <Button variant="ghost" size="sm" className="gap-1 text-red-500" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link to="/login">
                  <LogIn size={16} />
                  Login
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-playbook-primary hover:bg-playbook-accent">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden p-4 space-y-4 bg-white border-t border-playbook-neutral">
          <Link 
            to="/features"
            className="block py-2 hover:text-playbook-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </Link>
          <Link 
            to="/pricing"
            className="block py-2 hover:text-playbook-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link 
            to="/sports"
            className="block py-2 hover:text-playbook-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Sports
          </Link>
          <Link 
            to="/about"
            className="block py-2 hover:text-playbook-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard"
                className="block py-2 hover:text-playbook-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/workouts"
                className="flex items-center py-2 hover:text-playbook-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <Dumbbell size={16} className="mr-2" />
                Workouts
              </Link>
              <Link 
                to="/workout-plans"
                className="flex items-center py-2 hover:text-playbook-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar size={16} className="mr-2" />
                Workout Plans
              </Link>
              <Link 
                to="/matches"
                className="flex items-center py-2 hover:text-playbook-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserSearch size={16} className="mr-2" />
                Find Athletes
              </Link>
              <Link 
                to="/teams"
                className="block py-2 hover:text-playbook-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Teams
              </Link>
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/profile");
                  }}
                >
                  <User size={16} />
                  {userEmail ? userEmail.split('@')[0] : "Profile"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start gap-2 text-red-500"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button 
                asChild 
                variant="outline" 
                size="sm" 
                className="w-full justify-start gap-2"
              >
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <LogIn size={16} />
                  Login
                </Link>
              </Button>
              <Button 
                asChild 
                size="sm" 
                className="w-full bg-playbook-primary hover:bg-playbook-accent"
              >
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
