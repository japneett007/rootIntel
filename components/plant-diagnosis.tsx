"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Mic, Upload, Loader2, CheckCircle, AlertTriangle, Droplets, Bug, Leaf, X, MicOff } from "lucide-react"

// Mock plant database for demonstration
const PLANT_DATABASE = [
  {
    keywords: ["yellow", "leaves", "wet", "soggy", "overwater"],
    plant: "Spider Plant (Chlorophytum comosum)",
    condition: "Overwatering",
    confidence: 87,
    symptoms: ["Yellow leaves", "Brown leaf tips", "Soggy soil"],
    treatment: [
      "Reduce watering frequency to once per week",
      "Ensure proper drainage in pot",
      "Remove affected leaves",
      "Place in bright, indirect light",
    ],
    prevention: [
      "Check soil moisture before watering",
      "Use well-draining potting mix",
      "Ensure pot has drainage holes",
    ],
  },
  {
    keywords: ["brown", "crispy", "dry", "edges", "underwater"],
    plant: "Peace Lily (Spathiphyllum)",
    condition: "Underwatering",
    confidence: 82,
    symptoms: ["Brown leaf edges", "Drooping leaves", "Dry soil"],
    treatment: [
      "Water thoroughly until water drains from bottom",
      "Increase watering frequency",
      "Check soil moisture regularly",
      "Increase humidity around plant",
    ],
    prevention: ["Water when top inch of soil feels dry", "Use a moisture meter", "Set watering reminders"],
  },
  {
    keywords: ["spots", "black", "fungal", "mold", "disease"],
    plant: "Rose Bush",
    condition: "Black Spot Fungal Disease",
    confidence: 91,
    symptoms: ["Black spots on leaves", "Yellowing leaves", "Leaf drop"],
    treatment: [
      "Remove affected leaves immediately",
      "Apply organic fungicide",
      "Improve air circulation",
      "Water at soil level, not on leaves",
    ],
    prevention: ["Plant in well-ventilated areas", "Avoid overhead watering", "Regular inspection for early detection"],
  },
]

