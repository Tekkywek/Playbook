
import { Zap, BarChart2, Users, Calendar, Smartphone, ShieldCheck, MessageSquare, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface FeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const Feature = ({ icon: Icon, title, description }: FeatureProps) => (
  <div className="flex flex-col items-center text-center p-6 border rounded-lg hover:shadow-md transition-shadow bg-white">
    <div className="bg-playbook-primary/10 p-4 rounded-full mb-4">
      <Icon className="h-6 w-6 text-playbook-primary" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

const FeatureHighlight = ({ title, description, imageSrc, imageAlt, reversed = false }: {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  reversed?: boolean;
}) => (
  <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center mb-16`}>
    <div className="md:w-1/2">
      <img 
        src={imageSrc} 
        alt={imageAlt} 
        className="w-full h-auto rounded-lg shadow-lg"
      />
    </div>
    <div className="md:w-1/2">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Button asChild className="bg-playbook-primary hover:bg-playbook-accent">
        <Link to="/signup">Try It Now</Link>
      </Button>
    </div>
  </div>
);

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-playbook-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Powerful Features for Athletes & Coaches</h1>
            <p className="max-w-2xl mx-auto mb-8">
              Discover the tools that will help you improve performance, streamline coordination, 
              and take your game to the next level.
            </p>
            <Button asChild variant="secondary" size="lg">
              <Link to="/signup">Get Started For Free</Link>
            </Button>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Feature 
                icon={Zap}
                title="Performance Tracking"
                description="Track progress across metrics like speed, strength, and skills with detailed analytics."
              />
              <Feature 
                icon={BarChart2}
                title="Advanced Analytics"
                description="Visualize performance data to identify trends, strengths, and areas for improvement."
              />
              <Feature 
                icon={Users}
                title="Team Management"
                description="Manage rosters, assign roles, and keep track of player availability and attendance."
              />
              <Feature 
                icon={Calendar}
                title="Practice Planning"
                description="Create, share, and manage detailed practice plans and schedules."
              />
              <Feature 
                icon={Smartphone}
                title="Mobile Access"
                description="Access all features on the go with our responsive mobile experience."
              />
              <Feature 
                icon={ShieldCheck}
                title="Secure Data"
                description="Your information is safe with enterprise-grade security and privacy controls."
              />
              <Feature 
                icon={MessageSquare}
                title="Team Chat"
                description="Communicate seamlessly with teammates and coaches through integrated messaging."
              />
              <Feature 
                icon={Award}
                title="Goal Setting"
                description="Set personal and team goals with tracking and achievement notifications."
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-playbook-light">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Spotlight Features</h2>
            
            <FeatureHighlight 
              title="Smart Workout Builder"
              description="Create custom workouts tailored to your sport, position, and skill level. Our intelligent system adapts as you progress, ensuring continuous improvement and preventing plateaus."
              imageSrc="https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=2574&auto=format&fit=crop"
              imageAlt="Workout planning on a tablet"
            />
            
            <FeatureHighlight 
              title="Team Coordination Center"
              description="Keep everyone on the same page with integrated calendars, messaging, and file sharing. Send automatic practice reminders, share game plans, and collect feedback all in one place."
              imageSrc="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop"
              imageAlt="Team coordination dashboard"
              reversed={true}
            />
            
            <FeatureHighlight 
              title="Performance Analytics Dashboard"
              description="Track progress with beautiful, intuitive visualizations that make it easy to identify patterns and opportunities for improvement in both individual and team performance."
              imageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop"
              imageAlt="Performance analytics dashboard"
            />
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Experience PlayBook?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of athletes and coaches who are already using PlayBook to improve performance and streamline team management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-playbook-primary hover:bg-playbook-accent">
                <Link to="/signup">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/sports">Browse Sports</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
