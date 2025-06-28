document.addEventListener("DOMContentLoaded", () => {
  class LearningQuests {
    constructor() {
      this.init()
    }

    init() {
      this.setupQuestFilters()
      this.setupQuestActions()
      this.setupModal()
    }

    setupQuestFilters() {
      const categoryButtons = document.querySelectorAll(".category-btn")
      const questCards = document.querySelectorAll(".quest-card")

      categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
          // Remove active class from all buttons
          categoryButtons.forEach((btn) => btn.classList.remove("active"))

          // Add active class to clicked button
          button.classList.add("active")

          const category = button.dataset.category

          // Filter quest cards
          questCards.forEach((card) => {
            if (category === "all" || card.dataset.category === category) {
              card.style.display = "block"
            } else {
              card.style.display = "none"
            }
          })
        })
      })
    }

    setupQuestActions() {
      const questButtons = document.querySelectorAll(".quest-btn")

      questButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const questId = button.dataset.quest
          this.startQuest(questId)
        })
      })
    }

    setupModal() {
      const modal = document.getElementById("quest-modal")
      const closeButtons = document.querySelectorAll(".modal-close")
      const goToTaskBtn = document.getElementById("go-to-task")

      // Close modal events
      closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          modal.classList.add("hidden")
        })
      })

      // Close on backdrop click
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden")
        }
      })

      // Go to task button
      if (goToTaskBtn) {
        goToTaskBtn.addEventListener("click", () => {
          modal.classList.add("hidden")
          this.navigateToTask()
        })
      }
    }

    startQuest(questId) {
      const questInfo = this.getQuestInfo(questId)
      const modal = document.getElementById("quest-modal")
      const modalTitle = document.getElementById("modal-title")
      const modalDescription = document.getElementById("modal-description")

      if (modal && modalTitle && modalDescription && questInfo) {
        modalTitle.textContent = `Quest Started: ${questInfo.title}`
        modalDescription.textContent = questInfo.description

        this.currentQuest = questId
        modal.classList.remove("hidden")

        window.showToast(`Started quest: ${questInfo.title}`, "success")
      }
    }

    getQuestInfo(questId) {
      const quests = {
        "first-diagnosis": {
          title: "First Plant Diagnosis",
          description:
            "Head to the Diagnosis page and upload your first plant photo or describe symptoms to get an AI diagnosis.",
          page: "diagnosis",
        },
        "sunlight-experiment": {
          title: "Sunlight Experiment",
          description:
            "Go to the Simulation Lab and experiment with sunlight levels to find the optimal range for a tropical plant.",
          page: "simulation",
        },
        "heal-blight": {
          title: "Heal the Blight",
          description: "Use the diagnosis tool to identify and treat a plant with fungal blight symptoms.",
          page: "diagnosis",
        },
        "perfect-sunflower": {
          title: "Perfect Sunflower",
          description:
            "In the Simulation Lab, optimize all environmental conditions to achieve maximum health for a sunflower.",
          page: "simulation",
        },
        "frost-recovery": {
          title: "Frost Recovery",
          description:
            "Use the simulation to help a frost-damaged plant recover by adjusting multiple environmental variables.",
          page: "simulation",
        },
        "master-gardener": {
          title: "Master Gardener",
          description:
            "Complete 10 detailed journal entries documenting your plant experiments using the scientific method.",
          page: "journal",
        },
      }

      return quests[questId]
    }

    navigateToTask() {
      if (this.currentQuest) {
        const questInfo = this.getQuestInfo(this.currentQuest)
        if (questInfo && questInfo.page) {
          window.location.href = `/${questInfo.page}`
        }
      }
    }

    async completeQuest(questId) {
      try {
        const response = await window.apiCall("/api/complete-quest", {
          method: "POST",
          body: JSON.stringify({ quest_id: questId }),
        })

        if (response.success) {
          window.showToast("Quest completed! You earned XP and rewards!", "success")

          // Update UI with new user data
          this.updateUserStats(response.user_data)
        }
      } catch (error) {
        console.error("Quest completion failed:", error)
        window.showToast("Failed to complete quest", "error")
      }
    }

    updateUserStats(userData) {
      // Update level and XP displays
      const levelElements = document.querySelectorAll(".stat-label")
      levelElements.forEach((element) => {
        if (element.textContent.includes("Level")) {
          element.textContent = `Level ${userData.level}`
        } else if (element.textContent.includes("XP")) {
          element.textContent = `${userData.xp} XP`
        } else if (element.textContent.includes("Completed")) {
          element.textContent = `${userData.quests_completed} Completed`
        }
      })
    }
  }

  // Initialize when DOM is loaded
  new LearningQuests()
})
