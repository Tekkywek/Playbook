import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import { ChevronLeft, ChevronRight, X, Check, MessageCircle, Calendar } from "lucide-react";

// Mock data for potential matches
const potentialMatches = [
  {
    id: 1,
    name: "Alex Johnson",
    age: 16,
    sport: "Basketball",
    position: "Point Guard",
    location: "San Francisco, CA",
    distance: "5 miles away",
    bio: "Looking for practice partners to improve my shooting skills and game awareness.",
    skillLevel: "Intermediate",
    availability: ["Weekday evenings", "Weekend afternoons"],
    recentlyActive: true,
    profileImage: "alex-johnson.jpg"
  },
  {
    id: 2,
    name: "Taylor Smith",
    age: 17,
    sport: "Volleyball",
    position: "Setter",
    location: "Oakland, CA",
    distance: "15 miles away",
    bio: "Competitive club player looking for hitting practice and scrimmages on weekends.",
    skillLevel: "Advanced",
    availability: ["Weekend mornings", "Weekend afternoons"],
    recentlyActive: true,
    profileImage: "taylor-smith.jpg"
  },
  {
    id: 3,
    name: "Jordan Lee",
    age: 15,
    sport: "Basketball",
    position: "Shooting Guard",
    location: "San Jose, CA",
    distance: "20 miles away",
    bio: "AAU player looking for training partners. Focusing on defensive technique and shooting consistency.",
    skillLevel: "Intermediate",
    availability: ["Weekday evenings", "Weekend mornings"],
    recentlyActive: false,
    profileImage: "jordan-lee.jpg"
  }
];

// Mock data for match requests
const matchRequests = [
  {
    id: 101,
    athlete: {
      id: 4,
      name: "Casey Williams",
      age: 16,
      sport: "Basketball",
      position: "Small Forward",
      location: "San Mateo, CA",
      profileImage: "casey-williams.jpg"
    },
    message: "Hey! I saw that you're also working on shooting drills. Want to practice together sometime next week?",
    status: "pending",
    sentAt: "2023-11-06T14:30:00Z"
  },
  {
    id: 102,
    athlete: {
      id: 5,
      name: "Morgan Garcia",
      age: 17,
      sport: "Volleyball",
      position: "Outside Hitter",
      location: "Fremont, CA",
      profileImage: "morgan-garcia.jpg"
    },
    message: "Looking for a setter to practice with. Let me know if you're interested!",
    status: "pending",
    sentAt: "2023-11-05T09:15:00Z"
  }
];

// Mock data for active matches
const activeMatches = [
  {
    id: 201,
    athlete: {
      id: 6,
      name: "Riley Brown",
      age: 16,
      sport: "Basketball",
      position: "Power Forward",
      location: "Berkeley, CA",
      profileImage: "riley-brown.jpg"
    },
    lastMessage: "Are we still on for Thursday at 5pm?",
    lastMessageTime: "Yesterday",
    upcomingSession: {
      date: "2023-11-09T17:00:00Z",
      location: "Berkeley Community Center",
      confirmed: true
    }
  },
  {
    id: 202,
    athlete: {
      id: 7,
      name: "Jamie Wilson",
      age: 15,
      sport: "Volleyball",
      position: "Libero",
      location: "Palo Alto, CA",
      profileImage: "jamie-wilson.jpg"
    },
    lastMessage: "Great practice today! Let's schedule another one soon.",
    lastMessageTime: "3 days ago",
    upcomingSession: null
  }
];

