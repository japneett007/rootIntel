"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, Star, Clock, Users, Target, CheckCircle, Lock, Play, Trophy, Flower2, Bug, Sun } from "lucide-react"

export default function LearningQuests() {
  const [activeQuest, setActiveQuest] = useState<number | null>(null)

  const quests = [
    {
      id: 1,
      title: "Heal the Rose Bush",
      description:
        "A beautiful rose bush has been struck by blight. Use your diagnostic skills to identify the problem and create a treatment plan.",
      difficulty: "Beginner",
      duration: "15 min",
      reward: 100,
      icon: <Flower2 className="w-6 h-6" />,
      status: "completed",
      progress: 100,
      participants: 1247,
    },
    {
      id: 2,
      title: "Sunflower Growth Challenge",
      description:
        "Optimize growing conditions to cultivate the healthiest sunflower for our bee friends. Master the sunlight simulation.",
      difficulty: "Intermediate",
      duration: "25 min",
      reward: 200,
      icon: <Sun className="w-6 h-6" />,
      status: "active",
      progress: 65,
      participants: 892,
    },
    {
      id: 3,
      title: "Pest Detective",
      description:
        "Identify and treat various plant pests using AI diagnosis. Learn to spot the signs before it's too late.",
      difficulty: "Advanced",
      duration: "30 min",
      reward: 300,
      icon: <Bug className="w-6 h-6" />,
      status: "locked",
      progress: 0,
      participants: 456,
    },
    {
      id: 4,
      title: "Frost Recovery Mission",
      description:
        "Help a vegetable garden recover from unexpected frost damage. Adjust environmental variables to save the harvest.",
      difficulty: "Intermediate",
      duration: "20 min",
      reward: 250,
      icon: <Target className="w-6 h-6" />,
      status: "available",
      progress: 0,
      participants: 634,
    },
  ]

  const achievements = [
    { name: "Plant Whisperer", description: "Diagnosed 10 plants successfully", earned: true },
    { name: "Green Thumb", description: "Completed 5 quests", earned: true },
    { name: "Simulation Master", description: "Achieved 90%+ plant health in simulation", earned: false },
    { name: "Pest Expert", description: "Identified 20 different plant pests", earned: false },
    { name: "Growth Guru", description: "Optimized growth conditions 50 times", earned: false },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700"
      case "Advanced":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "active":
        return <Play className="w-5 h-5 text-blue-600" />
      case "locked":
        return <Lock className="w-5 h-5 text-gray-400" />
      default:
        return <Target className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="grid gap-6">
      {/* Quest Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">12</div>
              <div className="text-sm text-blue-700">Quests Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">2,450</div>
              <div className="text-sm text-green-700">Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">5</div>
              <div className="text-sm text-purple-700">Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">Level 8</div>
              <div className="text-sm text-orange-700">Plant Master</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Available Quests */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-600" />
            Learning Quests
          </h2>

          {quests.map((quest) => (
            <Card key={quest.id} className="bg-white/60 backdrop-blur-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      quest.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : quest.status === "active"
                          ? "bg-blue-100 text-blue-600"
                          : quest.status === "locked"
                            ? "bg-gray-100 text-gray-400"
                            : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {quest.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{quest.title}</h3>
                        <p className="text-gray-600 text-sm">{quest.description}</p>
                      </div>
                      {getStatusIcon(quest.status)}
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <Badge className={getDifficultyColor(quest.difficulty)}>{quest.difficulty}</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {quest.duration}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        {quest.participants.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-yellow-600">
                        <Star className="w-4 h-4" />
                        {quest.reward} pts
                      </div>
                    </div>

                    {quest.status === "active" && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-800 font-medium">{quest.progress}%</span>
                        </div>
                        <Progress value={quest.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex gap-2">
                      {quest.status === "completed" ? (
                        <Button variant="outline" size="sm" disabled>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </Button>
                      ) : quest.status === "active" ? (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Play className="w-4 h-4 mr-2" />
                          Continue
                        </Button>
                      ) : quest.status === "locked" ? (
                        <Button variant="outline" size="sm" disabled>
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </Button>
                      ) : (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Play className="w-4 h-4 mr-2" />
                          Start Quest
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements Sidebar */}
        <div className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    achievement.earned ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {achievement.earned ? (
                      <Trophy className="w-4 h-4 text-yellow-600" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                    )}
                    <span className={`font-medium ${achievement.earned ? "text-yellow-800" : "text-gray-600"}`}>
                      {achievement.name}
                    </span>
                  </div>
                  <p className={`text-xs ${achievement.earned ? "text-yellow-700" : "text-gray-500"}`}>
                    {achievement.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Level Progress */}
          <Card className="bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-purple-600">Level 8</div>
                <div className="text-sm text-gray-600">Plant Master</div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress to Level 9</span>
                  <span>2,450 / 3,000 XP</span>
                </div>
                <Progress value={81.7} className="h-2" />
              </div>
              <p className="text-xs text-gray-500 text-center">550 XP needed for next level</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
