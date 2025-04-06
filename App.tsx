import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sports from "./pages/Sports";
import Teams from "./pages/Teams";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import Workouts from "./pages/Workouts";
import WorkoutPlans from "./pages/WorkoutPlans";
import MatchRequests from "./pages/MatchRequests";
import About from "./pages/About";
import Profile from "./pages/Profile";
import TeamManagement from "./pages/TeamManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/workout-plans" element={<WorkoutPlans />} />
          <Route path="/matches" element={<MatchRequests />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/team-management" element={<TeamManagement />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
