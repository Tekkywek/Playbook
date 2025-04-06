import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/layout/Navbar";
import { UserCircle, Mail, MapPin, Award, Star, Settings, Bell, Shield, LogOut, User, CheckCircle, Calendar, Dumbbell, Users } from "lucide-react";

// Mock user data
const mockUser = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  joinedDate: "August, 2023",
  role: "Athlete",
  location: "San Francisco, CA",
  bio: "High school basketball player focusing on improving my shooting and defensive skills. Looking for practice partners in the Bay Area.",
  sports: ["Basketball"],
  positions: ["Point Guard", "Shooting Guard"],
  skillLevel: "Intermediate",
  achievements: [
    { id: 1, title: "10 Workout Streak", date: "2023-10-15", icon: "streak" },
    { id: 2, title: "First Team Connection", date: "2023-09-20", icon: "connection" },
    { id: 3, title: "Profile Completed", date: "2023-08-15", icon: "profile" }
  ],
  stats: {
    workoutsCompleted: 24,
    teamsJoined: 1,
    matchesScheduled: 3,
    trainingMinutes: 840
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    weeklyProgress: true,
    matchSuggestions: true,
    profileVisibility: "public"
  },
  upcomingEvents: [
    { id: 1, title: "Team Practice", date: "2023-11-12", time: "16:00-18:00", type: "team" },
    { id: 2, title: "Shooting Workout", date: "2023-11-14", time: "15:00-16:00", type: "workout" },
    { id: 3, title: "Practice with Jordan", date: "2023-11-16", time: "17:00-18:30", type: "match" }
  ]
};