export default function PlantDiagnosis() {
  const [isListening, setIsListening] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [diagnosis, setDiagnosis] = useState<any>(null)
  const [symptoms, setSymptoms] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  // Check for voice recognition support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      setVoiceSupported(!!SpeechRecognition)

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setSymptoms((prev) => prev + (prev ? " " : "") + transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setError("Voice recognition failed. Please try again or type your symptoms.")
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB.")
      return
    }

    setError(null)
    const reader = new FileReader()

    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setUploadedImage(imageUrl)
      analyzeImage(imageUrl)
    }

    reader.readAsDataURL(file)
  }

  const analyzeImage = (imageUrl: string) => {
    setIsAnalyzing(true)

    // Simulate AI image analysis
    setTimeout(() => {
      // Mock analysis based on random selection for demo
      const randomPlant = PLANT_DATABASE[Math.floor(Math.random() * PLANT_DATABASE.length)]

      setDiagnosis({
        ...randomPlant,
        analysisMethod: "Image Analysis",
        imageUrl: imageUrl,
      })
      setIsAnalyzing(false)
    }, 3000)
  }

  const handleVoiceInput = () => {
    if (!voiceSupported) {
      setError("Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.")
      return
    }

    setError(null)

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      setIsListening(true)
      recognitionRef.current?.start()
    }
  }

  const analyzeSymptomsText = () => {
    if (!symptoms.trim()) return

    setIsAnalyzing(true)
    setError(null)

    setTimeout(() => {
      // Find matching plant based on keywords
      const lowerSymptoms = symptoms.toLowerCase()
      let matchedPlant = PLANT_DATABASE.find((plant) =>
        plant.keywords.some((keyword) => lowerSymptoms.includes(keyword)),
      )

      if (!matchedPlant) {
        // Default fallback
        matchedPlant = {
          plant: "Unknown Plant Species",
          condition: "General Plant Stress",
          confidence: 65,
          symptoms: ["Various symptoms reported"],
          treatment: [
            "Check soil moisture levels",
            "Ensure adequate lighting",
            "Inspect for pests",
            "Consider repotting if needed",
          ],
          prevention: [
            "Regular plant health monitoring",
            "Maintain consistent care routine",
            "Research specific plant needs",
          ],
          keywords: [],
        }
      }

      setDiagnosis({
        ...matchedPlant,
        analysisMethod: "Symptom Analysis",
        userInput: symptoms,
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  const clearImage = () => {
    setUploadedImage(null)
    setDiagnosis(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const clearSymptoms = () => {
    setSymptoms("")
    setDiagnosis(null)
  }

  return (
    <div className="grid gap-6">
      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="absolute right-2 top-2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}

      {/* Paa's Guidance */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">👴</span>
            </div>
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">Paa's Wisdom</h3>
              <p className="text-amber-700">
                "Welcome, young gardener! Show me your plant through the enchanted frame, or whisper its troubles to the
                listening flower. I'll help you understand what your green friend needs."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis Methods */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Upload */}
        <Card className="bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              Enchanted Photo Frame
            </CardTitle>
            <CardDescription>Upload a photo of your plant for AI-powered diagnosis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

            {uploadedImage ? (
              <div className="relative">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded plant"
                  className="w-full h-48 object-cover rounded-lg border-2 border-blue-300"
                />
                <Button variant="destructive" size="sm" onClick={clearImage} className="absolute top-2 right-2">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50/50 cursor-pointer hover:bg-blue-100/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <p className="text-blue-600 mb-4">Drop your plant photo here or click to browse</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </>
                  )}
                </Button>
              </div>
            )}

            <div className="text-xs text-gray-500 text-center">Supported formats: JPG, PNG, WebP • Max size: 5MB</div>
          </CardContent>
        </Card>

        {/* Voice Input */}
        <Card className="bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-green-600" />
              Listening Flower
            </CardTitle>
            <CardDescription>Describe your plant's symptoms using voice or text</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Describe what you notice about your plant... (e.g., 'My plant has yellow leaves and the soil feels very wet')"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="min-h-[100px] pr-10"
              />
              {symptoms && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSymptoms}
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleVoiceInput}
                variant={isListening ? "destructive" : "outline"}
                className={
                  isListening
                    ? "bg-red-500 hover:bg-red-600"
                    : voiceSupported
                      ? "border-green-300 text-green-700 hover:bg-green-50"
                      : "opacity-50 cursor-not-allowed"
                }
                disabled={!voiceSupported}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2 animate-pulse" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    {voiceSupported ? "Start Voice Input" : "Voice Not Supported"}
                  </>
                )}
              </Button>

              <Button onClick={analyzeSymptomsText} disabled={!symptoms.trim() || isAnalyzing} className="flex-1">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Symptoms"
                )}
              </Button>
            </div>

            {isListening && (
              <div className="text-center text-green-600 p-3 bg-green-50 rounded-lg">
                <div className="inline-flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                  <span className="ml-2">Listening... speak now</span>
                </div>
              </div>
            )}

            {!voiceSupported && (
              <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                💡 Voice recognition works best in Chrome, Edge, or Safari browsers
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Diagnosis Results */}
      {diagnosis && (
        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Diagnosis Complete
            </CardTitle>
            <div className="flex items-center gap-4 flex-wrap">
              <Badge className="bg-green-100 text-green-700">{diagnosis.plant}</Badge>
              <Badge variant="outline">{diagnosis.analysisMethod}</Badge>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Confidence:</span>
                <Progress value={diagnosis.confidence} className="w-20" />
                <span className="text-sm font-medium">{diagnosis.confidence}%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Show uploaded image if available */}
            {diagnosis.imageUrl && (
              <div className="flex justify-center">
                <img
                  src={diagnosis.imageUrl || "/placeholder.svg"}
                  alt="Analyzed plant"
                  className="max-w-xs h-32 object-cover rounded-lg border"
                />
              </div>
            )}

            {/* Show user input if text analysis */}
            {diagnosis.userInput && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-1">Your Description:</h4>
                <p className="text-gray-600 text-sm italic">"{diagnosis.userInput}"</p>
              </div>
            )}

            {/* Condition */}
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">Identified Condition</h3>
              </div>
              <p className="text-yellow-700 text-lg font-medium">{diagnosis.condition}</p>
            </div>

            {/* Symptoms */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Bug className="w-5 h-5" />
                Observed Symptoms
              </h3>
              <div className="flex flex-wrap gap-2">
                {diagnosis.symptoms.map((symptom: string, index: number) => (
                  <Badge key={index} variant="outline" className="border-red-300 text-red-700">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Treatment */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-600" />
                Treatment Plan
              </h3>
              <div className="space-y-2">
                {diagnosis.treatment.map((step: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <p className="text-blue-800">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prevention */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Prevention Tips
              </h3>
              <div className="space-y-2">
                {diagnosis.prevention.map((tip: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-green-800">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button className="bg-green-600 hover:bg-green-700">
                <Leaf className="w-4 h-4 mr-2" />
                Save to My Garden
              </Button>
              <Button variant="outline">Share Diagnosis</Button>
              <Button variant="outline" onClick={() => setDiagnosis(null)}>
                New Diagnosis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
