import { Users, Shield, CalendarDays, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

const TeamFeature = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="flex gap-3">
    <div className="bg-playbook-primary/10 p-2 rounded-full h-fit">
      <Icon className="h-5 w-5 text-playbook-primary" />
    </div>
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const TeamCard = ({ name, members, type, imageUrl }: { name: string, members: number, type: string, imageUrl: string }) => (
  <Card className="overflow-hidden">
    <div className="aspect-video overflow-hidden">
      <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
    </div>
    <CardHeader>
      <CardTitle>{name}</CardTitle>
      <CardDescription>{type}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{members} members</span>
      </div>
    </CardContent>
    <CardFooter>
      <Button asChild className="w-full bg-playbook-primary hover:bg-playbook-accent">
        <Link to="/team-management">View Team</Link>
      </Button>
    </CardFooter>
  </Card>
);

const Teams = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-playbook-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Team Management Made Simple</h1>
            <p className="max-w-2xl mx-auto mb-8">
              Coordinate practices, communicate with players, manage schedules, and track performance - all in one place.
            </p>
            <Button asChild variant="secondary" size="lg">
              <Link to="/team-management">Create Your Team</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-playbook-light">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Everything Your Team Needs</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <TeamFeature 
                icon={Users}
                title="Roster Management"
                description="Easily add, remove, and organize players. Track attendance, positions, and player stats."
              />
              <TeamFeature 
                icon={CalendarDays}
                title="Practice Scheduling"
                description="Create and share practice schedules. Send automatic reminders to players and coaches."
              />
              <TeamFeature 
                icon={Shield}
                title="Performance Analytics"
                description="Track team and individual performance metrics over time with intuitive visual reports."
              />
              <TeamFeature 
                icon={MessageSquare}
                title="Team Communication"
                description="Built-in messaging system to keep everyone on the same page. Share files and announcements."
              />
            </div>
          </div>
        </section>

        {/* Example Teams Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-6">Featured Teams</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Join thousands of teams already using PlayBook to streamline their management and improve performance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TeamCard 
                name="Phoenix Flyers" 
                members={18} 
                type="Basketball - Youth League"
                imageUrl="https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2671&auto=format&fit=crop"
              />
              <TeamCard 
                name="Spike Masters" 
                members={14} 
                type="Volleyball - College"
                imageUrl="https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=2672&auto=format&fit=crop"
              />
              <TeamCard 
                name="Elite Fitness Crew" 
                members={25} 
                type="Personal Training Group"
                imageUrl="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2670&auto=format&fit=crop"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Teams;