export default function MatchRequests() {
  const [currentMatchIndex, setCurrentMatchIndex] = React.useState(0);
  const currentMatch = potentialMatches[currentMatchIndex];

  const handleNextMatch = () => {
    setCurrentMatchIndex((prev) => (prev + 1) % potentialMatches.length);
  };

  const handlePrevMatch = () => {
    setCurrentMatchIndex((prev) => (prev === 0 ? potentialMatches.length - 1 : prev - 1));
  };

  return (
    <React.Fragment>
      <Navbar />
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Athlete Matchmaking</h1>
        
        <Tabs defaultValue="discover">
          <TabsList className="mb-4 bg-[#E8D6B0]">
            <TabsTrigger value="discover" className="data-[state=active]:bg-[#FF7F2A] data-[state=active]:text-white">Discover Athletes</TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-[#FF7F2A] data-[state=active]:text-white">Match Requests</TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-[#FF7F2A] data-[state=active]:text-white">Active Matches</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover" className="space-y-6">
            <div className="flex items-center justify-center relative">
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute left-0 z-10 bg-white" 
                onClick={handlePrevMatch}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <Card className="w-full max-w-2xl bg-white overflow-hidden">
                <div className="h-48 bg-[#D35400] flex items-center justify-center">
                  <div className="text-white text-2xl font-bold">
                    {currentMatch.sport} - {currentMatch.position}
                  </div>
                </div>
                
                <CardHeader className="bg-[#F5E8C7]">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-[#3E2723]">{currentMatch.name}, {currentMatch.age}</CardTitle>
                      <CardDescription>
                        {currentMatch.location} • {currentMatch.distance}
                        {currentMatch.recentlyActive && (
                          <span className="ml-2 text-green-600">• Recently active</span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="text-sm font-medium bg-[#FF7F2A] text-white rounded-md px-2 py-1">
                      {currentMatch.skillLevel}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">About</h3>
                      <p className="text-sm">{currentMatch.bio}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Availability</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentMatch.availability.map((time, i) => (
                          <span key={i} className="text-xs bg-[#E8D6B0] text-[#3E2723] px-2 py-1 rounded-md">
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between p-4 bg-white border-t border-[#E8D6B0]">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50" 
                    onClick={handleNextMatch}
                  >
                    <X className="mr-2 h-5 w-5" />
                    Skip
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1 ml-2 bg-[#FF7F2A] hover:bg-[#D35400]"
                    onClick={handleNextMatch}
                  >
                    <Check className="mr-2 h-5 w-5" />
                    Connect
                  </Button>
                </CardFooter>
              </Card>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute right-0 z-10 bg-white"
                onClick={handleNextMatch}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="requests">
            <div className="grid grid-cols-1 gap-4">
              {matchRequests.map(request => (
                <Card key={request.id} className="bg-white overflow-hidden">
                  <CardHeader className="bg-[#F5E8C7]">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-[#3E2723]">{request.athlete.name}, {request.athlete.age}</CardTitle>
                        <CardDescription>
                          {request.athlete.sport} • {request.athlete.position} • {request.athlete.location}
                        </CardDescription>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(request.sentAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <p className="text-sm mb-4">"{request.message}"</p>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end p-4 bg-white border-t border-[#E8D6B0]">
                    <Button 
                      variant="outline" 
                      className="border-red-500 text-red-500 hover:bg-red-50 mr-2"
                    >
                      Decline
                    </Button>
                    <Button 
                      className="bg-[#FF7F2A] hover:bg-[#D35400]"
                    >
                      Accept Request
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="matches">
            <div className="grid grid-cols-1 gap-4">
              {activeMatches.map(match => (
                <Card key={match.id} className="bg-white overflow-hidden">
                  <CardHeader className="bg-[#F5E8C7]">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-[#3E2723]">{match.athlete.name}, {match.athlete.age}</CardTitle>
                        <CardDescription>
                          {match.athlete.sport} • {match.athlete.position} • {match.athlete.location}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MessageCircle size={16} className="mr-1" />
                          <span>"{match.lastMessage}"</span>
                        </div>
                        <div className="text-xs text-gray-400">Last message: {match.lastMessageTime}</div>
                      </div>
                      
                      {match.upcomingSession && (
                        <div className="ml-4 p-2 bg-[#E8D6B0] rounded-md max-w-[180px]">
                          <div className="flex items-center text-[#3E2723] font-medium text-sm mb-1">
                            <Calendar size={16} className="mr-1" />
                            <span>Upcoming Session</span>
                          </div>
                          <div className="text-xs">
                            <div>{new Date(match.upcomingSession.date).toLocaleDateString()} at {new Date(match.upcomingSession.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            <div className="mt-1">{match.upcomingSession.location}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end p-4 bg-white border-t border-[#E8D6B0]">
                    <Button 
                      variant="outline" 
                      className="mr-2"
                    >
                      Message
                    </Button>
                    <Button 
                      className="bg-[#FF7F2A] hover:bg-[#D35400]"
                    >
                      {match.upcomingSession ? 'Manage Session' : 'Schedule Session'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </React.Fragment>
  );
} 