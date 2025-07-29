document.addEventListener("DOMContentLoaded", () => {
  const routinesGrid = document.getElementById("routines-grid")
  const scheduleModal = document.getElementById("schedule-modal")
  const modalRoutineTitle = document.getElementById("modal-routine-title")
  const scheduleTableContainer = document.getElementById("schedule-table-container")
  const closeModalBtn = document.getElementById("close-modal-btn")
  const downloadPdfBtn = document.getElementById("download-pdf-btn")
  const viewSectionABtn = document.getElementById("view-section-a-btn")
  const viewSectionBBtn = document.getElementById("view-section-b-btn")

  let currentRoutineId = null
  let currentRoutineLevel = null
  let currentRoutineTerm = null
  let currentSectionView = "A" // Default to Section A

  // Mock data for all levels and terms
  const levelTermRoutines = [
    { id: 1, level: 1, term: 1, status: "Active", students: 120, courses: 8 },
    { id: 2, level: 1, term: 2, status: "Active", students: 118, courses: 7 },
    { id: 3, level: 2, term: 1, status: "Active", students: 115, courses: 8 },
    { id: 4, level: 2, term: 2, status: "Active", students: 112, courses: 7 },
    { id: 5, level: 3, term: 1, status: "Active", students: 108, courses: 8 },
    { id: 6, level: 3, term: 2, status: "Active", students: 105, courses: 7 },
    { id: 7, level: 4, term: 1, status: "Active", students: 102, courses: 8 },
    { id: 8, level: 4, term: 2, status: "Active", students: 98, courses: 6 },
  ]

  // Mock schedule data for display in modal, now with sections A and B
  const mockScheduleData = {
    timeSlots: [
      { period: 1, time: "8:10 - 9:00" },
      { period: 2, time: "9:00 - 9:50" },
      { period: 3, time: "9:50 - 10:40" },
      { period: 4, time: "11:00 - 11:50" },
      { period: 5, time: "11:50 - 12:40" },
      { period: 6, time: "12:40 - 1:30" },
      { period: 7, time: "2:30 - 3:20" },
      { period: 8, time: "3:20 - 4:10" },
      { period: 9, time: "4:10 - 5:00" },
    ],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
  }

  // Define the base schedule for Section A
  const baseSectionA = {
    Sunday: {
      1: "CSE-313",
      2: "CSE-331",
      4: "CSE-336 Lab",
      5: "CSE-336 Lab",
      6: "CSE-336 Lab",
    },
    Monday: {
      1: "Class Test",
      3: "CSE-335",
      5: "CSE-331",
    },
    Tuesday: {
      2: "CSE-313",
      4: "CSE-331",
      7: "CSE-354 Lab",
      8: "CSE-354 Lab",
    },
    Wednesday: {
      1: "Class Test",
      3: "CSE-335",
      5: "CSE-313",
    },
    Thursday: {
      2: "CSE-331",
      4: "CSE-335",
    },
  }

  // Define the base schedule for Section B
  const baseSectionB = {
    Sunday: {
      1: "CSE-313",
      3: "CSE-331",
      5: "CSE-336 Lab",
      6: "CSE-336 Lab",
    },
    Monday: {
      2: "CSE-335",
      4: "CSE-331",
      6: "Class Test",
    },
    Tuesday: {
      1: "Class Test",
      3: "CSE-313",
      7: "CSE-354 Lab",
      8: "CSE-354 Lab",
    },
    Wednesday: {
      2: "CSE-335",
      4: "CSE-331",
      6: "CSE-313",
    },
    Thursday: {
      1: "Class Test",
      3: "CSE-335",
      5: "CSE-331",
    },
  }

  // Populate routineScheduleData for all IDs
  const routineScheduleData = {}
  for (let i = 1; i <= 8; i++) {
    routineScheduleData[i] = {
      sectionA: { ...baseSectionA }, // Deep copy if content varies per routine, otherwise shallow copy is fine for mock
      sectionB: { ...baseSectionB }, // Deep copy if content varies per routine, otherwise shallow copy is fine for mock
    }
  }

  function renderRoutineCards() {
    let html = ""
    levelTermRoutines.forEach((routine) => {
      const statusBadgeClass = routine.status === "Active" ? "badge-default" : "badge-secondary"
      html += `
                <div class="card" data-id="${routine.id}">
                    <div class="card-header">
                        <h3 class="card-title">Level ${routine.level} Term ${routine.term}</h3>
                    </div>
                    <div class="card-content">
                        <div class="info-row">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                            </svg>
                            ${routine.students} Students
                        </div>
                        <div class="info-row">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9.5a.5.5 0 0 0 1 0V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H16v12a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 2 14.5V2a.5.5 0 0 0-1 0v12a.5.5 0 0 0 1 0V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a.5.5 0 0 0 1 0V2a.5.5 0 0 0-1 0V2H0Zm12 12v-1c0 .552-.448 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v11Z"/>
                            </svg>
                            ${routine.courses} Courses
                        </div>
                        <div class="card-actions">
                            <button class="btn btn-outline view-schedule-btn" data-id="${routine.id}" data-level="${routine.level}" data-term="${routine.term}">View Schedule</button>
                            <button class="btn btn-primary download-pdf-card-btn" id="download-pdf-btn"">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                  <polyline points="7 10 12 15 17 10"/>
                                  <line x1="12" x2="12" y1="15" y2="3"/>
                              </svg>   
                              PDF
                            </button>
                        </div>
                    </div>
                </div>
            `
    })
    routinesGrid.innerHTML = html

    // Add event listeners to the newly created buttons
    document.querySelectorAll(".view-schedule-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation() // Prevent card click from firing
        const id = Number.parseInt(button.dataset.id)
        const level = Number.parseInt(button.dataset.level)
        const term = Number.parseInt(button.dataset.term)
        openScheduleModal(id, level, term)
      })
    })

    document.querySelectorAll(".download-pdf-card-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation() // Prevent card click from firing
        const id = Number.parseInt(button.dataset.id)
        const level = Number.parseInt(button.dataset.level)
        const term = Number.parseInt(button.dataset.term)
        // For card PDF download, default to Section A or a combined view if preferred
        handleDownloadPDF(id, `Level ${level} Term ${term}`, "A")
      })
    })

    // Add event listener for clicking on the card itself
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", (event) => {
        const id = Number.parseInt(card.dataset.id)
        const routine = levelTermRoutines.find((r) => r.id === id)
        if (routine) {
          openScheduleModal(id, routine.level, routine.term)
        }
      })
    })
  }

  function openScheduleModal(id, level, term) {
    currentRoutineId = id
    currentRoutineLevel = level
    currentRoutineTerm = term
    currentSectionView = "A" // Reset to default section A when opening modal

    modalRoutineTitle.textContent = `Level ${level} Term ${term} Schedule (Section ${currentSectionView})`
    renderScheduleTable(currentRoutineId, currentSectionView)
    scheduleModal.classList.add("active")

    // Update PDF download button in modal
    downloadPdfBtn.onclick = () =>
      handleDownloadPDF(currentRoutineId, `Level ${currentRoutineLevel} Term ${currentRoutineTerm}`, currentSectionView)

    // Update active state for section buttons
    updateSectionButtonsActiveState()
  }

  function closeScheduleModal() {
    scheduleModal.classList.remove("active")
  }

  function handleDownloadPDF(id, name, section) {
    alert(
      `Downloading PDF for ${name} - Section ${section} (ID: ${id}). In a real application, this would trigger a server-side PDF generation.`,
    )
    // Mock PDF generation - in real app, this would call an API or use a client-side library
    const link = document.createElement("a")
    link.href = "#" // Replace with actual PDF URL
    link.download = `${name.replace(/\s+/g, "_")}_Section_${section}_Routine.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function renderScheduleTable(routineId, section) {
    const timeSlots = mockScheduleData.timeSlots
    const days = mockScheduleData.days
    const routineDataForSection = routineScheduleData[routineId]?.[`section${section}`] || {}

    const tableHtml = `
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>Day</th>
                        ${timeSlots.map((slot) => `<th><div class="time-slot-text">${slot.time}</div></th>`).join("")}
                    </tr>
                </thead>
                <tbody>
                    ${days
                      .map(
                        (day) => `
                        <tr>
                            <td class="day-cell">${day}</td>
                            ${timeSlots
                              .map((slot) => {
                                const course = routineDataForSection[day]?.[slot.period]
                                let cellContent = `<span class="schedule-cell-empty">-</span>`
                                let cellClass = "default"

                                if (course) {
                                  if (course.includes("Lab")) {
                                    cellClass = "lab"
                                  } else if (course === "Class Test") {
                                    cellClass = "test"
                                  }
                                  cellContent = `<div class="schedule-cell-content ${cellClass}">${course}</div>`
                                }
                                return `<td>${cellContent}</td>`
                              })
                              .join("")}
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        `
    scheduleTableContainer.innerHTML = tableHtml
  }

  function updateSectionButtonsActiveState() {
    viewSectionABtn.classList.remove("btn-primary")
    viewSectionABtn.classList.add("btn-outline")
    viewSectionBBtn.classList.remove("btn-primary")
    viewSectionBBtn.classList.add("btn-outline")

    if (currentSectionView === "A") {
      viewSectionABtn.classList.add("btn-primary")
      viewSectionABtn.classList.remove("btn-outline")
    } else if (currentSectionView === "B") {
      viewSectionBBtn.classList.add("btn-primary")
      viewSectionBBtn.classList.remove("btn-outline")
    }
  }

  // Event Listeners for Modal
  closeModalBtn.addEventListener("click", closeScheduleModal)
  scheduleModal.addEventListener("click", (event) => {
    if (event.target === scheduleModal) {
      closeScheduleModal()
    }
  })

  viewSectionABtn.addEventListener("click", () => {
    if (currentRoutineId) {
      currentSectionView = "A"
      modalRoutineTitle.textContent = `Level ${currentRoutineLevel} Term ${currentRoutineTerm} Schedule (Section ${currentSectionView})`
      renderScheduleTable(currentRoutineId, currentSectionView)
      updateSectionButtonsActiveState()
    }
  })

  viewSectionBBtn.addEventListener("click", () => {
    if (currentRoutineId) {
      currentSectionView = "B"
      modalRoutineTitle.textContent = `Level ${currentRoutineLevel} Term ${currentRoutineTerm} Schedule (Section ${currentSectionView})`
      renderScheduleTable(currentRoutineId, currentSectionView)
      updateSectionButtonsActiveState()
    }
  })

  // Initial render of routine cards
  renderRoutineCards()
})
