// Plant Diagnosis JavaScript
class PlantDiagnosis {
  constructor() {
    this.init()
    this.setupVoiceRecognition()
  }

  init() {
    this.setupImageUpload()
    this.setupVoiceInput()
    this.setupAnalysis()
  }

  setupImageUpload() {
    const uploadArea = document.getElementById("upload-area")
    const imageInput = document.getElementById("image-input")
    const imagePreview = document.getElementById("image-preview")
    const previewImg = document.getElementById("preview-img")
    const removeBtn = document.getElementById("remove-image")

    if (!uploadArea || !imageInput) return

    // Click to upload
    uploadArea.addEventListener("click", () => {
      imageInput.click()
    })

    // Drag and drop
    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault()
      uploadArea.classList.add("drag-over")
    })

    uploadArea.addEventListener("dragleave", () => {
      uploadArea.classList.remove("drag-over")
    })

    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault()
      uploadArea.classList.remove("drag-over")

      const files = e.dataTransfer.files
      if (files.length > 0) {
        this.handleImageFile(files[0])
      }
    })

    // File input change
    imageInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.handleImageFile(e.target.files[0])
      }
    })

    // Remove image
    if (removeBtn) {
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        this.clearImage()
      })
    }
  }

  async handleImageFile(file) {
    try {
      const imageUrl = await window.rootIntelApp.handleFileUpload(file)

      const imagePreview = document.getElementById("image-preview")
      const previewImg = document.getElementById("preview-img")
      const uploadArea = document.getElementById("upload-area")

      if (previewImg && imagePreview && uploadArea) {
        previewImg.src = imageUrl
        imagePreview.classList.remove("hidden")
        uploadArea.querySelector(".upload-content").style.display = "none"

        this.selectedFile = file
        window.showToast("Image uploaded successfully!", "success")
      }
    } catch (error) {
      window.showToast(error.message, "error")
    }
  }

  clearImage() {
    const imagePreview = document.getElementById("image-preview")
    const uploadArea = document.getElementById("upload-area")
    const imageInput = document.getElementById("image-input")

    if (imagePreview && uploadArea && imageInput) {
      imagePreview.classList.add("hidden")
      uploadArea.querySelector(".upload-content").style.display = "block"
      imageInput.value = ""
      this.selectedFile = null
    }
  }

  setupVoiceRecognition() {
    this.recognition = null
    this.isListening = false

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()

      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = "en-US"

      this.recognition.onresult = (event) => {
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }

        if (finalTranscript) {
          const symptomsInput = document.getElementById("symptoms-input")
          if (symptomsInput) {
            symptomsInput.value += (symptomsInput.value ? " " : "") + finalTranscript
          }
        }
      }

      this.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        this.stopListening()
        window.showToast("Voice recognition failed. Please try again.", "error")
      }

      this.recognition.onend = () => {
        this.stopListening()
      }
    }
  }

  setupVoiceInput() {
    const voiceButton = document.getElementById("voice-button")

    if (voiceButton) {
      voiceButton.addEventListener("click", () => {
        if (this.isListening) {
          this.stopListening()
        } else {
          this.startListening()
        }
      })
    }
  }

  startListening() {
    if (!this.recognition) {
      window.showToast("Voice recognition not supported in this browser", "error")
      return
    }

    try {
      this.recognition.start()
      this.isListening = true

      const voiceButton = document.getElementById("voice-button")
      const voiceStatus = document.getElementById("voice-status")

      if (voiceButton) {
        voiceButton.innerHTML = `
                    <span class="voice-icon">🔴</span>
                    <span class="voice-text">Stop Listening</span>
                `
      }

      if (voiceStatus) {
        voiceStatus.classList.remove("hidden")
      }

      window.showToast("Listening... Speak now!", "info")
    } catch (error) {
      console.error("Failed to start voice recognition:", error)
      window.showToast("Failed to start voice recognition", "error")
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }

    this.isListening = false

    const voiceButton = document.getElementById("voice-button")
    const voiceStatus = document.getElementById("voice-status")

    if (voiceButton) {
      voiceButton.innerHTML = `
                <span class="voice-icon">🌸</span>
                <span class="voice-text">Start Voice Input</span>
            `
    }

    if (voiceStatus) {
      voiceStatus.classList.add("hidden")
    }
  }

  setupAnalysis() {
    const analyzeButton = document.getElementById("analyze-button")

    if (analyzeButton) {
      analyzeButton.addEventListener("click", () => {
        this.analyzePlant()
      })
    }
  }

  async analyzePlant() {
    const symptomsInput = document.getElementById("symptoms-input")
    const loadingState = document.getElementById("loading-state")
    const resultsSection = document.getElementById("results-section")
    const analyzeButton = document.getElementById("analyze-button")

    if (!symptomsInput) return

    const symptoms = symptomsInput.value.trim()
    if (!symptoms && !this.selectedFile) {
      window.showToast("Please describe symptoms or upload an image", "error")
      return
    }

    try {
      // Show loading state
      if (loadingState) loadingState.classList.remove("hidden")
      if (resultsSection) resultsSection.classList.add("hidden")
      window.rootIntelApp.setLoading(analyzeButton, true)

      // Prepare form data
      const formData = new FormData()
      formData.append("symptoms", symptoms)
      if (this.selectedFile) {
        formData.append("image", this.selectedFile)
      }

      // Make API call
      const response = await fetch("/api/analyze-plant", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        this.displayResults(result)
        window.showToast("Analysis complete!", "success")
      } else {
        throw new Error(result.error || "Analysis failed")
      }
    } catch (error) {
      console.error("Analysis error:", error)
      window.showToast("Analysis failed. Please try again.", "error")
    } finally {
      // Hide loading state
      if (loadingState) loadingState.classList.add("hidden")
      window.rootIntelApp.setLoading(analyzeButton, false)
    }
  }

  displayResults(result) {
    const resultsSection = document.getElementById("results-section")
    const diagnosisCard = document.getElementById("diagnosis-card")

    if (!resultsSection || !diagnosisCard) return

    const diagnosis = result.diagnosis
    const confidence = diagnosis.confidence || 0

    diagnosisCard.innerHTML = `
            <div class="diagnosis-header">
                <div class="diagnosis-title">
                    <h3>${diagnosis.name}</h3>
                    <div class="confidence-badge">
                        <span class="confidence-text">${confidence}% confident</span>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${confidence}%"></div>
                        </div>
                    </div>
                </div>
                ${result.image_url ? `<img src="${result.image_url}" alt="Plant image" class="diagnosis-image">` : ""}
            </div>

            <div class="diagnosis-content">
                <div class="diagnosis-section">
                    <h4 class="section-title">🔍 Diagnosis</h4>
                    <p class="diagnosis-text">${diagnosis.diagnosis}</p>
                </div>

                <div class="diagnosis-section">
                    <h4 class="section-title">💊 Treatment Plan</h4>
                    <ul class="treatment-list">
                        ${diagnosis.treatment.map((step) => `<li>${step}</li>`).join("")}
                    </ul>
                </div>

                <div class="diagnosis-section">
                    <h4 class="section-title">🛡️ Prevention Tips</h4>
                    <ul class="prevention-list">
                        ${diagnosis.prevention.map((tip) => `<li>${tip}</li>`).join("")}
                    </ul>
                </div>

                <div class="diagnosis-actions">
                    <button class="btn btn-primary" onclick="this.saveDiagnosis('${result.timestamp}')">
                        <span class="btn-icon">💾</span>
                        Save to My Garden
                    </button>
                    <button class="btn btn-secondary" onclick="this.shareDiagnosis()">
                        <span class="btn-icon">📤</span>
                        Share Results
                    </button>
                </div>
            </div>
        `

    resultsSection.classList.remove("hidden")
    resultsSection.scrollIntoView({ behavior: "smooth" })
  }

  saveDiagnosis(timestamp) {
    window.showToast("Diagnosis saved to your garden!", "success")
  }

  shareDiagnosis() {
    if (navigator.share) {
      navigator.share({
        title: "Plant Diagnosis from RootIntel",
        text: "Check out my plant diagnosis results!",
        url: window.location.href,
      })
    } else {
      window.showToast("Sharing not supported on this device", "info")
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PlantDiagnosis()
})
