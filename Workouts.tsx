import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";

// Mock data for workouts
const workoutLibrary = [
  {
    id: 1,
    name: "Basketball Shooting Drill",
    description: "Improve your shooting accuracy with this comprehensive drill",
    category: "Basketball",
    difficulty: "Intermediate",
    duration: 45,
    exercises: [
      { name: "Free Throws", sets: 5, reps: 10, description: "Practice your free throw technique" },
      { name: "Three-Point Shots", sets: 3, reps: 15, description: "Work on your long-range shooting" },
      { name: "Mid-Range Jumpers", sets: 4, reps: 12, description: "Perfect your jump shot form" }
    ]
  },
  {
    id: 2,
    name: "Volleyball Serving Practice",
    description: "Master different types of volleyball serves",
    category: "Volleyball",
    difficulty: "Beginner",
    duration: 30,
    exercises: [
      { name: "Underhand Serves", sets: 3, reps: 10, description: "Practice the basic underhand serve" },
      { name: "Overhand Serves", sets: 3, reps: 10, description: "Work on your overhand serve technique" },
      { name: "Jump Serves", sets: 2, reps: 10, description: "Advanced serving technique" }
    ]
  },
  {
    id: 3,
    name: "Basketball Dribbling Mastery",
    description: "Enhance your ball handling skills",
    category: "Basketball",
    difficulty: "Advanced",
    duration: 40,
    exercises: [
      { name: "Figure-8 Dribbling", sets: 3, reps: 60, description: "Dribble in a figure-8 pattern" },
      { name: "Crossover Drills", sets: 4, reps: 20, description: "Practice crossover dribbling" },
      { name: "Behind-the-Back Dribbles", sets: 3, reps: 15, description: "Master behind-the-back moves" }
    ]
  },
  {
    id: 4,
    name: "Volleyball Setting Drill",
    description: "Improve your setting accuracy and consistency",
    category: "Volleyball",
    difficulty: "Intermediate",
    duration: 35,
    exercises: [
      { name: "Wall Sets", sets: 3, reps: 20, description: "Practice setting against a wall" },
      { name: "Partner Sets", sets: 4, reps: 15, description: "Setting drills with a partner" },
      { name: "Movement Sets", sets: 3, reps: 10, description: "Setting while moving to different positions" }
    ]
  }
];

// User progress mock data
const userProgress = [
  { id: 1, completed: true, date: "2023-11-01" },
  { id: 2, completed: true, date: "2023-11-03" },
  { id: 3, completed: false, date: "2023-11-05" },
  { id: 4, completed: false, date: "2023-11-07" }
];

export default function Workouts() {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [activeTab, setActiveTab] = useState("library");

  const completedWorkouts = userProgress.filter(p => p.completed).length;
  const progressPercentage = (completedWorkouts / userProgress.length) * 100;

  return (
    <React.Fragment>
      <Navbar />
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Workout System</h1>
        
        <div className="mb-6">
          <Card className="bg-[#FAF8F1]">
            <CardHeader>
              <CardTitle className="text-[#3E2723]">Your Progress</CardTitle>
              <CardDescription>Track your workout completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Completed: {completedWorkouts}/{userProgress.length}</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2 bg-[#E8D6B0]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 bg-[#E8D6B0]">
            <TabsTrigger value="library" className="data-[state=active]:bg-[#FF7F2A] data-[state=active]:text-white">Exercise Library</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#FF7F2A] data-[state=active]:text-white">Workout History</TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-[#FF7F2A] data-[state=active]:text-white">Create Workout</TabsTrigger>
          </TabsList>
          
          <TabsContent value="library" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workoutLibrary.map((workout) => (
                <Card key={workout.id} className="overflow-hidden bg-white border-[#E8D6B0]">
                  <CardHeader className="bg-[#F5E8C7]">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-[#3E2723]">{workout.name}</CardTitle>
                        <CardDescription>{workout.description}</CardDescription>
                      </div>
                      <div className="bg-[#FF7F2A] text-white rounded-md px-2 py-1 text-xs font-medium">
                        {workout.category}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Difficulty: {workout.difficulty}</span>
                        <span>{workout.duration} mins</span>
                      </div>
                      <div className="text-sm mt-2">
                        <p className="font-medium">Includes:</p>
                        <ul className="list-disc pl-5 mt-1">
                          {workout.exercises.slice(0, 2).map((ex, i) => (
                            <li key={i}>{ex.name}</li>
                          ))}
                          {workout.exercises.length > 2 && <li>+{workout.exercises.length - 2} more</li>}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-white">
                    <Button className="w-full bg-[#FF7F2A] hover:bg-[#D35400]">
                      Start Workout
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card className="bg-[#FAF8F1]">
              <CardHeader>
                <CardTitle className="text-[#3E2723]">Workout History</CardTitle>
                <CardDescription>View your past workout sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Recent Workouts</h3>
                    <div className="space-y-3">
                      {userProgress.map((progress) => {
                        const workout = workoutLibrary.find(w => w.id === progress.id);
                        return (
                          <div key={progress.id} className="flex items-center p-3 rounded-md bg-white">
                            <div className={`w-3 h-3 rounded-full mr-3 ${progress.completed ? 'bg-green-500' : 'bg-[#FF7F2A]'}`} />
                            <div className="flex-1">
                              <p className="font-medium">{workout?.name}</p>
                              <p className="text-sm text-gray-500">{progress.date}</p>
                            </div>
                            <div className={`px-2 py-1 rounded-md text-xs ${progress.completed ? 'bg-green-500 text-white' : 'bg-[#E8D6B0] text-[#3E2723]'}`}>
                              {progress.completed ? 'Completed' : 'Planned'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-3">Calendar View</h3>
                    <div className="border rounded-md p-2 bg-white">
                      <Calendar 
                        mode="single"
                        className="rounded-md border-0"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="create">
            <Card className="bg-[#FAF8F1]">
              <CardHeader>
                <CardTitle className="text-[#3E2723]">Create Custom Workout</CardTitle>
                <CardDescription>Design your own training session</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">This feature will allow you to create customized workouts by selecting exercises from our library or adding your own.</p>
                <Button className="bg-[#FF7F2A] hover:bg-[#D35400]">Start Building Workout</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </React.Fragment>
  );
} 