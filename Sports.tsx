
import { Trophy, Dumbbell, Activity, User, Snowflake, Bike, ShieldCheck, Waves, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface SportCardProps {
  title: string;
  icon: React.ElementType;
  description: string;
  imageUrl: string;
  comingSoon?: boolean;
}

const SportCard = ({ title, icon: Icon, description, imageUrl, comingSoon = false }: SportCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl">
      <div className="aspect-video overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>
      <div className="absolute bottom-0 w-full p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-playbook-primary/90 p-2 rounded-full">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
          {comingSoon && (
            <span className="ml-auto bg-playbook-accent/90 rounded-full px-3 py-1 text-xs font-medium">
              Coming Soon
            </span>
          )}
        </div>
        <p className="text-sm text-white/90 mb-4">
          {description}
        </p>
        <Button 
          asChild 
          className={`w-fit bg-white text-playbook-primary hover:bg-playbook-secondary ${comingSoon ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <Link to={comingSoon ? "#" : "/signup"}>
            {comingSoon ? "Notify Me" : "Join Now"}
          </Link>
        </Button>
      </div>
    </div>
  );
};

const Sports = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative py-20 px-4 bg-playbook-primary text-white">
          <div className="container mx-auto text-center max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Find Your Sport</h1>
            <p className="mb-8">
              PlayBook supports a variety of sports to help athletes and coaches connect, 
              train, and compete at their best.
            </p>
            <div className="relative">
              <Input 
                className="w-full pl-4 pr-10 py-3 rounded-full text-black border-none" 
                placeholder="Search for your sport..." 
              />
              <Pencil className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-playbook-primary" />
            </div>
          </div>
        </section>

        <section className="py-16 bg-playbook-light">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SportCard 
                title="Basketball" 
                icon={Trophy}
                description="Improve your shooting, dribbling, and court awareness with position-specific drills and analytics."
                imageUrl="https://images.unsplash.com/photo-1546519638-68e109acd27d?q=80&w=2680&auto=format&fit=crop"
              />
              <SportCard 
                title="Volleyball" 
                icon={Activity}
                description="Master your serves, blocks, and spikes with specialized training programs and team coordination."
                imageUrl="https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=2670&auto=format&fit=crop"
              />
              <SportCard 
                title="Personal Training" 
                icon={Dumbbell}
                description="Get customized workout plans, track your progress, and receive personalized feedback from coaches."
                imageUrl="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2670&auto=format&fit=crop"
              />
              <SportCard 
                title="Team Management" 
                icon={User}
                description="Organize your team roster, schedule practices, share playbooks, and communicate effortlessly."
                imageUrl="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2029&auto=format&fit=crop"
              />
              <SportCard 
                title="Swimming" 
                icon={Waves}
                description="Track lap times, perfect your technique, and coordinate pool sessions with coaches and teammates."
                imageUrl="https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=2670&auto=format&fit=crop"
                comingSoon={true}
              />
              <SportCard 
                title="Soccer" 
                icon={ShieldCheck}
                description="Develop ball handling skills, team strategies, and coordinate practice sessions for your squad."
                imageUrl="https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=2574&auto=format&fit=crop"
                comingSoon={true}
              />
              <SportCard 
                title="Cycling" 
                icon={Bike}
                description="Plan routes, track distance and performance metrics, and connect with other cycling enthusiasts."
                imageUrl="https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=2670&auto=format&fit=crop"
                comingSoon={true}
              />
              <SportCard 
                title="Ice Hockey" 
                icon={Snowflake}
                description="Develop skating, puck handling, and team play with specialized drills and performance tracking."
                imageUrl="https://images.unsplash.com/photo-1580125073333-50e315f5a1bc?q=80&w=2574&auto=format&fit=crop"
                comingSoon={true}
              />
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white border-t">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Don't See Your Sport?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              We're constantly adding new sports to the PlayBook platform. Let us know what sport you'd like to see next!
            </p>
            <Button asChild className="bg-playbook-primary hover:bg-playbook-accent">
              <Link to="/contact">Request a Sport</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Sports;
