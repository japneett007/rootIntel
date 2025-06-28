"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Sun,
  Droplets,
  Thermometer,
  Zap,
  TrendingUp,
  BarChart3,
  Leaf,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"

// Optimal ranges for different plant types
const PLANT_PROFILES = {
  tropical: { sunlight: [40, 70], water: [60, 80], temperature: [22, 28], fertilizer: [30, 50] },
  desert: { sunlight: [70, 90], water: [20, 40], temperature: [25, 35], fertilizer: [10, 30] },
  temperate: { sunlight: [50, 80], water: [40, 60], temperature: [18, 25], fertilizer: [20, 40] },
}

export default function SimulationModule() {
  const [sunlight, setSunlight] = useState([60])
  const [water, setWater] = useState([55])
  const [temperature, setTemperature] = useState([24])
  const [fertilizer, setFertilizer] = useState([35])
  const [selectedProfile, setSelectedProfile] = useState<keyof typeof PLANT_PROFILES>("temperate")

  const [plantHealth, setPlantHealth] = useState(75)
  const [growthRate, setGrowthRate] = useState(65)
  const [yieldQuality, setYieldQuality] = useState(70)
  const [chlorophyllLevel, setChlorophyllLevel] = useState(68)
  const [rootHealth, setRootHealth] = useState(72)

  const [alerts, setAlerts] = useState<Array<{ type: "warning" | "error" | "success"; message: string }>>([])

  // Calculate plant health based on optimal ranges
  useEffect(() => {
    const profile = PLANT_PROFILES[selectedProfile]
    const newAlerts: Array<{ type: "warning" | "error" | "success"; message: string }> = []

    // Calculate individual scores
    const sunlightScore = calculateScore(sunlight[0], profile.sunlight)
    const waterScore = calculateScore(water[0], profile.water)
    const tempScore = calculateScore(temperature[0], profile.temperature)
    const fertScore = calculateScore(fertilizer[0], profile.fertilizer)

    // Generate alerts based on conditions
    if (sunlight[0] < profile.sunlight[0]) {
      newAlerts.push({ type: "warning", message: "Insufficient sunlight - consider moving to a brighter location" })
    } else if (sunlight[0] > profile.sunlight[1]) {
      newAlerts.push({ type: "error", message: "Too much direct sunlight - leaves may burn" })
    }

    if (water[0] < profile.water[0]) {
      newAlerts.push({ type: "warning", message: "Plant appears thirsty - increase watering frequency" })
    } else if (water[0] > profile.water[1]) {
      newAlerts.push({ type: "error", message: "Overwatering detected - risk of root rot" })
    }

    if (temperature[0] < profile.temperature[0]) {
      newAlerts.push({ type: "warning", message: "Temperature too low - growth may slow down" })
    } else if (temperature[0] > profile.temperature[1]) {
      newAlerts.push({ type: "error", message: "Temperature stress - plant may wilt" })
    }

    if (fertilizer[0] > profile.fertilizer[1]) {
      newAlerts.push({ type: "warning", message: "Over-fertilization can burn roots" })
    }

    // Calculate overall health
    const overallHealth = Math.round((sunlightScore + waterScore + tempScore + fertScore) / 4)
    const growth = Math.round(overallHealth * 0.9 + sunlightScore * 0.3 + Math.random() * 10)
    const quality = Math.round(overallHealth * 0.85 + fertScore * 0.2 + Math.random() * 10)
    const chlorophyll = Math.round(sunlightScore * 0.7 + overallHealth * 0.3 + Math.random() * 10)
    const roots = Math.round(waterScore * 0.6 + tempScore * 0.4 + Math.random() * 10)

    if (overallHealth >= 85) {
      newAlerts.push({ type: "success", message: "Excellent conditions! Your plant is thriving" })
    }

    setPlantHealth(Math.min(100, overallHealth))
    setGrowthRate(Math.min(100, growth))
    setYieldQuality(Math.min(100, quality))
    setChlorophyllLevel(Math.min(100, chlorophyll))
    setRootHealth(Math.min(100, roots))
    setAlerts(newAlerts)
  }, [sunlight, water, temperature, fertilizer, selectedProfile])

  const calculateScore = (value: number, range: [number, number]) => {
    const [min, max] = range
    const optimal = (min + max) / 2
    const tolerance = (max - min) / 2

    if (value >= min && value <= max) {
      // Within optimal range
      return 100 - (Math.abs(value - optimal) / tolerance) * 20
    } else {
      // Outside optimal range
      const distance = value < min ? min - value : value - max
      return Math.max(0, 100 - distance * 2)
    }
  }

  const getHealthColor = (value: number) => {
    if (value >= 80) return "text-green-600"
    if (value >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getHealthBg = (value: number) => {
    if (value >= 80) return "bg-green-100"
    if (value >= 60) return "bg-yellow-100"
    return "bg-red-100"
  }

  const getPlantEmoji = () => {
    if (plantHealth >= 80) return "🌱✨"
    if (plantHealth >= 60) return "🌱"
    if (plantHealth >= 40) return "🥀"
    return "💀"
  }

  const applyPreset = (preset: keyof typeof PLANT_PROFILES) => {
    setSelectedProfile(preset)
    const profile = PLANT_PROFILES[preset]

    // Set to optimal values for the selected profile
    setSunlight([Math.round((profile.sunlight[0] + profile.sunlight[1]) / 2)])
    setWater([Math.round((profile.water[0] + profile.water[1]) / 2)])
    setTemperature([Math.round((profile.temperature[0] + profile.temperature[1]) / 2)])
    setFertilizer([Math.round((profile.fertilizer[0] + profile.fertilizer[1]) / 2)])
  }

  return (
    <div className="grid gap-6">
      {/* Elder Woman's Guidance */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">👵</span>
            </div>
            <div>
              <h3 className="font-semibold text-purple-800 mb-2">Elder Woman's Teaching</h3>
              <p className="text-purple-700">
                "Adjust the elements of nature, dear child. Watch how the plants respond to sunlight, water, and warmth.
                Each change tells a story of growth and balance. Choose your plant type first!"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plant Type Selection */}
      <Card className="bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            Plant Type Selection
          </CardTitle>
          <CardDescription>Choose the type of plant you want to simulate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(PLANT_PROFILES).map(([type, profile]) => (
              <Button
                key={type}
                variant={selectedProfile === type ? "default" : "outline"}
                className={`p-4 h-auto flex-col items-start ${
                  selectedProfile === type ? "bg-green-600 hover:bg-green-700" : "bg-transparent"
                }`}
                onClick={() => applyPreset(type as keyof typeof PLANT_PROFILES)}
              >
                <div className="text-2xl mb-2">{type === "tropical" ? "🌴" : type === "desert" ? "🌵" : "🌿"}</div>
                <div className="text-left">
                  <div className="font-medium capitalize">{type} Plants</div>
                  <div className="text-xs opacity-75 mt-1">
                    {type === "tropical" && "High humidity, moderate sun"}
                    {type === "desert" && "Low water, high sun tolerance"}
                    {type === "temperate" && "Balanced conditions"}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              className={
                alert.type === "error"
                  ? "border-red-200 bg-red-50"
                  : alert.type === "warning"
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-green-200 bg-green-50"
              }
            >
              {alert.type === "error" ? (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              ) : alert.type === "warning" ? (
                <Info className="h-4 w-4 text-yellow-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              <AlertDescription
                className={
                  alert.type === "error"
                    ? "text-red-700"
                    : alert.type === "warning"
                      ? "text-yellow-700"
                      : "text-green-700"
                }
              >
                {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card className="bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Environmental Controls
            </CardTitle>
            <CardDescription>
              Adjust conditions for {selectedProfile} plants {getPlantEmoji()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sunlight */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">Sunlight Intensity</span>
                </div>
                <Badge variant="outline">{sunlight[0]}%</Badge>
              </div>
              <Slider value={sunlight} onValueChange={setSunlight} max={100} step={1} className="w-full" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Shade (0%)</span>
                <span>Partial Sun (50%)</span>
                <span>Full Sun (100%)</span>
              </div>
              <div className="text-xs text-blue-600">
                Optimal for {selectedProfile}: {PLANT_PROFILES[selectedProfile].sunlight[0]}%-
                {PLANT_PROFILES[selectedProfile].sunlight[1]}%
              </div>
            </div>

            {/* Water */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Water Level</span>
                </div>
                <Badge variant="outline">{water[0]}%</Badge>
              </div>
              <Slider value={water} onValueChange={setWater} max={100} step={1} className="w-full" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Dry (0%)</span>
                <span>Moist (50%)</span>
                <span>Saturated (100%)</span>
              </div>
              <div className="text-xs text-blue-600">
                Optimal for {selectedProfile}: {PLANT_PROFILES[selectedProfile].water[0]}%-
                {PLANT_PROFILES[selectedProfile].water[1]}%
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-red-500" />
                  <span className="font-medium">Temperature</span>
                </div>
                <Badge variant="outline">{temperature[0]}°C</Badge>
              </div>
              <Slider value={temperature} onValueChange={setTemperature} min={5} max={40} step={1} className="w-full" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Cold (5°C)</span>
                <span>Room Temp (22°C)</span>
                <span>Hot (40°C)</span>
              </div>
              <div className="text-xs text-blue-600">
                Optimal for {selectedProfile}: {PLANT_PROFILES[selectedProfile].temperature[0]}°C-
                {PLANT_PROFILES[selectedProfile].temperature[1]}°C
              </div>
            </div>

            {/* Fertilizer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Fertilizer</span>
                </div>
                <Badge variant="outline">{fertilizer[0]}%</Badge>
              </div>
              <Slider value={fertilizer} onValueChange={setFertilizer} max={100} step={1} className="w-full" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>None (0%)</span>
                <span>Moderate (50%)</span>
                <span>Heavy (100%)</span>
              </div>
              <div className="text-xs text-blue-600">
                Optimal for {selectedProfile}: {PLANT_PROFILES[selectedProfile].fertilizer[0]}%-
                {PLANT_PROFILES[selectedProfile].fertilizer[1]}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Plant Response Analysis
            </CardTitle>
            <CardDescription>Real-time monitoring of your plant's vital signs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Overall Health */}
            <div className={`p-4 rounded-lg ${getHealthBg(plantHealth)} border`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Leaf className={`w-5 h-5 ${getHealthColor(plantHealth)}`} />
                  <span className="font-medium">Overall Health</span>
                </div>
                <span className={`text-2xl font-bold ${getHealthColor(plantHealth)}`}>{plantHealth}%</span>
              </div>
              <Progress value={plantHealth} className="h-3" />
            </div>

            {/* Growth Rate */}
            <div className={`p-3 rounded-lg ${getHealthBg(growthRate)}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-4 h-4 ${getHealthColor(growthRate)}`} />
                  <span className="text-sm font-medium">Growth Rate</span>
                </div>
                <span className={`text-lg font-bold ${getHealthColor(growthRate)}`}>{growthRate}%</span>
              </div>
              <Progress value={growthRate} className="h-2" />
            </div>

            {/* Yield Quality */}
            <div className={`p-3 rounded-lg ${getHealthBg(yieldQuality)}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${getHealthColor(yieldQuality)}`} />
                  <span className="text-sm font-medium">Yield Quality</span>
                </div>
                <span className={`text-lg font-bold ${getHealthColor(yieldQuality)}`}>{yieldQuality}%</span>
              </div>
              <Progress value={yieldQuality} className="h-2" />
            </div>

            {/* Chlorophyll Level */}
            <div className={`p-3 rounded-lg ${getHealthBg(chlorophyllLevel)}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Sun className={`w-4 h-4 ${getHealthColor(chlorophyllLevel)}`} />
                  <span className="text-sm font-medium">Chlorophyll Level</span>
                </div>
                <span className={`text-lg font-bold ${getHealthColor(chlorophyllLevel)}`}>{chlorophyllLevel}%</span>
              </div>
              <Progress value={chlorophyllLevel} className="h-2" />
            </div>

            {/* Root Health */}
            <div className={`p-3 rounded-lg ${getHealthBg(rootHealth)}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Droplets className={`w-4 h-4 ${getHealthColor(rootHealth)}`} />
                  <span className="text-sm font-medium">Root Health</span>
                </div>
                <span className={`text-lg font-bold ${getHealthColor(rootHealth)}`}>{rootHealth}%</span>
              </div>
              <Progress value={rootHealth} className="h-2" />
            </div>

            {/* Plant Visualization */}
            <div className="text-center p-4 bg-gradient-to-b from-blue-50 to-green-50 rounded-lg">
              <div className="text-6xl mb-2">{getPlantEmoji()}</div>
              <p className="text-sm text-gray-600">
                {plantHealth >= 80
                  ? "Thriving and healthy!"
                  : plantHealth >= 60
                    ? "Growing steadily"
                    : plantHealth >= 40
                      ? "Needs attention"
                      : "Critical condition"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Reset Button */}
      <Card className="bg-white/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Simulation Controls</h4>
              <p className="text-sm text-gray-600">Reset or optimize your current settings</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => applyPreset(selectedProfile)}>
                Reset to Optimal
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSunlight([Math.floor(Math.random() * 100)])
                  setWater([Math.floor(Math.random() * 100)])
                  setTemperature([Math.floor(Math.random() * 30) + 10])
                  setFertilizer([Math.floor(Math.random() * 100)])
                }}
              >
                Random Conditions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
