// Global App JavaScript
class RootIntelApp {
  constructor() {
    this.init()
  }

  init() {
    this.setupNavigation()
    this.setupPWA()
    this.setupOfflineDetection()
    this.setupToasts()
  }

  // Navigation
  setupNavigation() {
    const navToggle = document.getElementById("nav-toggle")
    const navMenu = document.getElementById("nav-menu")

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active")
      })

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navMenu.classList.remove("active")
        }
      })
    }
  }

  // PWA Installation
  setupPWA() {
    let deferredPrompt
    const installPrompt = document.getElementById("pwa-install-prompt")
    const installBtn = document.getElementById("pwa-install-btn")
    const dismissBtn = document.getElementById("pwa-dismiss-btn")

    // Listen for beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault()
      deferredPrompt = e

      // Show install prompt after 10 seconds
      setTimeout(() => {
        if (installPrompt && !localStorage.getItem("pwa-dismissed")) {
          installPrompt.classList.remove("hidden")
        }
      }, 10000)
    })

    // Install button click
    if (installBtn) {
      installBtn.addEventListener("click", async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt()
          const { outcome } = await deferredPrompt.userChoice

          if (outcome === "accepted") {
            this.showToast("App installed successfully!", "success")
          }

          deferredPrompt = null
          installPrompt.classList.add("hidden")
        }
      })
    }

    // Dismiss button click
    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => {
        installPrompt.classList.add("hidden")
        localStorage.setItem("pwa-dismissed", "true")
      })
    }
  }

  // Offline Detection
  setupOfflineDetection() {
    const offlineIndicator = document.getElementById("offline-indicator")

    const updateOnlineStatus = () => {
      if (offlineIndicator) {
        if (navigator.onLine) {
          offlineIndicator.classList.add("hidden")
        } else {
          offlineIndicator.classList.remove("hidden")
        }
      }
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)
    updateOnlineStatus()
  }

  // Toast Notifications
  setupToasts() {
    this.toastContainer = document.getElementById("toast-container")
  }

  showToast(message, type = "info", duration = 5000) {
    if (!this.toastContainer) return

    const toast = document.createElement("div")
    toast.className = `toast ${type}`
    toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">
                    ${type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}
                </span>
                <span class="toast-message">${message}</span>
            </div>
        `

    this.toastContainer.appendChild(toast)

    // Auto remove after duration
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, duration)

    // Click to dismiss
    toast.addEventListener("click", () => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    })
  }

  // API Helper
  async apiCall(endpoint, options = {}) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API call failed:", error)
      this.showToast("Network error occurred", "error")
      throw error
    }
  }

  // File Upload Helper
  handleFileUpload(file, maxSize = 5 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No file selected"))
        return
      }

      if (file.size > maxSize) {
        reject(new Error("File too large (max 5MB)"))
        return
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        reject(new Error("Invalid file type"))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsDataURL(file)
    })
  }

  // Loading State Helper
  setLoading(element, isLoading) {
    if (!element) return

    if (isLoading) {
      element.disabled = true
      element.classList.add("loading")
      const originalText = element.textContent
      element.dataset.originalText = originalText
      element.innerHTML = '<span class="loading-spinner"></span> Loading...'
    } else {
      element.disabled = false
      element.classList.remove("loading")
      element.textContent = element.dataset.originalText || "Submit"
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.rootIntelApp = new RootIntelApp()
})

// Global utility functions
window.showToast = (message, type, duration) => {
  if (window.rootIntelApp) {
    window.rootIntelApp.showToast(message, type, duration)
  }
}

window.apiCall = (endpoint, options) => {
  if (window.rootIntelApp) {
    return window.rootIntelApp.apiCall(endpoint, options)
  }
}
