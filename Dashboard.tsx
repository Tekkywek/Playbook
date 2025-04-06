
import { useState } from "react";
import { PlusCircle, Calendar, Users, Dumbbell, Medal, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Dashboard = () => {
  const [userName] = useState("Alex");
  
  // Mock data - would be fetched from the backend in a real app
  const upcomingEvents = [
    { id: 1, title: "Team Practice", date: "Wednesday, 4:30 PM", type: "practice" },
    { id: 2, title: "Game vs. Westside Tigers", date: "Saturday, 2:00 PM", type: "game" },
    { id: 3, title: "Conditioning Training", date: "Monday, 5:00 PM", type: "workout" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-playbook-light py-8">
        <div className="container px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your sports activities</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">2 practices, 1 game</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Workout Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7 days</div>
                <p className="text-xs text-muted-foreground">Personal best!</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">2 coaches, 10 players</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Training Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">+5% from last week</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Upcoming Events</CardTitle>
                    <Button size="sm" className="bg-playbook-primary hover:bg-playbook-accent">
                      <PlusCircle className="h-4 w-4 mr-2" /> 
                      Add Event
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map(event => (
                      <div key={event.id} className="flex items-start p-3 bg-white rounded-md shadow-sm">
                        <div className={`p-2 rounded-full mr-4 ${
                          event.type === 'practice' ? 'bg-blue-100 text-blue-600' :
                          event.type === 'game' ? 'bg-orange-100 text-orange-600' : 
                          'bg-green-100 text-green-600'
                        }`}>
                          {event.type === 'practice' ? <Users className="h-5 w-5" /> :
                           event.type === 'game' ? <Medal className="h-5 w-5" /> :
                           <Dumbbell className="h-5 w-5" />}
                        </div>
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Teams</CardTitle>
                    <Button size="sm" className="bg-playbook-primary hover:bg-playbook-accent">
                      <PlusCircle className="h-4 w-4 mr-2" /> 
                      Join Team
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                      <h3 className="font-bold">Eastside Eagles</h3>
                      <p className="text-sm text-muted-foreground mb-3">Basketball • Varsity</p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Team
                      </Button>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h3 className="font-bold">Community Center Volleyball</h3>
                      <p className="text-sm text-muted-foreground mb-3">Volleyball • Recreational</p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Team
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Workouts</CardTitle>
                    <Button size="sm" className="bg-playbook-primary hover:bg-playbook-accent">
                      <PlusCircle className="h-4 w-4 mr-2" /> 
                      New Workout
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-white border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Shooting Drills</h3>
                        <span className="text-xs bg-playbook-secondary/30 text-playbook-primary px-2 py-1 rounded">
                          Basketball
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">Completed April 4, 2025</p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                    
                    <div className="p-3 bg-white border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Strength Training</h3>
                        <span className="text-xs bg-playbook-secondary/30 text-playbook-primary px-2 py-1 rounded">
                          Conditioning
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">Completed April 2, 2025</p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Stats</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <BarChart2 className="h-16 w-16 text-playbook-primary mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Connect your tracking app or enter stats manually to see your performance analytics.
                    </p>
                    <Button className="mt-4 bg-playbook-primary hover:bg-playbook-accent">
                      Connect Data Source
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
