"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { BookOpen, Plus, Calendar, Camera, Leaf, TrendingUp, Edit, Trash2 } from "lucide-react"

export default function PlantJournal() {
  const [newEntry, setNewEntry] = useState({
    title: "",
    hypothesis: "",
    action: "",
    result: "",
    reflection: "",
  })

  const journalEntries = [
    {
      id: 1,
      date: "2024-01-15",
      title: "Spider Plant Overwatering Recovery",
      plant: "Spider Plant",
      hypothesis: "The yellowing leaves are caused by overwatering",
      action: "Reduced watering frequency to once per week and improved drainage",
      result: "New growth appeared after 2 weeks, yellow leaves stopped spreading",
      reflection:
        "Learned that spider plants prefer to dry out between waterings. Will monitor soil moisture more carefully.",
      tags: ["overwatering", "recovery", "spider-plant"],
      images: 2,
      success: true,
    },
    {
      id: 2,
      date: "2024-01-10",
      title: "Sunlight Optimization Experiment",
      plant: "Sunflower Seedlings",
      hypothesis: "Increasing sunlight exposure will improve growth rate",
      action: "Moved seedlings from 4 hours to 8 hours of direct sunlight daily",
      result: "Growth rate increased by 40%, stems became stronger",
      reflection: "Sunflowers definitely need maximum sun exposure. Will continue this approach for future plantings.",
      tags: ["sunlight", "growth", "sunflower", "optimization"],
      images: 3,
      success: true,
    },
    {
      id: 3,
      date: "2024-01-05",
      title: "Rose Bush Blight Treatment",
      plant: "Garden Rose",
      hypothesis: "Black spots on leaves indicate fungal infection",
      action: "Applied organic fungicide and improved air circulation",
      result: "Spots stopped spreading, new healthy growth emerged",
      reflection: "Early intervention is key with fungal issues. Regular inspection helps catch problems early.",
      tags: ["fungal", "treatment", "rose", "blight"],
      images: 1,
      success: true,
    },
  ]

  const handleAddEntry = () => {
    // In a real app, this would save to a database
    console.log("Adding new entry:", newEntry)
    setNewEntry({
      title: "",
      hypothesis: "",
      action: "",
      result: "",
      reflection: "",
    })
  }

  return (
    <div className="grid gap-6">
      {/* Journal Stats */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">23</div>
              <div className="text-sm text-green-700">Journal Entries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">18</div>
              <div className="text-sm text-blue-700">Successful Experiments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">12</div>
              <div className="text-sm text-purple-700">Plant Species</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">78%</div>
              <div className="text-sm text-orange-700">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* New Entry Form */}
        <Card className="bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              New Journal Entry
            </CardTitle>
            <CardDescription>Document your plant care experiments and observations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Experiment Title</label>
              <Input
                placeholder="e.g., Fixing yellowing leaves on my fiddle leaf fig"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Hypothesis</label>
              <Textarea
                placeholder="What do you think is causing the issue?"
                value={newEntry.hypothesis}
                onChange={(e) => setNewEntry({ ...newEntry, hypothesis: e.target.value })}
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Action Taken</label>
              <Textarea
                placeholder="What steps did you take to address the problem?"
                value={newEntry.action}
                onChange={(e) => setNewEntry({ ...newEntry, action: e.target.value })}
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Result</label>
              <Textarea
                placeholder="What happened after your intervention?"
                value={newEntry.result}
                onChange={(e) => setNewEntry({ ...newEntry, result: e.target.value })}
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Reflection</label>
              <Textarea
                placeholder="What did you learn from this experience?"
                value={newEntry.reflection}
                onChange={(e) => setNewEntry({ ...newEntry, reflection: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddEntry} className="bg-green-600 hover:bg-green-700 flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
              <Button variant="outline" size="icon">
                <Camera className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Journal Entries */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            My RootJournal
          </h2>

          {journalEntries.map((entry) => (
            <Card key={entry.id} className="bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{entry.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Leaf className="w-4 h-4" />
                        {entry.plant}
                      </div>
                      {entry.images > 0 && (
                        <div className="flex items-center gap-1">
                          <Camera className="w-4 h-4" />
                          {entry.images} photos
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.success && (
                      <Badge className="bg-green-100 text-green-700">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Success
                      </Badge>
                    )}
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Hypothesis</h4>
                    <p className="text-gray-600 text-sm">{entry.hypothesis}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Action Taken</h4>
                    <p className="text-gray-600 text-sm">{entry.action}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Result</h4>
                    <p className="text-gray-600 text-sm">{entry.result}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Reflection</h4>
                    <p className="text-gray-600 text-sm">{entry.reflection}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
