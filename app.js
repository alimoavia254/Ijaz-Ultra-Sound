// Advanced Offline Clinic Management System with Auto-Save Database
// Enhanced with PKR currency and automatic database management

class AdvancedClinicManagement {
  constructor() {
    this.currentUser = null
    this.selectedServices = []
    this.database = {
      isConnected: false,
      name: "Ijaz-Clinic-Auto-Database",
      data: {
        users: [],
        services: [],
        invoices: [],
        systemInfo: {},
      },
      lastSaved: null,
      autoSaveInterval: null,
    }

    this.initializeAutoDatabase()
    this.bindEvents()
    this.startAutoSave()
  }

  // Initialize auto database on startup
  initializeAutoDatabase() {
    try {
      // Check if database exists in localStorage
      const savedData = localStorage.getItem("ijaz_clinic_auto_db")

      if (savedData) {
        // Load existing database
        this.database.data = JSON.parse(savedData)
        this.database.isConnected = true
        this.database.lastSaved = localStorage.getItem("ijaz_clinic_last_saved") || new Date().toISOString()
        this.showNotification("Database loaded successfully! Resuming from where you left off.", "success")
      } else {
        // Create new database with default data
        this.createDefaultDatabase()
        this.saveDatabase()
        this.showNotification("New database created and ready to use!", "success")
      }

      this.updateDatabaseStatus()
      this.updateTotalRecords()
    } catch (error) {
      console.error("Database initialization error:", error)
      this.createDefaultDatabase()
      this.saveDatabase()
    }
  }

  // Create default database structure
  createDefaultDatabase() {
    this.database.data = {
      users: [
        { id: 1, username: "moavia", password: "moavia", role: "user" },
        { id: 2, username: "admin", password: "admin", role: "admin" },
      ],
      services: this.getDefaultServices(),
      invoices: [],
      systemInfo: {
        version: "3.1.0",
        created: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        currency: "PKR",
      },
    }
    this.database.isConnected = true
  }

  // Auto-save database to localStorage
  saveDatabase() {
    try {
      this.showAutoSaveIndicator()

      // Update system info
      this.database.data.systemInfo.lastUpdated = new Date().toISOString()

      // Save to localStorage
      localStorage.setItem("ijaz_clinic_auto_db", JSON.stringify(this.database.data))
      localStorage.setItem("ijaz_clinic_last_saved", new Date().toISOString())

      this.database.lastSaved = new Date().toISOString()
      this.updateDatabaseStatus()
      this.updateTotalRecords()

      setTimeout(() => this.hideAutoSaveIndicator(), 2000)
    } catch (error) {
      console.error("Auto-save error:", error)
      this.showNotification("Auto-save failed: " + error.message, "error")
    }
  }

  // Start automatic saving every 30 seconds
  startAutoSave() {
    this.database.autoSaveInterval = setInterval(() => {
      this.saveDatabase()
    }, 30000) // 30 seconds
  }

  // Save database whenever data changes
  autoSaveOnChange() {
    // Debounce to avoid too frequent saves
    clearTimeout(this.autoSaveTimeout)
    this.autoSaveTimeout = setTimeout(() => {
      this.saveDatabase()
    }, 2000) // 2 seconds after last change
  }

