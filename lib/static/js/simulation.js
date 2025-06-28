document.addEventListener("DOMContentLoaded", () => {
  new PlantSimulation()
})

class PlantSimulation {
  constructor() {
    this.currentPlantType = "tropical"
    this.init()
  }

  init() {
    this.setupControls()
    this.setupPlantTypes()
    this.setupScenarios()
    this.updateSimulation()
  }

  setupControls() {
    const sliders = ["sunlight", "water", "temperature", "fertilizer"]

    sliders.forEach((type) => {
      const slider = document.getElementById(`${type}-slider`)
      const valueDisplay = document.getElementById(`${type}-value`)

      if (slider && valueDisplay) {
        slider.addEventListener("input", (e) => {
          const value = e.target.value
          valueDisplay.textContent = type === "temperature" ? `${value}°C` : `${value}%`
          this.updateSimulation()
        })
      }
    })
  }

  setupPlantTypes() {
    const plantTypeButtons = document.querySelectorAll(".plant-type-btn")

    plantTypeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        plantTypeButtons.forEach((btn) => btn.classList.remove("active"))

        // Add active class to clicked button
        button.classList.add("active")

        // Update current plant type
        this.currentPlantType = button.dataset.type

        // Update plant display
        this.updatePlantDisplay()

        // Update simulation
        this.updateSimulation()
      })
    })
  }

  setupScenarios() {
    const scenarioButtons = document.querySelectorAll(".scenario-btn")

    scenarioButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const scenario = button.dataset.scenario
        this.applyScenario(scenario)
      })
    })
  }

  applyScenario(scenario) {
    const scenarios = {
      desert: { sunlight: 90, water: 25, temperature: 32, fertilizer: 30 },
      rainforest: { sunlight: 40, water: 85, temperature: 26, fertilizer: 60 },
      optimal: { sunlight: 70, water: 60, temperature: 22, fertilizer: 45 },
    }

    const settings = scenarios[scenario]
    if (!settings) return

    // Update sliders
    Object.keys(settings).forEach((key) => {
      const slider = document.getElementById(`${key}-slider`)
      const valueDisplay = document.getElementById(`${key}-value`)

      if (slider && valueDisplay) {
        slider.value = settings[key]
        valueDisplay.textContent = key === "temperature" ? `${settings[key]}°C` : `${settings[key]}%`
      }
    })

    this.updateSimulation()
    window.showToast(`Applied ${scenario} conditions`, "success")
  }

  updatePlantDisplay() {
    const plantEmoji = document.getElementById("plant-emoji")
    const plantTypes = {
      tropical: "🌴",
      desert: "🌵",
      temperate: "🌳",
    }

    if (plantEmoji) {
      plantEmoji.textContent = plantTypes[this.currentPlantType] || "🌱"
    }
  }

  async updateSimulation() {
    try {
      const sunlight = document.getElementById("sunlight-slider")?.value || 50
      const water = document.getElementById("water-slider")?.value || 50
      const temperature = document.getElementById("temperature-slider")?.value || 20
      const fertilizer = document.getElementById("fertilizer-slider")?.value || 50

      const response = await window.apiCall("/api/simulate-plant", {
        method: "POST",
        body: JSON.stringify({
          sunlight: Number.parseInt(sunlight),
          water: Number.parseInt(water),
          temperature: Number.parseInt(temperature),
          fertilizer: Number.parseInt(fertilizer),
          plant_type: this.currentPlantType,
        }),
      })

      if (response.success) {
        this.updateHealthMetrics(response.health)
        this.updateRecommendations(response.recommendations)
        this.updatePlantStatus(response.status)
      }
    } catch (error) {
      console.error("Simulation update failed:", error)
    }
  }

  updateHealthMetrics(health) {
    const metrics = ["growth", "chlorophyll", "root"]

    metrics.forEach((metric) => {
      const metricElement = document.getElementById(`${metric}-metric`)
      const barElement = document.getElementById(`${metric}-bar`)

      const value = health[metric === "root" ? "root_health" : metric] || 0

      if (metricElement) {
        metricElement.textContent = `${value}%`
      }

      if (barElement) {
        barElement.style.width = `${value}%`

        // Color based on health
        if (value >= 80) {
          barElement.style.background = "linear-gradient(90deg, #16a34a, #22c55e)"
        } else if (value >= 50) {
          barElement.style.background = "linear-gradient(90deg, #f59e0b, #fbbf24)"
        } else {
          barElement.style.background = "linear-gradient(90deg, #ef4444, #f87171)"
        }
      }
    })
  }

  updateRecommendations(recommendations) {
    const recommendationsList = document.getElementById("recommendations-list")

    if (recommendationsList && recommendations) {
      recommendationsList.innerHTML = recommendations
        .map(
          (rec) => `
        <div class="recommendation-item">
          <span class="recommendation-icon">💡</span>
          <span class="recommendation-text">${rec}</span>
        </div>
      `,
        )
        .join("")
    }
  }

  updatePlantStatus(status) {
    const plantStatus = document.getElementById("plant-status")
    const plantEmoji = document.getElementById("plant-emoji")

    if (plantStatus) {
      plantStatus.textContent = status

      // Update status color
      plantStatus.className = "plant-status"
      if (status === "Thriving") {
        plantStatus.classList.add("thriving")
      } else if (status === "Struggling") {
        plantStatus.classList.add("struggling")
      } else {
        plantStatus.classList.add("critical")
      }
    }

    // Update plant emoji based on health
    if (plantEmoji) {
      const baseEmoji = plantEmoji.textContent
      if (status === "Critical") {
        plantEmoji.style.filter = "grayscale(100%) brightness(0.7)"
      } else if (status === "Struggling") {
        plantEmoji.style.filter = "grayscale(50%) brightness(0.8)"
      } else {
        plantEmoji.style.filter = "none"
      }
    }
  }
}
