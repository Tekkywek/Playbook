import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/layout/Navbar";
import { Users, Shield, CalendarDays, MessageSquare, Plus, UserPlus, Trash2, PenSquare, Calendar, BarChart, Send } from "lucide-react";

// Mock team data
const mockTeam = {
  id: 1,
  name: "Phoenix Flyers",
  sport: "Basketball",
  description: "Youth basketball team for ages 12-14. We focus on fundamental skill development and sportsmanship.",
  logo: "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2671&auto=format&fit=crop",
  coach: "Coach Johnson",
  members: [
    { id: 1, name: "Alex Johnson", role: "Point Guard", status: "active", joinedDate: "2023-08-15" },
    { id: 2, name: "Jamie Smith", role: "Shooting Guard", status: "active", joinedDate: "2023-08-17" },
    { id: 3, name: "Casey Williams", role: "Small Forward", status: "injured", joinedDate: "2023-08-20" },
    { id: 4, name: "Taylor Brown", role: "Power Forward", status: "active", joinedDate: "2023-09-01" },
    { id: 5, name: "Jordan Davis", role: "Center", status: "active", joinedDate: "2023-09-05" },
    { id: 6, name: "Riley Wilson", role: "Point Guard", status: "inactive", joinedDate: "2023-09-10" },
    { id: 7, name: "Morgan Garcia", role: "Shooting Guard", status: "active", joinedDate: "2023-09-15" },
  ]
};

// Mock events
const mockEvents = [
  { id: 1, title: "Team Practice", type: "practice", date: "2023-11-12", time: "16:00-18:00", location: "Bay Area Sports Center" },
  { id: 2, title: "Game vs. Golden Eagles", type: "game", date: "2023-11-18", time: "14:00-16:00", location: "Oakland Community Center" },
  { id: 3, title: "Skills Workshop", type: "training", date: "2023-11-21", time: "17:00-19:00", location: "Bay Area Sports Center" },
  { id: 4, title: "Team Meeting", type: "meeting", date: "2023-11-25", time: "15:00-16:00", location: "Online (Zoom)" }
];

// Mock team messages
const mockMessages = [
  { id: 1, sender: "Coach Johnson", content: "Great practice today everyone! Remember we have our game this Saturday at 2pm. Be at the venue by 1pm for warm-up.", timestamp: "2023-11-09T10:15:00Z" },
  { id: 2, sender: "Alex Johnson", content: "Coach, will we be focusing on defense drills tomorrow?", timestamp: "2023-11-09T14:30:00Z" },
  { id: 3, sender: "Coach Johnson", content: "Yes, Alex. We'll spend about half the session on defensive positioning and rotations.", timestamp: "2023-11-09T15:10:00Z" },
  { id: 4, sender: "Jamie Smith", content: "I'll be arriving 15 minutes late to practice tomorrow - doctor's appointment. Sorry!", timestamp: "2023-11-09T18:45:00Z" },
  { id: 5, sender: "Coach Johnson", content: "No problem, Jamie. Thanks for letting us know.", timestamp: "2023-11-09T19:20:00Z" }
];

// Mock stats
const mockStats = [
  { game: "vs. Golden Eagles", date: "2023-10-21", result: "W 68-52", points: 68, rebounds: 32, assists: 15, steals: 8 },
  { game: "vs. Silver Knights", date: "2023-10-28", result: "L 54-61", points: 54, rebounds: 28, assists: 12, steals: 7 },
  { game: "vs. Blue Jays", date: "2023-11-04", result: "W 72-59", points: 72, rebounds: 36, assists: 18, steals: 10 }
];