  // Initialize default services with PKR currency
  getDefaultServices() {
    return [
      // X-Ray services
      { id: 1, category: "X-Ray", name: "X ray", price: 500.0 },
      { id: 2, category: "X-Ray", name: "Skull AP/LAT", price: 500.0 },
      { id: 3, category: "X-Ray", name: "FACE AP/LAT", price: 500.0 },
      { id: 4, category: "X-Ray", name: "MANDIBLE P.A VIEW", price: 500.0 },
      { id: 5, category: "X-Ray", name: "SHOULDER AP/LAT", price: 500.0 },
      { id: 6, category: "X-Ray", name: "HUMERUS AP/LAT", price: 500.0 },
      { id: 7, category: "X-Ray", name: "ELBOW JOINT AP/LAT", price: 500.0 },
      { id: 8, category: "X-Ray", name: "RADIUS ULNA AP/LAT", price: 500.0 },
      { id: 9, category: "X-Ray", name: "HAND AP/LAT", price: 500.0 },
      { id: 10, category: "X-Ray", name: "CHEST PA VIEW", price: 500.0 },
      { id: 11, category: "X-Ray", name: "CHEST AP VIEW", price: 500.0 },
      { id: 12, category: "X-Ray", name: "ABDOMEN ERECT/SUPINE", price: 500.0 },
      { id: 13, category: "X-Ray", name: "PELVIS", price: 500.0 },
      { id: 14, category: "X-Ray", name: "FEMUR AP/LAT", price: 500.0 },
      { id: 15, category: "X-Ray", name: "KNEE JOINT AP/LAT", price: 500.0 },
      { id: 16, category: "X-Ray", name: "TIBIA FIBULA AP/LAT", price: 500.0 },
      { id: 17, category: "X-Ray", name: "ANKLE JOINT AP/LAT", price: 500.0 },
      { id: 18, category: "X-Ray", name: "FOOT AP/LAT", price: 500.0 },
      { id: 19, category: "X-Ray", name: "CERVICAL SPINE", price: 500.0 },
      { id: 20, category: "X-Ray", name: "THORACIC SPINE", price: 500.0 },
      { id: 21, category: "X-Ray", name: "LUMBAR SPINE", price: 500.0 },

      // Ultrasound services
      { id: 22, category: "Ultrasound", name: "USG ABDOMEN", price: 800.0 },
      { id: 23, category: "Ultrasound", name: "USG KUB", price: 800.0 },
      { id: 24, category: "Ultrasound", name: "USG UPPER LIMB", price: 800.0 },
      { id: 25, category: "Ultrasound", name: "USG LOWER LIMB", price: 800.0 },
      { id: 26, category: "Ultrasound", name: "CAROTID DOPPLER", price: 800.0 },
      { id: 27, category: "Ultrasound", name: "RENAL ARTERY DOPPLER", price: 800.0 },
      { id: 28, category: "Ultrasound", name: "ANOMALY SCAN", price: 800.0 },
      { id: 29, category: "Ultrasound", name: "OBS SCAN", price: 800.0 },
      { id: 30, category: "Ultrasound", name: "SCROTAL USG", price: 800.0 },
      { id: 31, category: "Ultrasound", name: "USG BREAST", price: 800.0 },
      { id: 32, category: "Ultrasound", name: "USG CHEST", price: 800.0 },
      { id: 33, category: "Ultrasound", name: "USG THYROID", price: 800.0 },
      { id: 34, category: "Ultrasound", name: "USG SWELLING", price: 800.0 },
      { id: 35, category: "Ultrasound", name: "CRANIAL", price: 800.0 },
      { id: 36, category: "Ultrasound", name: "Abdominal Ultrasound", price: 800.0 },
      { id: 37, category: "Ultrasound", name: "Pelvic Ultrasound", price: 800.0 },
      { id: 38, category: "Ultrasound", name: "Obstetric Ultrasound", price: 800.0 },
      { id: 39, category: "Ultrasound", name: "Cardiac Ultrasound", price: 800.0 },
      { id: 40, category: "Ultrasound", name: "Thyroid Ultrasound", price: 800.0 },
      { id: 41, category: "Ultrasound", name: "Breast Ultrasound", price: 800.0 },
      { id: 42, category: "Ultrasound", name: "Musculoskeletal Ultrasound", price: 800.0 },
      { id: 43, category: "Ultrasound", name: "Vascular Ultrasound", price: 800.0 },
      { id: 44, category: "Ultrasound", name: "Transrectal Ultrasound", price: 800.0 },
      { id: 45, category: "Ultrasound", name: "Transvaginal Ultrasound", price: 800.0 },
      { id: 46, category: "Ultrasound", name: "Fetal Ultrasound", price: 800.0 },
      { id: 47, category: "Ultrasound", name: "Testicular Ultrasound", price: 800.0 },

      // Lab Test services
      { id: 48, category: "Lab Test", name: "CBC (Complete Blood Count)", price: 300.0 },
      { id: 49, category: "Lab Test", name: "Blood Sugar Test", price: 300.0 },
      { id: 50, category: "Lab Test", name: "Lipid Profile", price: 300.0 },
      { id: 51, category: "Lab Test", name: "Liver Function Test (LFTs)", price: 300.0 },
      { id: 52, category: "Lab Test", name: "Kidney Function Test (KFTs)", price: 300.0 },
      { id: 53, category: "Lab Test", name: "Thyroid Function Test (TFTs)", price: 300.0 },
      { id: 54, category: "Lab Test", name: "Electrolyte Panel", price: 300.0 },
      { id: 55, category: "Lab Test", name: "Urine Routine Examination (URE)", price: 300.0 },
      { id: 56, category: "Lab Test", name: "Stool Routine Examination (SRE)", price: 300.0 },
      { id: 57, category: "Lab Test", name: "Blood Urea Nitrogen (BUN)", price: 300.0 },
      { id: 58, category: "Lab Test", name: "Creatinine Test", price: 300.0 },
      { id: 59, category: "Lab Test", name: "Uric Acid Test", price: 300.0 },
      { id: 60, category: "Lab Test", name: "Cholesterol Test", price: 300.0 },
      { id: 61, category: "Lab Test", name: "Triglycerides Test", price: 300.0 },
      { id: 62, category: "Lab Test", name: "HDL (High-Density Lipoprotein) Test", price: 300.0 },
      { id: 63, category: "Lab Test", name: "LDL (Low-Density Lipoprotein) Test", price: 300.0 },
      { id: 64, category: "Lab Test", name: "SGPT (Alanine Transaminase) Test", price: 300.0 },
      { id: 65, category: "Lab Test", name: "SGOT (Aspartate Transaminase) Test", price: 300.0 },
      { id: 66, category: "Lab Test", name: "Alkaline Phosphatase Test", price: 300.0 },
      { id: 67, category: "Lab Test", name: "Bilirubin Test", price: 300.0 },
    ]
  }

  // Data access methods with auto-save
  getUsers() {
    return this.database.data.users || []
  }

  setUsers(users) {
    this.database.data.users = users
    this.autoSaveOnChange()
  }

  getServices() {
    return this.database.data.services || []
  }

  setServices(services) {
    this.database.data.services = services
    this.autoSaveOnChange()
  }

  getInvoices() {
    return this.database.data.invoices || []
  }

  setInvoices(invoices) {
    this.database.data.invoices = invoices
    this.autoSaveOnChange()
  }

  getSystemInfo() {
    return this.database.data.systemInfo || {}
  }

  setSystemInfo(info) {
    this.database.data.systemInfo = info
    this.autoSaveOnChange()
  }

  // Update database status displays
  updateDatabaseStatus() {
    const lastSaved = this.database.lastSaved ? new Date(this.database.lastSaved).toLocaleString() : "Just now"

    // Update all last saved displays
    const lastSavedElements = ["lastSavedTime", "adminLastSaved", "settingsLastSaved"]
    lastSavedElements.forEach((id) => {
      const element = document.getElementById(id)
      if (element) element.textContent = lastSaved
    })

    // Update auto-save status
    const autoSaveElements = ["autoSaveStatus", "adminAutoSave", "settingsAutoSave"]
    autoSaveElements.forEach((id) => {
      const element = document.getElementById(id)
      if (element) element.textContent = "Active"
    })
  }

