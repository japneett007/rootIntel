// Plant Journal JavaScript
class PlantJournal {
  constructor() {
    this.init()
  }

  init() {
    this.setupModal()
    this.setupForm()
  }

  setupModal() {
    const addEntryBtn = document.getElementById("add-entry-btn")
    const modal = document.getElementById("entry-modal")
    const closeButtons = document.querySelectorAll(".modal-close")

    // Open modal
    if (addEntryBtn) {
      addEntryBtn.addEventListener("click", () => {
        modal.classList.remove("hidden")
      })
    }

    // Close modal events
    closeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        modal.classList.add("hidden")
        this.resetForm()
      })
    })

    // Close on backdrop click
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden")
          this.resetForm()
        }
      })
    }
  }

  setupForm() {
    const form = document.getElementById("journal-form")

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault()
        this.submitEntry()
      })
    }
  }

  async submitEntry() {
    const hypothesis = document.getElementById("hypothesis").value.trim()
    const action = document.getElementById("action").value.trim()
    const result = document.getElementById("result").value.trim()
    const reflection = document.getElementById("reflection").value.trim()
    const tags = document.getElementById("tags").value.trim()

    // Validation
    if (!hypothesis || !action || !result || !reflection) {
      window.showToast("Please fill in all required fields", "error")
      return
    }

    try {
      const submitBtn = document.querySelector('#journal-form button[type="submit"]')
      window.rootIntelApp.setLoading(submitBtn, true)

      const response = await window.apiCall("/api/add-journal-entry", {
        method: "POST",
        body: JSON.stringify({
          hypothesis,
          action,
          result,
          reflection,
          tags,
        }),
      })

      if (response.success) {
        window.showToast("Journal entry saved successfully!", "success")

        // Close modal and reset form
        document.getElementById("entry-modal").classList.add("hidden")
        this.resetForm()

        // Reload page to show new entry
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    } catch (error) {
      console.error("Failed to save journal entry:", error)
      window.showToast("Failed to save journal entry", "error")
    } finally {
      const submitBtn = document.querySelector('#journal-form button[type="submit"]')
      window.rootIntelApp.setLoading(submitBtn, false)
    }
  }

  resetForm() {
    const form = document.getElementById("journal-form")
    if (form) {
      form.reset()
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PlantJournal()
})
