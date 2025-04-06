
import { ArrowRight, Award, Users, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-playbook-primary to-playbook-accent text-white py-16 md:py-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        {/* Basketball court patterns */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 border-t-4 border-white/20 rounded-full transform scale-[2.5] translate-y-1/2"></div>
        <div className="absolute top-20 right-20 h-24 w-24 border-4 border-white/10 rounded-full"></div>
        <div className="absolute top-40 left-20 h-16 w-16 border-2 border-white/10 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Train Smarter, Compete Stronger, Connect Better
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            The ultimate social platform for youth athletes in basketball and volleyball. 
            Create your athletic journey with personalized training, team collaboration, 
            and athlete matchmaking.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="text-playbook-text font-medium">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10 font-medium">
              <Link to="/features" className="flex items-center gap-2">
                Learn More
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Personalized Training</h3>
            <p className="text-sm opacity-80">
              Custom workouts and progress tracking designed for your sport and position
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Team Collaboration</h3>
            <p className="text-sm opacity-80">
              Stay connected with your team through schedules, messaging and shared workouts
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <BarChart2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Performance Analytics</h3>
            <p className="text-sm opacity-80">
              Track your progress with detailed statistics and visual performance reports
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