const TeamManagement = () => {
  const [team] = useState(mockTeam);
  const [events] = useState(mockEvents);
  const [messages] = useState(mockMessages);
  const [stats] = useState(mockStats);
  const [newMessage, setNewMessage] = useState('');

  // Mock function to handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would add the message to the database
      console.log("Sending message:", newMessage);
      // Clear the input
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-6 bg-[#FAF8F1]">
        <div className="container mx-auto px-4">
          {/* Team Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="h-16 w-16 bg-[#FF7F2A] rounded-full flex items-center justify-center text-white font-bold text-xl">
                {team.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#3E2723]">{team.name}</h1>
                <p className="text-[#D35400]">{team.sport} • Coached by {team.coach}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-[#FF7F2A] text-[#FF7F2A]">
                <PenSquare className="mr-2 h-4 w-4" />
                Edit Team
              </Button>
              <Button className="bg-[#FF7F2A] hover:bg-[#D35400]">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Player
              </Button>
            </div>
          </div>
          
          {/* Team Management Tabs */}
          <Tabs defaultValue="roster" className="space-y-4">
            <TabsList className="bg-[#E8D6B0]">
              <TabsTrigger value="roster" className="data-[state=active]:bg-[#FF7F2A] data-[state=active]:text-white">
                <Users className="mr-2 h-4 w-4" />
                Roster
              </TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-[#FF7F2A] data-[state=active]:text-white">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="messages" className="data-[state=active]:bg-[#FF7F2A] data-[state=active]:text-white">
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-[#FF7F2A] data-[state=active]:text-white">
                <BarChart className="mr-2 h-4 w-4" />
                Stats
              </TabsTrigger>
            </TabsList>
            
            {/* Roster Tab */}
            <TabsContent value="roster">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#3E2723]">Team Roster</CardTitle>
                  <CardDescription>Manage your team's players and their roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Members: {team.members.length}</p>
                    </div>
                    <Button className="bg-[#FF7F2A] hover:bg-[#D35400]">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Player
                    </Button>
                  </div>
                  
                  <div className="overflow-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#F5E8C7] text-[#3E2723]">
                          <th className="text-left p-3 rounded-tl-md">Name</th>
                          <th className="text-left p-3">Role</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Joined</th>
                          <th className="text-right p-3 rounded-tr-md">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {team.members.map((member) => (
                          <tr key={member.id} className="border-b border-[#E8D6B0] hover:bg-[#FAF8F1]">
                            <td className="p-3">{member.name}</td>
                            <td className="p-3">{member.role}</td>
                            <td className="p-3">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                member.status === 'active' ? 'bg-green-100 text-green-800' :
                                member.status === 'injured' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                              </span>
                            </td>
                            <td className="p-3">{member.joinedDate}</td>
                            <td className="p-3 text-right">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500">
                                <PenSquare className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#3E2723]">Team Schedule</CardTitle>
                  <CardDescription>Manage practices, games, and team events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Upcoming Events: {events.length}</p>
                    </div>
                    <Button className="bg-[#FF7F2A] hover:bg-[#D35400]">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Event
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {events.map((event) => (
                      <Card key={event.id} className="overflow-hidden border-[#E8D6B0]">
                        <div className="flex">
                          <div className={`w-3 ${
                            event.type === 'practice' ? 'bg-blue-500' :
                            event.type === 'game' ? 'bg-green-500' :
                            event.type === 'meeting' ? 'bg-purple-500' :
                            'bg-yellow-500'
                          }`} />
                          <div className="flex-1 p-4">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium text-[#3E2723]">{event.title}</h3>
                                <p className="text-sm text-gray-500">{event.date} • {event.time}</p>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  event.type === 'practice' ? 'bg-blue-100 text-blue-800' :
                                  event.type === 'game' ? 'bg-green-100 text-green-800' :
                                  event.type === 'meeting' ? 'bg-purple-100 text-purple-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                </span>
                                <div className="flex">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500">
                                    <PenSquare className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm mt-2">Location: {event.location}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#3E2723]">Team Messages</CardTitle>
                  <CardDescription>Communicate with your team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-4 rounded-md border border-[#E8D6B0] h-96 flex flex-col">
                    <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                      {messages.map((message) => (
                        <div key={message.id} className="flex flex-col">
                          <div className="flex items-start gap-2">
                            <div className="bg-[#E8D6B0] h-8 w-8 rounded-full flex items-center justify-center text-[#3E2723] font-semibold">
                              {message.sender.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p className="font-medium text-[#3E2723]">{message.sender}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                              </div>
                              <p className="text-sm mt-1">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} className="bg-[#FF7F2A] hover:bg-[#D35400]">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Stats Tab */}
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#3E2723]">Team Statistics</CardTitle>
                  <CardDescription>Track your team's performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-[#F5E8C7]">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm text-[#3E2723]">Season Record</p>
                          <p className="text-3xl font-bold text-[#3E2723]">2-1</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-[#F5E8C7]">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm text-[#3E2723]">Avg Points</p>
                          <p className="text-3xl font-bold text-[#3E2723]">64.7</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-[#F5E8C7]">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm text-[#3E2723]">Avg Rebounds</p>
                          <p className="text-3xl font-bold text-[#3E2723]">32.0</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-[#F5E8C7]">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm text-[#3E2723]">Avg Assists</p>
                          <p className="text-3xl font-bold text-[#3E2723]">15.0</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h3 className="font-semibold mb-3 text-[#3E2723]">Game Results</h3>
                  <div className="overflow-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#F5E8C7] text-[#3E2723]">
                          <th className="text-left p-3 rounded-tl-md">Game</th>
                          <th className="text-left p-3">Date</th>
                          <th className="text-left p-3">Result</th>
                          <th className="text-right p-3">PTS</th>
                          <th className="text-right p-3">REB</th>
                          <th className="text-right p-3">AST</th>
                          <th className="text-right p-3 rounded-tr-md">STL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.map((game, index) => (
                          <tr key={index} className="border-b border-[#E8D6B0] hover:bg-[#FAF8F1]">
                            <td className="p-3">{game.game}</td>
                            <td className="p-3">{game.date}</td>
                            <td className="p-3 font-medium">
                              <span className={`${game.result.startsWith('W') ? 'text-green-600' : 'text-red-600'}`}>
                                {game.result}
                              </span>
                            </td>
                            <td className="p-3 text-right">{game.points}</td>
                            <td className="p-3 text-right">{game.rebounds}</td>
                            <td className="p-3 text-right">{game.assists}</td>
                            <td className="p-3 text-right">{game.steals}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-[#FF7F2A] hover:bg-[#D35400]">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Game Result
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default TeamManagement; 