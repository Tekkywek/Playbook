
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["athlete", "coach", "parent"]),
  sport: z.enum(["basketball", "volleyball", "multiple"])
});

type SignUpFormData = z.infer<typeof signupSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    role: "athlete",
    sport: "basketball"
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Validate form data
      signupSchema.parse(formData);
      
      // Simulate API call
      console.log("Submitting signup data:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "Account created!",
        description: "Welcome to PlayBook! You're now ready to get started.",
      });
      
      // Redirect to dashboard after signup
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try again later.",
        });
      }
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
              <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
              <CardDescription className="text-center">
                Join PlayBook to start your sports journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">I am a</Label>
                  <Select 
                    value={formData.role}
                    onValueChange={(value) => handleSelectChange("role", value)}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="athlete">Athlete</SelectItem>
                      <SelectItem value="coach">Coach</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sport">Primary Sport</Label>
                  <Select 
                    value={formData.sport}
                    onValueChange={(value) => handleSelectChange("sport", value)}
                  >
                    <SelectTrigger id="sport">
                      <SelectValue placeholder="Select your sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="volleyball">Volleyball</SelectItem>
                      <SelectItem value="multiple">Multiple Sports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full bg-playbook-primary hover:bg-playbook-accent" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-center text-sm text-muted-foreground mt-2">
                By creating an account, you agree to our
                <Button variant="link" className="pl-1 pr-1 text-playbook-primary">Terms of Service</Button>
                and
                <Button variant="link" className="pl-1 text-playbook-primary">Privacy Policy</Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?
                <Button variant="link" className="pl-1 text-playbook-primary" onClick={() => navigate("/login")}>
                  Log in
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

export default SignUp;