  // Update total records count
  updateTotalRecords() {
    const totalRecords =
      (this.database.data.users?.length || 0) +
      (this.database.data.services?.length || 0) +
      (this.database.data.invoices?.length || 0)

    const recordElements = ["totalRecords", "adminTotalRecords"]
    recordElements.forEach((id) => {
      const element = document.getElementById(id)
      if (element) element.textContent = totalRecords
    })
  }

  // Show/hide auto-save indicator
  showAutoSaveIndicator() {
    const indicators = document.querySelectorAll(".auto-save-indicator")
    indicators.forEach((indicator) => {
      if (indicator) indicator.style.display = "block"
    })
  }

  hideAutoSaveIndicator() {
    const indicators = document.querySelectorAll(".auto-save-indicator")
    indicators.forEach((indicator) => {
      if (indicator) indicator.style.display = "none"
    })
  }

  // Manual save function
  manualSave() {
    this.saveDatabase()
    this.showNotification("Database saved manually!", "success")
  }

  // Create backup
  createBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const backupName = `ijaz-clinic-backup-${timestamp}.json`

      const backupData = {
        ...this.database.data,
        backupInfo: {
          backupDate: new Date().toISOString(),
          version: "3.1.0",
          clinicName: "Ijaz Ultra Sound and Digital X-Ray",
        },
      }

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = backupName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      this.showNotification("Backup created successfully!", "success")
    } catch (error) {
      this.showNotification("Failed to create backup: " + error.message, "error")
    }
  }

  // Export data
  exportData() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const exportName = `ijaz-clinic-export-${timestamp}.json`

      const exportData = {
        ...this.database.data,
        exportInfo: {
          exportDate: new Date().toISOString(),
          version: "3.1.0",
          clinicName: "Ijaz Ultra Sound and Digital X-Ray",
          currency: "PKR",
        },
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = exportName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      this.showNotification("Data exported successfully!", "success")
    } catch (error) {
      this.showNotification("Failed to export data: " + error.message, "error")
    }
  }

  // Clear old data (older than 1 year)
  clearOldData() {
    if (!confirm("Clear invoices older than 1 year? This action cannot be undone.")) {
      return
    }

    try {
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

      const invoices = this.getInvoices()
      const oldCount = invoices.length
      const filteredInvoices = invoices.filter((invoice) => new Date(invoice.createdAt) > oneYearAgo)

      this.setInvoices(filteredInvoices)
      const removedCount = oldCount - filteredInvoices.length

      this.showNotification(`Removed ${removedCount} old invoices. Database optimized!`, "success")
    } catch (error) {
      this.showNotification("Failed to clear old data: " + error.message, "error")
    }
  }

  // Bind event listeners
  bindEvents() {
    // Login form
    const loginForm = document.getElementById("loginForm")
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e))
    }

    // Invoice form
    const invoiceForm = document.getElementById("invoiceForm")
    if (invoiceForm) {
      invoiceForm.addEventListener("submit", (e) => this.handleInvoiceSubmit(e))
    }

    // Change password form
    const changePasswordForm = document.getElementById("changePasswordForm")
    if (changePasswordForm) {
      changePasswordForm.addEventListener("submit", (e) => this.handleChangePassword(e))
    }

    // New user form
    const newUserForm = document.getElementById("newUserForm")
    if (newUserForm) {
      newUserForm.addEventListener("submit", (e) => this.handleAddUser(e))
    }

    // Edit user form
    const editUserForm = document.getElementById("editUserForm")
    if (editUserForm) {
      editUserForm.addEventListener("submit", (e) => this.handleEditUser(e))
    }

    // Auto-save on form input changes
    this.bindAutoSaveEvents()
  }

  // Bind auto-save events to form inputs
  bindAutoSaveEvents() {
    // Auto-save when user types in forms
    document.addEventListener("input", (e) => {
      if (e.target.matches("input, textarea, select")) {
        this.autoSaveOnChange()
      }
    })

    // Auto-save when checkboxes change
    document.addEventListener("change", (e) => {
      if (e.target.matches('input[type="checkbox"], select')) {
        this.autoSaveOnChange()
      }
    })
  }

  // Authentication
  handleLogin(e) {
    e.preventDefault()

    if (!this.database.isConnected) {
      this.showError("Database not connected. Please refresh the page.")
      return
    }

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    const users = this.getUsers()
    const user = users.find((u) => u.username === username && u.password === password)

    if (user) {
      this.currentUser = user
      this.showScreen("dashboardScreen")
      this.updateUserInfo()
      this.hideError()
      this.showNotification("Login successful! Welcome back.", "success")
      this.updateDatabaseStatus()
      this.updateTotalRecords()
    } else {
      this.showError("Invalid credentials")
    }
  }

  logout() {
    this.currentUser = null
    this.selectedServices = []
    this.showScreen("loginScreen")
    document.getElementById("loginForm").reset()
    this.showNotification("Logged out successfully", "success")
  }

  // Password change
  handleChangePassword(e) {
    e.preventDefault()

    const currentPassword = document.getElementById("currentPassword").value
    const newPassword = document.getElementById("newPassword").value
    const confirmPassword = document.getElementById("confirmPassword").value

    if (this.currentUser.password !== currentPassword) {
      this.showNotification("Current password is incorrect", "error")
      return
    }

    if (newPassword !== confirmPassword) {
      this.showNotification("New passwords do not match", "error")
      return
    }

    if (newPassword.length < 4) {
      this.showNotification("Password must be at least 4 characters long", "error")
      return
    }

    // Update password
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === this.currentUser.id)
    if (userIndex !== -1) {
      users[userIndex].password = newPassword
      this.currentUser.password = newPassword
      this.setUsers(users)

      document.getElementById("changePasswordForm").reset()
      this.showNotification("Password changed successfully!", "success")
    }
  }

  // Screen management
  showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active")
    })

    // Show target screen
    document.getElementById(screenId).classList.add("active")

    // Update navigation
    this.updateNavigation(screenId)

    // Load screen-specific data
    if (screenId === "invoiceScreen") {
      this.loadServicesForInvoice()
    } else if (screenId === "adminScreen") {
      this.loadAdminData()
    } else if (screenId === "settingsScreen") {
      this.loadSettingsData()
    } else if (screenId === "priceManagementScreen") {
      this.loadServicePricesStandalone()
    }
  }

  updateNavigation(activeScreen) {
    // Update active nav links
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active")
    })

    // Show/hide admin links based on user role
    if (this.currentUser && this.currentUser.role === "admin") {
      document.querySelectorAll('[id^="adminNavLink"]').forEach((link) => {
        link.style.display = "block"
      })
      document.getElementById("adminCard").style.display = "block"
    }
  }

  updateUserInfo() {
    if (this.currentUser) {
      const userInfoElements = document.querySelectorAll('[id^="userInfo"]')
      userInfoElements.forEach((element) => {
        element.textContent = `${this.currentUser.username} (${this.currentUser.role})`
      })
    }
  }

  // Notification system
  showNotification(message, type = "success") {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  // Error handling
  showError(message) {
    const errorDiv = document.getElementById("error-message")
    if (errorDiv) {
      errorDiv.textContent = message
      errorDiv.style.display = "block"
      setTimeout(() => {
        errorDiv.style.display = "none"
      }, 5000)
    }
  }

  hideError() {
    const errorDiv = document.getElementById("error-message")
    if (errorDiv) {
      errorDiv.style.display = "none"
    }
  }

  // Services management
  loadServicesForInvoice() {
    const services = this.getServices()
    const container = document.getElementById("servicesContainer2")

    if (!container) return

    container.innerHTML = ""

    // Group services by category
    const categories = {}
    services.forEach((service) => {
      if (!categories[service.category]) {
        categories[service.category] = []
      }
      categories[service.category].push(service)
    })

    // Render categories
    Object.keys(categories).forEach((category) => {
      const categoryDiv = document.createElement("div")
      categoryDiv.className = "service-category"
      categoryDiv.innerHTML = `
        <h4>${category}</h4>
        <div class="service-checkboxes">
          ${categories[category]
            .map(
              (service) => `
            <label class="service-checkbox" data-service-name="${service.name.toLowerCase()}">
              <input type="checkbox" value="${service.id}" data-name="${service.name}" data-price="${service.price}" onchange="clinic.updateSelectedServices()">
              <span class="service-label">
                <span class="service-name">${service.name}</span>
                <span class="service-price">PKR ${service.price.toFixed(2)}</span>
                <input type="number" class="service-price-input" value="${service.price}" min="0" step="0.01" onchange="clinic.updateServicePriceInline(${service.id}, this.value)">
              </span>
            </label>
          `,
            )
            .join("")}
        </div>
      `
      container.appendChild(categoryDiv)
    })
  }

  updateServicePriceInline(serviceId, newPrice) {
    const price = Number.parseFloat(newPrice)
    if (isNaN(price) || price < 0) {
      this.showNotification("Please enter a valid price", "error")
      return
    }

    const services = this.getServices()
    const serviceIndex = services.findIndex((s) => s.id === serviceId)

    if (serviceIndex !== -1) {
      services[serviceIndex].price = price
      this.setServices(services)

      // Update the display price
      const checkbox = document.querySelector(`input[value="${serviceId}"]`)
      if (checkbox) {
        checkbox.dataset.price = price
        const priceSpan = checkbox.parentElement.querySelector(".service-price")
        if (priceSpan) {
          priceSpan.textContent = `PKR ${price.toFixed(2)}`
        }
      }

      // Recalculate total if service is selected
      this.updateSelectedServices()
      this.showNotification("Price updated successfully!", "success")
    }
  }

  filterServices() {
    const searchTerm = document.getElementById("serviceSearch").value.toLowerCase()
    const serviceCheckboxes = document.querySelectorAll(".service-checkbox")

    serviceCheckboxes.forEach((checkbox) => {
      const serviceName = checkbox.dataset.serviceName
      if (serviceName.includes(searchTerm)) {
        checkbox.style.display = "flex"
      } else {
        checkbox.style.display = "none"
      }
    })
  }

  updateSelectedServices() {
    const checkboxes = document.querySelectorAll('#servicesContainer2 input[type="checkbox"]:checked')
    this.selectedServices = []
    let total = 0

    checkboxes.forEach((checkbox) => {
      const service = {
        id: Number.parseInt(checkbox.value),
        name: checkbox.dataset.name,
        price: Number.parseFloat(checkbox.dataset.price),
      }
      this.selectedServices.push(service)
      total += service.price
    })

    this.updateInvoiceSummary(total)
  }

  updateInvoiceSummary(total) {
    const summaryDiv = document.getElementById("selectedServices")
    const totalSpan = document.getElementById("totalAmount")

    if (this.selectedServices.length === 0) {
      summaryDiv.innerHTML = "<p>No services selected</p>"
    } else {
      summaryDiv.innerHTML = `
        <h4>Selected Services:</h4>
        <ul>
          ${this.selectedServices
            .map(
              (service) => `
            <li>${service.name} - PKR ${service.price.toFixed(2)}</li>
          `,
            )
            .join("")}
        </ul>
      `
    }

    totalSpan.textContent = total.toFixed(2)
  }

  clearInvoiceForm() {
    document.getElementById("invoiceForm").reset()
    document.querySelectorAll('#servicesContainer2 input[type="checkbox"]').forEach((cb) => (cb.checked = false))
    this.selectedServices = []
    this.updateInvoiceSummary(0)
  }

  // Invoice management
  handleInvoiceSubmit(e) {
    e.preventDefault()

    const patientName = document.getElementById("patientName").value.trim()
    const patientPhone = document.getElementById("patientPhone").value.trim()
    const patientAge = document.getElementById("patientAge").value.trim()
    const patientGender = document.getElementById("patientGender").value
    const patientAddress = document.getElementById("patientAddress").value.trim()

    if (!patientName) {
      this.showNotification("Please enter patient name", "error")
      return
    }

    if (this.selectedServices.length === 0) {
      this.showNotification("Please select at least one service", "error")
      return
    }

    const totalAmount = this.selectedServices.reduce((sum, service) => sum + service.price, 0)
    const invoiceNumber = "INV-" + Date.now()

    const invoice = {
      id: Date.now(),
      invoiceNumber,
      patientName,
      patientPhone,
      patientAge,
      patientGender,
      patientAddress,
      services: [...this.selectedServices],
      totalAmount,
      createdBy: this.currentUser.username,
      createdAt: new Date().toISOString(),
    }

    // Save invoice (auto-saves to database)
    const invoices = this.getInvoices()
    invoices.push(invoice)
    this.setInvoices(invoices)

    this.showNotification("Invoice created and auto-saved successfully!", "success")

    // Ask if user wants to print
    if (confirm("Would you like to print the invoice?")) {
      this.printInvoice(invoice.id)
    }

    this.clearInvoiceForm()
  }

  printInvoice(invoiceId) {
    const invoices = this.getInvoices()
    const invoice = invoices.find((inv) => inv.id === invoiceId)

    if (!invoice) {
      this.showNotification("Invoice not found", "error")
      return
    }

    const printContent = document.getElementById("printContent")
    const invoiceDate = new Date(invoice.createdAt)

    printContent.innerHTML = `
      <div class="invoice-print-header">
        <div class="clinic-name">🏥 Ijaz Ultra Sound and Digital X-Ray</div>
        <div class="clinic-subtitle">Professional Medical Imaging Services</div>
        <div class="clinic-address-print">MAHROZ AARKADE NAZD NISHTER BOOK CENTRE<br>NISHTER ROAD MULTAN</div>
      </div>

      <div class="invoice-info">
        <div class="invoice-details">
          <h3>Invoice Details</h3>
          <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
          <p><strong>Date:</strong> ${invoiceDate.toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${invoiceDate.toLocaleTimeString()}</p>
          <p><strong>Created By:</strong> ${invoice.createdBy}</p>
        </div>
        
        <div class="patient-details">
          <h3>Patient Information</h3>
          <p><strong>Patient Name:</strong> ${invoice.patientName}</p>
          ${invoice.patientPhone ? `<p><strong>Phone:</strong> ${invoice.patientPhone}</p>` : ""}
          ${invoice.patientAge ? `<p><strong>Age:</strong> ${invoice.patientAge}</p>` : ""}
          ${invoice.patientGender ? `<p><strong>Gender:</strong> ${invoice.patientGender}</p>` : ""}
          ${invoice.patientAddress ? `<p><strong>Address:</strong> ${invoice.patientAddress}</p>` : ""}
        </div>
      </div>

      <table class="services-table">
        <thead>
          <tr>
            <th>Service</th>
            <th class="price">Price</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.services
            .map(
              (service) => `
            <tr>
              <td>${service.name}</td>
              <td class="price">PKR ${service.price.toFixed(2)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="invoice-total">
        <div class="total-amount-print">
          Total: PKR ${invoice.totalAmount.toFixed(2)}
        </div>
      </div>

      <div class="invoice-footer">
        <p>Thank you for choosing Ijaz Ultra Sound and Digital X-Ray!</p>
        <p>For any queries, please contact our clinic.</p>
      </div>
    `

    this.showScreen("printScreen")
  }

  // Dashboard functions
  loadRecentInvoices() {
    const invoices = this.getInvoices()
    let userInvoices = invoices

    if (this.currentUser.role !== "admin") {
      userInvoices = invoices.filter((inv) => inv.createdBy === this.currentUser.username)
    }

    const tbody = document.getElementById("invoicesTableBody")
    tbody.innerHTML = ""

    userInvoices.slice(0, 10).forEach((invoice) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${invoice.invoiceNumber}</td>
        <td>${invoice.patientName}</td>
        <td>PKR ${invoice.totalAmount.toFixed(2)}</td>
        <td>${new Date(invoice.createdAt).toLocaleDateString()}</td>
        <td>
          <button onclick="clinic.printInvoice(${invoice.id})" class="btn btn-sm btn-primary">Print</button>
        </td>
      `
      tbody.appendChild(row)
    })

    document.getElementById("recentInvoices").style.display = "block"
    document.getElementById("servicesList").style.display = "none"
  }

  showServices() {
    const services = this.getServices()
    const container = document.getElementById("servicesContainer")
    container.innerHTML = ""

    const categories = {}
    services.forEach((service) => {
      if (!categories[service.category]) {
        categories[service.category] = []
      }
      categories[service.category].push(service)
    })

    Object.keys(categories).forEach((category) => {
      const categoryDiv = document.createElement("div")
      categoryDiv.className = "service-category"
      categoryDiv.innerHTML = `
        <h3>${category}</h3>
        <div class="services-grid">
          ${categories[category]
            .map(
              (service) => `
            <div class="service-item">
              <span class="service-name">${service.name}</span>
              <span class="service-price">PKR ${service.price.toFixed(2)}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      `
      container.appendChild(categoryDiv)
    })

    document.getElementById("servicesList").style.display = "block"
    document.getElementById("recentInvoices").style.display = "none"
  }

  // Admin functions
  loadAdminData() {
    if (this.currentUser.role !== "admin") {
      this.showNotification("Access denied. Admin privileges required.", "error")
      this.showScreen("dashboardScreen")
      return
    }

    this.loadAdminStats()
    this.updateDatabaseStatus()
  }

  showAdminTab(tabName) {
    // Hide all tabs
    document.querySelectorAll(".admin-tab").forEach((tab) => {
      tab.classList.remove("active")
    })

    // Remove active class from all tab buttons
    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.classList.remove("active")
    })

    // Show selected tab
    document.getElementById(tabName + "Tab").classList.add("active")

    // Add active class to clicked button
    event.target.classList.add("active")

    // Load tab-specific data
    if (tabName === "users") {
      this.loadUsers()
    } else if (tabName === "prices") {
      this.loadServicePrices()
    } else if (tabName === "database") {
      this.updateDatabaseStatus()
      this.updateTotalRecords()
    }
  }

  loadAdminStats() {
    const invoices = this.getInvoices()

    const totalInvoices = invoices.length
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)

    const today = new Date().toDateString()
    const todayInvoices = invoices.filter((inv) => new Date(inv.createdAt).toDateString() === today)
    const todayRevenue = todayInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyInvoices = invoices.filter((inv) => {
      const invDate = new Date(inv.createdAt)
      return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear
    })
    const monthlyRevenue = monthlyInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)

    document.getElementById("totalInvoices").textContent = totalInvoices
    document.getElementById("totalRevenue").textContent = `PKR ${totalRevenue.toFixed(2)}`
    document.getElementById("todayRevenue").textContent = `PKR ${todayRevenue.toFixed(2)}`
    document.getElementById("monthlyRevenue").textContent = `PKR ${monthlyRevenue.toFixed(2)}`

    this.loadTopServices()
  }

  loadTopServices() {
    const invoices = this.getInvoices()
    const serviceStats = {}

    invoices.forEach((invoice) => {
      invoice.services.forEach((service) => {
        if (!serviceStats[service.name]) {
          serviceStats[service.name] = {
            name: service.name,
            count: 0,
            revenue: 0,
          }
        }
        serviceStats[service.name].count++
        serviceStats[service.name].revenue += service.price
      })
    })

    const topServices = Object.values(serviceStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const tbody = document.getElementById("topServicesBody")
    tbody.innerHTML = ""

    topServices.forEach((service) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${service.name}</td>
        <td>${service.count}</td>
        <td>PKR ${service.revenue.toFixed(2)}</td>
      `
      tbody.appendChild(row)
    })

    document.getElementById("topServicesContainer").style.display = "block"
  }

  loadAllInvoices() {
    const invoices = this.getInvoices()
    const tbody = document.getElementById("allInvoicesBody")
    tbody.innerHTML = ""

    invoices.forEach((invoice) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${invoice.invoiceNumber}</td>
        <td>${invoice.patientName}</td>
        <td>${invoice.patientPhone || "N/A"}</td>
        <td>PKR ${invoice.totalAmount.toFixed(2)}</td>
        <td>${invoice.createdBy}</td>
        <td>${new Date(invoice.createdAt).toLocaleDateString()}</td>
        <td>
          <button onclick="clinic.printInvoice(${invoice.id})" class="btn btn-sm btn-primary">Print</button>
        </td>
      `
      tbody.appendChild(row)
    })

    document.getElementById("adminInvoicesTable").style.display = "block"
  }

  exportInvoices() {
    const invoices = this.getInvoices()

    if (invoices.length === 0) {
      this.showNotification("No invoices to export", "warning")
      return
    }

    const csvContent = [
      ["Invoice Number", "Patient Name", "Phone", "Age", "Gender", "Address", "Amount (PKR)", "Created By", "Date"],
      ...invoices.map((invoice) => [
        invoice.invoiceNumber,
        invoice.patientName,
        invoice.patientPhone || "",
        invoice.patientAge || "",
        invoice.patientGender || "",
        invoice.patientAddress || "",
        invoice.totalAmount,
        invoice.createdBy,
        new Date(invoice.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `clinic_invoices_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    this.showNotification("Invoices exported successfully!", "success")
  }

  // User Management
  loadUsers() {
    const users = this.getUsers()
    const tbody = document.getElementById("usersTableBody")
    tbody.innerHTML = ""

    users.forEach((user) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td><span class="badge ${user.role === "admin" ? "badge-admin" : "badge-user"}">${user.role}</span></td>
        <td>
          <button onclick="clinic.editUser(${user.id})" class="btn btn-sm btn-primary">Edit</button>
          ${user.id !== this.currentUser.id ? `<button onclick="clinic.deleteUser(${user.id})" class="btn btn-sm btn-danger">Delete</button>` : ""}
        </td>
      `
      tbody.appendChild(row)
    })

    document.getElementById("usersTable").style.display = "block"
  }

  showAddUserForm() {
    document.getElementById("addUserForm").style.display = "block"
  }

  hideAddUserForm() {
    document.getElementById("addUserForm").style.display = "none"
    document.getElementById("newUserForm").reset()
  }

  handleAddUser(e) {
    e.preventDefault()

    const username = document.getElementById("newUsername").value.trim()
    const password = document.getElementById("newPassword").value
    const role = document.getElementById("newRole").value

    if (!username || !password || !role) {
      this.showNotification("All fields are required", "error")
      return
    }

    const users = this.getUsers()

    // Check if username already exists
    if (users.find((u) => u.username === username)) {
      this.showNotification("Username already exists", "error")
      return
    }

    const newUser = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      username,
      password,
      role,
    }

    users.push(newUser)
    this.setUsers(users)

    this.hideAddUserForm()
    this.loadUsers()
    this.showNotification("User added successfully!", "success")
  }

  editUser(userId) {
    const users = this.getUsers()
    const user = users.find((u) => u.id === userId)

    if (!user) {
      this.showNotification("User not found", "error")
      return
    }

    document.getElementById("editUserId").value = user.id
    document.getElementById("editUsername").value = user.username
    document.getElementById("editUserPassword").value = ""
    document.getElementById("editUserRole").value = user.role

    document.getElementById("editUserModal").style.display = "flex"
  }

  closeEditUserModal() {
    document.getElementById("editUserModal").style.display = "none"
    document.getElementById("editUserForm").reset()
  }

  handleEditUser(e) {
    e.preventDefault()

    const userId = Number.parseInt(document.getElementById("editUserId").value)
    const username = document.getElementById("editUsername").value.trim()
    const password = document.getElementById("editUserPassword").value
    const role = document.getElementById("editUserRole").value

    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      this.showNotification("User not found", "error")
      return
    }

    // Check if username already exists (excluding current user)
    if (users.find((u) => u.username === username && u.id !== userId)) {
      this.showNotification("Username already exists", "error")
      return
    }

    users[userIndex].username = username
    users[userIndex].role = role

    if (password) {
      users[userIndex].password = password
    }

    // Update current user if editing self
    if (userId === this.currentUser.id) {
      this.currentUser.username = username
      this.currentUser.role = role
      if (password) {
        this.currentUser.password = password
      }
      this.updateUserInfo()
    }

    this.setUsers(users)

    this.closeEditUserModal()
    this.loadUsers()
    this.showNotification("User updated successfully!", "success")
  }

  deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) {
      return
    }

    const users = this.getUsers()
    const filteredUsers = users.filter((u) => u.id !== userId)

    this.setUsers(filteredUsers)
    this.loadUsers()
    this.showNotification("User deleted successfully!", "success")
  }

  // Price Management
  loadServicePrices() {
    const services = this.getServices()
    const tbody = document.getElementById("servicePricesBody")
    tbody.innerHTML = ""

    services.forEach((service) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${service.name}</td>
        <td>${service.category}</td>
        <td>PKR ${service.price.toFixed(2)}</td>
        <td>
          <input type="number" class="price-input" id="price_${service.id}" value="${service.price}" min="0" step="0.01">
        </td>
        <td>
          <button onclick="clinic.updateServicePrice(${service.id})" class="btn btn-sm btn-primary">Update</button>
        </td>
      `
      tbody.appendChild(row)
    })

    document.getElementById("servicePricesTable").style.display = "block"
  }

  // Standalone Price Management Functions
  loadServicePricesStandalone() {
    const services = this.getServices()
    const tbody = document.getElementById("servicePricesBodyStandalone")
    tbody.innerHTML = ""

    services.forEach((service) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${service.name}</td>
        <td>${service.category}</td>
        <td>PKR ${service.price.toFixed(2)}</td>
        <td>
          <input type="number" class="price-input" id="price_standalone_${service.id}" value="${service.price}" min="0" step="0.01">
        </td>
        <td>
          <button onclick="clinic.updateServicePriceStandalone(${service.id})" class="btn btn-sm btn-primary">Update</button>
        </td>
      `
      tbody.appendChild(row)
    })

    document.getElementById("servicePricesTableStandalone").style.display = "block"
  }

  updateServicePriceStandalone(serviceId) {
    const newPrice = Number.parseFloat(document.getElementById(`price_standalone_${serviceId}`).value)

    if (isNaN(newPrice) || newPrice < 0) {
      this.showNotification("Please enter a valid price", "error")
      return
    }

    const services = this.getServices()
    const serviceIndex = services.findIndex((s) => s.id === serviceId)

    if (serviceIndex !== -1) {
      services[serviceIndex].price = newPrice
      this.setServices(services)
      this.showNotification("Price updated successfully!", "success")

      // Update the current price display
      const row = document.getElementById(`price_standalone_${serviceId}`).closest("tr")
      row.cells[2].textContent = `PKR ${newPrice.toFixed(2)}`
    }
  }

  bulkPriceUpdateStandalone() {
    const percentage = prompt("Enter percentage change (e.g., 10 for +10%, -5 for -5%):")

    if (percentage === null) return

    const change = Number.parseFloat(percentage)
    if (isNaN(change)) {
      this.showNotification("Please enter a valid percentage", "error")
      return
    }

    if (
      !confirm(`Are you sure you want to ${change > 0 ? "increase" : "decrease"} all prices by ${Math.abs(change)}%?`)
    ) {
      return
    }

    const services = this.getServices()
    services.forEach((service) => {
      service.price = Math.round(service.price * (1 + change / 100) * 100) / 100
    })

    this.setServices(services)
    this.loadServicePricesStandalone()
    this.showNotification(`All prices updated by ${change}%!`, "success")
  }

  filterServicesByCategoryStandalone() {
    const category = document.getElementById("categoryFilterStandalone").value
    const rows = document.querySelectorAll("#servicePricesBodyStandalone tr")

    rows.forEach((row) => {
      const categoryCell = row.cells[1].textContent
      if (!category || categoryCell === category) {
        row.style.display = ""
      } else {
        row.style.display = "none"
      }
    })
  }

  filterServicePricesStandalone() {
    const searchTerm = document.getElementById("priceSearchStandalone").value.toLowerCase()
    const rows = document.querySelectorAll("#servicePricesBodyStandalone tr")

    rows.forEach((row) => {
      const serviceName = row.cells[0].textContent.toLowerCase()
      if (serviceName.includes(searchTerm)) {
        row.style.display = ""
      } else {
        row.style.display = "none"
      }
    })
  }

  saveAllPrices() {
    const inputs = document.querySelectorAll('#servicePricesBodyStandalone input[type="number"]')
    let updated = 0

    const services = this.getServices()

    inputs.forEach((input) => {
      const serviceId = Number.parseInt(input.id.replace("price_standalone_", ""))
      const newPrice = Number.parseFloat(input.value)

      if (!isNaN(newPrice) && newPrice >= 0) {
        const serviceIndex = services.findIndex((s) => s.id === serviceId)

        if (serviceIndex !== -1 && services[serviceIndex].price !== newPrice) {
          services[serviceIndex].price = newPrice
          updated++
        }
      }
    })

    if (updated > 0) {
      this.setServices(services)
      this.loadServicePricesStandalone()
      this.showNotification(`${updated} prices updated successfully!`, "success")
    } else {
      this.showNotification("No changes to save", "warning")
    }
  }

  filterServicesByCategory() {
    const category = document.getElementById("categoryFilter").value
    const rows = document.querySelectorAll("#servicePricesBody tr")

    rows.forEach((row) => {
      const categoryCell = row.cells[1].textContent
      if (!category || categoryCell === category) {
        row.style.display = ""
      } else {
        row.style.display = "none"
      }
    })
  }

  filterServicePrices() {
    const searchTerm = document.getElementById("priceSearch").value.toLowerCase()
    const rows = document.querySelectorAll("#servicePricesBody tr")

    rows.forEach((row) => {
      const serviceName = row.cells[0].textContent.toLowerCase()
      if (serviceName.includes(searchTerm)) {
        row.style.display = ""
      } else {
        row.style.display = "none"
      }
    })
  }

  updateServicePrice(serviceId) {
    const newPrice = Number.parseFloat(document.getElementById(`price_${serviceId}`).value)

    if (isNaN(newPrice) || newPrice < 0) {
      this.showNotification("Please enter a valid price", "error")
      return
    }

    const services = this.getServices()
    const serviceIndex = services.findIndex((s) => s.id === serviceId)

    if (serviceIndex !== -1) {
      services[serviceIndex].price = newPrice
      this.setServices(services)
      this.showNotification("Price updated successfully!", "success")
    }
  }

  bulkPriceUpdate() {
    const percentage = prompt("Enter percentage change (e.g., 10 for +10%, -5 for -5%):")

    if (percentage === null) return

    const change = Number.parseFloat(percentage)
    if (isNaN(change)) {
      this.showNotification("Please enter a valid percentage", "error")
      return
    }

    if (
      !confirm(`Are you sure you want to ${change > 0 ? "increase" : "decrease"} all prices by ${Math.abs(change)}%?`)
    ) {
      return
    }

    const services = this.getServices()
    services.forEach((service) => {
      service.price = Math.round(service.price * (1 + change / 100) * 100) / 100
    })

    this.setServices(services)
    this.loadServicePrices()
    this.showNotification(`All prices updated by ${change}%!`, "success")
  }

  // Settings
  loadSettingsData() {
    if (this.currentUser) {
      document.getElementById("currentUsername").textContent = this.currentUser.username
      document.getElementById("currentRole").textContent = this.currentUser.role
    }

    const users = this.getUsers()
    const services = this.getServices()

    document.getElementById("totalUsers").textContent = users.length
    document.getElementById("totalServices").textContent = services.length

    this.updateDatabaseStatus()
  }
}

// Utility functions
function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const button = input.nextElementSibling

  if (input.type === "password") {
    input.type = "text"
    button.textContent = "🙈"
  } else {
    input.type = "password"
    button.textContent = "👁️"
  }
}

// Global functions for HTML onclick events
function showScreen(screenId) {
  clinic.showScreen(screenId)
}

function logout() {
  clinic.logout()
}

function loadRecentInvoices() {
  clinic.loadRecentInvoices()
}

function showServices() {
  clinic.showServices()
}

function loadAllInvoices() {
  clinic.loadAllInvoices()
}

function loadTopServices() {
  clinic.loadTopServices()
}

function exportInvoices() {
  clinic.exportInvoices()
}

function clearInvoiceForm() {
  clinic.clearInvoiceForm()
}

function closePrint() {
  clinic.showScreen("dashboardScreen")
}

function filterServices() {
  clinic.filterServices()
}

function showAdminTab(tabName) {
  clinic.showAdminTab(tabName)
}

function loadUsers() {
  clinic.loadUsers()
}

function showAddUserForm() {
  clinic.showAddUserForm()
}

function hideAddUserForm() {
  clinic.hideAddUserForm()
}

function closeEditUserModal() {
  clinic.closeEditUserModal()
}

function loadServicePrices() {
  clinic.loadServicePrices()
}

function loadServicePricesStandalone() {
  clinic.loadServicePricesStandalone()
}

function filterServicesByCategory() {
  clinic.filterServicesByCategory()
}

function filterServicesByCategoryStandalone() {
  clinic.filterServicesByCategoryStandalone()
}

function filterServicePrices() {
  clinic.filterServicePrices()
}

function filterServicePricesStandalone() {
  clinic.filterServicePricesStandalone()
}

function bulkPriceUpdate() {
  clinic.bulkPriceUpdate()
}

function bulkPriceUpdateStandalone() {
  clinic.bulkPriceUpdateStandalone()
}

function saveAllPrices() {
  clinic.saveAllPrices()
}

function manualSave() {
  clinic.manualSave()
}

function createBackup() {
  clinic.createBackup()
}

function exportData() {
  clinic.exportData()
}

function clearOldData() {
  clinic.clearOldData()
}

// Initialize the application
const clinic = new AdvancedClinicManagement()

// Show login screen on load
document.addEventListener("DOMContentLoaded", () => {
  clinic.showScreen("loginScreen")
})