const Profile = () => {
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    location: user.location,
    bio: user.bio,
    skillLevel: user.skillLevel
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // In a real app, this would update the user's profile in the database
    setUser(prev => ({ ...prev, ...formData }));
    setIsEditing(false);
  };

  // Function to get icon component for achievements
  const getAchievementIcon = (iconType) => {
    switch (iconType) {
      case 'streak':
        return <Award className="h-5 w-5 text-yellow-500" />;
      case 'connection':
        return <UserCircle className="h-5 w-5 text-blue-500" />;
      case 'profile':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Star className="h-5 w-5 text-[#FF7F2A]" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F1]">
      <Navbar />
      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Sidebar */}
            <div className="md:w-1/3 lg:w-1/4">
              <Card className="bg-white border-[#E8D6B0] mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-24 bg-[#FF7F2A] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                      {user.name.charAt(0)}
                    </div>
                    <h2 className="text-xl font-bold text-[#3E2723]">{user.name}</h2>
                    <p className="text-[#D35400] mb-2">{user.sports.join(', ')} • {user.positions.join(', ')}</p>
                    <div className="flex items-center text-gray-600 text-sm mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {user.location}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {user.joinedDate}
                    </div>
                    <Button 
                      onClick={() => setIsEditing(!isEditing)} 
                      variant={isEditing ? "secondary" : "outline"}
                      className={isEditing ? "w-full" : "w-full border-[#FF7F2A] text-[#FF7F2A]"}
                    >
                      {isEditing ? "Cancel Editing" : "Edit Profile"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E8D6B0]">
                <CardHeader>
                  <CardTitle className="text-[#3E2723] text-lg">Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-[#FF7F2A]/10 flex items-center justify-center mr-3">
                          {getAchievementIcon(achievement.icon)}
                        </div>
                        <div>
                          <p className="font-medium text-[#3E2723]">{achievement.title}</p>
                          <p className="text-sm text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="md:w-2/3 lg:w-3/4">
              {/* Profile Form (when editing) */}
              {isEditing ? (
                <Card className="bg-white border-[#E8D6B0] mb-6">
                  <CardHeader>
                    <CardTitle className="text-[#3E2723]">Edit Profile</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={formData.email} 
                            onChange={handleInputChange} 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          name="location" 
                          value={formData.location} 
                          onChange={handleInputChange} 
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="skillLevel">Skill Level</Label>
                        <Select 
                          value={formData.skillLevel}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, skillLevel: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select skill level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          name="bio" 
                          value={formData.bio} 
                          onChange={handleInputChange} 
                          rows={4}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button className="bg-[#FF7F2A] hover:bg-[#D35400]" onClick={handleSaveProfile}>Save Changes</Button>
                  </CardFooter>
                </Card>
              ) : (
                // Profile Overview (when not editing)
                <Card className="bg-white border-[#E8D6B0] mb-6">
                  <CardHeader>
                    <CardTitle className="text-[#3E2723]">About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-6">{user.bio}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-[#E8D6B0] flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-[#3E2723]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Role</p>
                          <p className="font-medium text-[#3E2723]">{user.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-[#E8D6B0] flex items-center justify-center mr-3">
                          <Award className="h-5 w-5 text-[#3E2723]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Skill Level</p>
                          <p className="font-medium text-[#3E2723]">{user.skillLevel}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="bg-[#F5E8C7]">
                        <CardContent className="pt-6 pb-4 text-center">
                          <p className="text-3xl font-bold text-[#3E2723]">{user.stats.workoutsCompleted}</p>
                          <p className="text-sm text-gray-600">Workouts</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#F5E8C7]">
                        <CardContent className="pt-6 pb-4 text-center">
                          <p className="text-3xl font-bold text-[#3E2723]">{user.stats.teamsJoined}</p>
                          <p className="text-sm text-gray-600">Teams</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#F5E8C7]">
                        <CardContent className="pt-6 pb-4 text-center">
                          <p className="text-3xl font-bold text-[#3E2723]">{user.stats.matchesScheduled}</p>
                          <p className="text-sm text-gray-600">Matches</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#F5E8C7]">
                        <CardContent className="pt-6 pb-4 text-center">
                          <p className="text-3xl font-bold text-[#3E2723]">{user.stats.trainingMinutes}</p>
                          <p className="text-sm text-gray-600">Minutes</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tabs for additional profile sections */}
              <Tabs defaultValue="upcoming" className="space-y-4">
                <TabsList className="bg-[#E8D6B0]">
                  <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#FF7F2A] data-[state=active]:text-white">
                    <Calendar className="mr-2 h-4 w-4" />
                    Upcoming Events
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-[#FF7F2A] data-[state=active]:text-white">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                {/* Upcoming Events Tab */}
                <TabsContent value="upcoming">
                  <Card className="bg-white border-[#E8D6B0]">
                    <CardHeader>
                      <CardTitle className="text-[#3E2723]">Upcoming Events</CardTitle>
                      <CardDescription>Your scheduled activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {user.upcomingEvents.map((event) => (
                          <div key={event.id} className="flex items-start p-3 rounded-md border border-[#E8D6B0] bg-white">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                              event.type === 'team' ? 'bg-blue-100' :
                              event.type === 'workout' ? 'bg-green-100' :
                              'bg-purple-100'
                            }`}>
                              {event.type === 'team' ? (
                                <Users className={`h-5 w-5 text-blue-600`} />
                              ) : event.type === 'workout' ? (
                                <Dumbbell className={`h-5 w-5 text-green-600`} />
                              ) : (
                                <UserCircle className={`h-5 w-5 text-purple-600`} />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-medium text-[#3E2723]">{event.title}</p>
                                  <p className="text-sm text-gray-500">{event.date} • {event.time}</p>
                                </div>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  event.type === 'team' ? 'bg-blue-100 text-blue-800' :
                                  event.type === 'workout' ? 'bg-green-100 text-green-800' :
                                  'bg-purple-100 text-purple-800'
                                }`}>
                                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Settings Tab */}
                <TabsContent value="settings">
                  <Card className="bg-white border-[#E8D6B0]">
                    <CardHeader>
                      <CardTitle className="text-[#3E2723]">Notification Settings</CardTitle>
                      <CardDescription>Manage how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium text-[#3E2723]">Email Notifications</p>
                              <p className="text-sm text-gray-500">Receive email updates about your account</p>
                            </div>
                          </div>
                          <Switch checked={user.preferences.emailNotifications} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium text-[#3E2723]">Push Notifications</p>
                              <p className="text-sm text-gray-500">Receive notifications on your device</p>
                            </div>
                          </div>
                          <Switch checked={user.preferences.pushNotifications} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium text-[#3E2723]">Weekly Progress Report</p>
                              <p className="text-sm text-gray-500">Get a summary of your weekly activities</p>
                            </div>
                          </div>
                          <Switch checked={user.preferences.weeklyProgress} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <UserCircle className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium text-[#3E2723]">Match Suggestions</p>
                              <p className="text-sm text-gray-500">Receive suggestions for potential practice partners</p>
                            </div>
                          </div>
                          <Switch checked={user.preferences.matchSuggestions} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white border-[#E8D6B0] mt-6">
                    <CardHeader>
                      <CardTitle className="text-[#3E2723]">Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium text-[#3E2723]">Profile Visibility</p>
                              <p className="text-sm text-gray-500">Control who can see your profile</p>
                            </div>
                          </div>
                          <Select defaultValue={user.preferences.profileVisibility}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="teams">Teams Only</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="pt-4">
                          <Button variant="outline" className="text-red-500 border-red-500">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile; 