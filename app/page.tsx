"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Sun, Leaf, BookOpen, Award, Sparkles, Heart, TreePine, Flower2, Share2 } from "lucide-react"
import PlantDiagnosis from "@/components/plant-diagnosis"
import SimulationModule from "@/components/simulation-module"
import LearningQuests from "@/components/learning-quests"
import PlantJournal from "@/components/plant-journal"
import { useToast } from "@/hooks/use-toast"

export default function RootIntelApp() {
  const [activeTab, setActiveTab] = useState("home")
  const { toast } = useToast()

  // Handle URL parameters for PWA shortcuts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tab = urlParams.get("tab")
    if (tab && ["home", "diagnosis", "simulation", "quests", "journal"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [])

  // Handle sharing functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "RootIntel - AI Plant Care",
          text: "Check out this amazing AI-powered plant care app!",
          url: window.location.origin,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(window.location.origin)
        toast({
          title: "Link copied!",
          description: "Share link has been copied to your clipboard.",
        })
      } catch (error) {
        console.log("Error copying to clipboard:", error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">🌱 RootIntel</h1>
                <p className="text-sm text-green-600">AI-Powered Plant Care & Education</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} className="hidden sm:flex bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Sparkles className="w-3 h-3 mr-1" />
                PWA Ready
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="diagnosis" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Diagnosis</span>
            </TabsTrigger>
            <TabsTrigger value="simulation" className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              <span className="hidden sm:inline">Simulation</span>
            </TabsTrigger>
            <TabsTrigger value="quests" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Quests</span>
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Journal</span>
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="mt-6">
            <div className="grid gap-6">
              {/* Welcome Section */}
              <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Flower2 className="w-6 h-6" />
                    Welcome to RootIntel
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Your magical journey through the world of plant care begins here. Let Paa and the Elder Woman guide
                    you through AI-powered plant wisdom. Now available as a mobile app!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => setActiveTab("diagnosis")} className="bg-green-600 hover:bg-green-700">
                      <Camera className="w-4 h-4 mr-2" />
                      Diagnose Plant
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("simulation")}
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <Sun className="w-4 h-4 mr-2" />
                      Try Simulation
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50 sm:hidden bg-transparent"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share App
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* PWA Features */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Sparkles className="w-6 h-6" />
                    Mobile App Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        📱
                      </div>
                      <h4 className="font-medium text-blue-800">Install on Home Screen</h4>
                      <p className="text-sm text-blue-600">Add to your phone for quick access</p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        🔄
                      </div>
                      <h4 className="font-medium text-green-800">Works Offline</h4>
                      <p className="text-sm text-green-600">Access saved data without internet</p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        ⚡
                      </div>
                      <h4 className="font-medium text-purple-800">Fast & Responsive</h4>
                      <p className="text-sm text-purple-600">Native app-like experience</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="bg-white/60 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Camera className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">127</p>
                        <p className="text-sm text-gray-600">Plants Diagnosed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">89%</p>
                        <p className="text-sm text-gray-600">Success Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">12</p>
                        <p className="text-sm text-gray-600">Quests Completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">45</p>
                        <p className="text-sm text-gray-600">Plants Saved</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-green-800">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Camera className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Diagnosed Spider Plant</p>
                        <p className="text-sm text-gray-600">Identified overwatering issue • 2 hours ago</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Success</Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Sun className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Completed Sunlight Simulation</p>
                        <p className="text-sm text-gray-600">Optimized growth conditions • 1 day ago</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">Completed</Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Award className="w-5 h-5 text-yellow-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Quest: Heal the Rose Bush</p>
                        <p className="text-sm text-gray-600">Successfully treated blight • 3 days ago</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700">Achievement</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="diagnosis">
            <PlantDiagnosis />
          </TabsContent>

          <TabsContent value="simulation">
            <SimulationModule />
          </TabsContent>

          <TabsContent value="quests">
            <LearningQuests />
          </TabsContent>

          <TabsContent value="journal">
            <PlantJournal />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
