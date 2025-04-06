
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Validate input
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }
      
      // Simulate API call
      console.log("Login attempt:", { email, password, rememberMe });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Store login status in localStorage to persist across refreshes
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in to your PlayBook account.",
      });
      
      // Redirect to dashboard after login
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-playbook-light py-12">
        <div className="container max-w-md px-4">
          <Card className="shadow-lg border-playbook-secondary/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
              <CardDescription className="text-center">
                Log in to your PlayBook account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button 
                      variant="link" 
                      className="text-xs text-playbook-primary p-0 h-auto"
                      onClick={() => navigate("/forgot-password")}
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input 
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>
                <Button 
                  className="w-full bg-playbook-primary hover:bg-playbook-accent" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log in"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-center text-sm">
                Don't have an account?
                <Button variant="link" className="pl-1 text-playbook-primary" onClick={() => navigate("/signup")}>
                  Sign up
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
