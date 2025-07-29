// Application State
let currentPage = "teacher-schedule"
let currentView = "day"
let currentDate = new Date() // May 22, 2025
let routineToDelete = null
let currentRoutineInfo = null
let currentCourseId = null
let selectedCell = null
let selectedPeriods = []
let currentEditingRoutineId = null // Add this for tracking editing state

let scheduleData=[]

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "teacher-dashboard") {
  fetch(`/api/dashboard`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.json();
    })
    .then(data => {

      scheduleData = data.schedule_data;
      console.log("Teacher schedule loaded:", scheduleData);
      console.log(scheduleData[0]);
      console.log(data);
      renderSchedule();
      // Optionally trigger rendering here
    })
    .catch(error => {
      console.error("Failed to fetch schedule data:", error);
    });
  }
});

// // Sample Data
// const scheduleData = [
//   {
//     id: 1,
//     subject: "Physics",
//     startTime: "9:45 AM",
//     endTime: "11:15 AM",
//     grade: "11",
//     section: "B",
//     location: "Lab 102",
//     color: "purple",
//     days: [1, 3, 4], // Monday, Wednesday, Thursday
//   },
//   {
//     id: 2,
//     subject: "Computer Science",
//     startTime: "11:30 AM",
//     endTime: "1:00 PM",
//     grade: "12",
//     section: "A",
//     location: "Computer Lab",
//     color: "blue",
//     days: [1, 2, 4], // Monday, Tuesday, Thursday
//   },
//   {
//     id: 3,
//     subject: "Chemistry",
//     startTime: "3:45 PM",
//     endTime: "5:15 PM",
//     grade: "11",
//     section: "A",
//     location: "Chemistry Lab",
//     color: "amber",
//     days: [1, 2, 4], // Monday, Tuesday, Thursday
//   },
//   {
//     id: 4,
//     subject: "Mathematics",
//     startTime: "8:00 AM",
//     endTime: "9:30 AM",
//     grade: "10",
//     section: "A",
//     location: "Room 201",
//     color: "purple",
//     days: [1, 3], // Monday, Wednesday
//   },
//   {
//     id: 5,
//     subject: "Biology",
//     startTime: "8:00 AM",
//     endTime: "9:30 AM",
//     grade: "9",
//     section: "B",
//     location: "Room 105",
//     color: "green",
//     days: [2], // Tuesday
//   },
//   {
//     id: 6,
//     subject: "Biology",
//     startTime: "2:00 PM",
//     endTime: "3:30 PM",
//     grade: "9",
//     section: "C",
//     location: "Room 105",
//     color: "green",
//     days: [1, 3], // Monday, Wednesday
//   },
// ]

const routinesData = [
  {
    id: 1,
    title: "Batch 2023",
    status: "Active",
    level: 1,
    term: 1,
    color: "blue",
    icon: "📅",
  },
  {
    id: 2,
    title: "Batch 2022",
    status: "Inactive",
    level: 2,
    term: 1,
    color: "amber",
    icon: "☀",
  },
  {
    id: 3,
    title: "Batch 2021",
    status: "Inactive",
    level: 3,
    term: 2,
    color: "purple",
    icon: "♥",
  },
  {
    id: 4,
    title: "Batch 2023",
    status: "Active",
    level: 2,
    term: 2,
    color: "blue",
    icon: "💡",
  },
  {
    id: 5,
    title: "Batch 2022",
    status: "Active",
    level: 4,
    term: 1,
    color: "green",
    icon: "🧪",
  },
]

const timeSlots = [
  { period: 1, startTime: "8:10", endTime: "9:00" },
  { period: 2, startTime: "9:00", endTime: "9:50" },
  { period: 3, startTime: "9:50", endTime: "10:40" },
  { period: 4, startTime: "11:00", endTime: "11:50" },
  { period: 5, startTime: "11:50", endTime: "12:40" },
  { period: 6, startTime: "12:40", endTime: "1:30" },
  { period: 7, startTime: "2:30", endTime: "3:20" },
  { period: 8, startTime: "3:20", endTime: "4:10" },
  { period: 9, startTime: "4:10", endTime: "5:00" },
]

const days = ["SUN", "MON", "TUE", "WED", "THU"]

const availableTeachers = [
  { id: "t1", name: "Dr. John Smith" },
  { id: "t2", name: "Prof. Sarah Johnson" },
  { id: "t3", name: "Dr. Michael Brown" },
  { id: "t4", name: "Prof. Emily Davis" },
  { id: "t5", name: "Dr. Robert Wilson" },
]

const availableCourses = [
  {
    id: "cse313",
    code: "CSE-313",
    name: "Database Systems",
    credit: 3,
    teachers: [],
    classroom: "",
  },
  {
    id: "cse331",
    code: "CSE-331",
    name: "Software Engineering",
    credit: 3,
    teachers: [],
    classroom: "",
  },
  {
    id: "cse335",
    code: "CSE-335",
    name: "Computer Networks",
    credit: 3,
    teachers: [],
    classroom: "",
  },
  {
    id: "cse336",
    code: "CSE-336",
    name: "Database Lab",
    credit: 1,
    teachers: [],
    classroom: "",
  },
  {
    id: "cse354",
    code: "CSE-354",
    name: "Software Lab",
    credit: 1,
    teachers: [],
    classroom: "",
  },
]

const availableLabRooms = [
  { id: "lab101", name: "Computer Lab 1", type: "computer", capacity: 30 },
  { id: "lab102", name: "Computer Lab 2", type: "computer", capacity: 25 },
  { id: "lab201", name: "Physics Lab", type: "physics", capacity: 20 },
  { id: "lab202", name: "Chemistry Lab", type: "chemistry", capacity: 18 },
  { id: "lab301", name: "Electronics Lab", type: "electronics", capacity: 22 },
  { id: "lab302", name: "Network Lab", type: "network", capacity: 28 },
]

// Track lab room assignments for each time slot
const labRoomAssignments = {
  // Structure: { day: { period: [assignedLabRoomIds] } }
}

let sectionARoutine = {
  SUN: {},
  MON: {},
  TUE: {},
  WED: {},
  THU: {},
}

let sectionBRoutine = {
  SUN: {},
  MON: {},
  TUE: {},
  WED: {},
  THU: {},
}

const mockRoutineData = {
  sectionA: {
    SUN: {
      1: { courseId: "ct", section: "CT" },
      2: { courseId: "cse313", section: "CSE-313" },
      4: {
        courseId: "cse336",
        section: "CSE-336 - Computer Lab 1",
        periodSpan: 3,
        labRoomId: "lab101",
        labRoomName: "Computer Lab 1",
      },
    },
    MON: {
      1: { courseId: "ct", section: "CT" },
      3: { courseId: "cse335", section: "CSE-335" },
      5: { courseId: "cse331", section: "CSE-331" },
    },
    TUE: {
      2: { courseId: "cse313", section: "CSE-313" },
      4: { courseId: "cse331", section: "CSE-331" },
      7: {
        courseId: "cse354",
        section: "CSE-354 - Electronics Lab",
        periodSpan: 2,
        labRoomId: "lab301",
        labRoomName: "Electronics Lab",
      },
    },
    WED: {
      1: { courseId: "ct", section: "CT" },
      3: { courseId: "cse335", section: "CSE-335" },
      5: { courseId: "cse313", section: "CSE-313" },
    },
    THU: {
      2: { courseId: "cse331", section: "CSE-331" },
      4: { courseId: "cse335", section: "CSE-335" },
    },
  },
  sectionB: {
    SUN: {
      1: { courseId: "ct", section: "CT" },
      3: { courseId: "cse313", section: "CSE-313" },
      5: {
        courseId: "cse336",
        section: "CSE-336 - Computer Lab 2",
        periodSpan: 2,
        labRoomId: "lab102",
        labRoomName: "Computer Lab 2",
      },
    },
    MON: {
      2: { courseId: "cse335", section: "CSE-335" },
      4: { courseId: "cse331", section: "CSE-331" },
      6: { courseId: "ct", section: "CT" },
    },
    TUE: {
      1: { courseId: "ct", section: "CT" },
      3: { courseId: "cse313", section: "CSE-313" },
      7: {
        courseId: "cse354",
        section: "CSE-354 - Network Lab",
        periodSpan: 2,
        labRoomId: "lab302",
        labRoomName: "Network Lab",
      },
    },
    WED: {
      2: { courseId: "cse335", section: "CSE-335" },
      4: { courseId: "cse331", section: "CSE-331" },
      6: { courseId: "cse313", section: "CSE-313" },
    },
    THU: {
      1: { courseId: "ct", section: "CT" },
      3: { courseId: "cse335", section: "CSE-335" },
      5: { courseId: "cse331", section: "CSE-331" },
    },
  },
}

// Utility Functions
function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatMonth(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })
}

function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function addWeeks(date, weeks) {
  return addDays(date, weeks * 7)
}

function getStartOfWeek(date) {
  const result = new Date(date)
  const day = result.getDay()
  const diff = result.getDate() - day
  return new Date(result.setDate(diff))
}

function getCourseById(courseId) {
  if (courseId === "ct") return { code: "CT", name: "Class Test" }

  const courses = {
    cse313: { code: "CSE-313", name: "Database Systems" },
    cse331: { code: "CSE-331", name: "Software Engineering" },
    cse335: { code: "CSE-335", name: "Computer Networks" },
    cse336: { code: "CSE-336", name: "Database Lab" },
    cse354: { code: "CSE-354", name: "Software Lab" },
  }

  return courses[courseId] || { code: courseId, name: courseId }
}

function showToast(message) {
  const toast = document.getElementById("toast")
  const toastMessage = document.getElementById("toast-message")

  toastMessage.textContent = message
  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop(); // e.g. 'manage_routine.html'

    document.querySelectorAll(".nav-item").forEach(button => {
      const page = button.getAttribute("data-page");

      if (
        (page === "teacher-schedule" && currentPage === "teacher_schedule.html") ||
        (page === "manage-routines" && currentPage === "manage_routine.html")
      ) {
        button.classList.add("active");
      }
    });
  });

  
// Update header based on context
const titles = {
  "teacher-schedule": "Teacher Schedule",
  "manage-routines": "Manage Routines",
  "course-assignment": "Assign Teachers to Courses",
  "routine-builder": currentEditingRoutineId ? "Edit Routine" : "Routine Builder",
  "routine-view": "Routine View",
  login: "Login",
  signup: "Sign Up",
}

const subtitles = {
  "teacher-schedule": "Thursday, May 22, 2025",
  "manage-routines": "Create, edit, and organize your class routines",
  "course-assignment": "Assign teachers and classrooms to courses",
  "routine-builder": currentEditingRoutineId
    ? "Modify your existing class schedule"
    : "Build your class routine schedule",
  "routine-view": "View and manage routine details",
  login: "Sign in to your account",
  signup: "Create a new account",
}



// Add this function to properly initialize each page
// function initializePage() {
//   const currentPath = window.location.pathname

//   if (currentPath.includes("teacher_schedule.html")) {
//     // Set active navigation
//     document.querySelectorAll(".nav-item").forEach((item) => {
//       item.classList.remove("active")
//       if (item.getAttribute("data-page") === "teacher-schedule") {
//         item.classList.add("active")
//       }
//     })

//     // Initialize view toggle
//     currentView = "day"
//     const dayToggle = document.querySelector('.toggle-btn[data-view="day"]')
//     if (dayToggle) {
//       dayToggle.classList.add("active")
//     }

//     renderSchedule()
//   } else if (currentPath.includes("manage_routine.html")) {
//     // Set active navigation
//     document.querySelectorAll(".nav-item").forEach((item) => {
//       item.classList.remove("active")
//       if (item.getAttribute("data-page") === "manage-routines") {
//         item.classList.add("active")
//       }
//     })

//     renderRoutines()
//   } else if (currentPath.includes("course_assignment.html")) {
//     renderCourseAssignment()
//   } else if (currentPath.includes("routine_builder.html")) {
//     renderRoutineBuilder()
//   } else if (currentPath.includes("routine_view_page.html")) {
//     renderRoutineView()
//   }
// }

// Update the DOMContentLoaded event listener to use the new initialization
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the current page
  // initializePage()

  // Rest of the existing event listeners...
  // if (window.location.pathname.includes("teacher_schedule.html")) {
  //   renderSchedule()
  // } else if (window.location.pathname.includes("manage_routine.html")) {
  //   renderRoutines()
  // } else if (window.location.pathname.includes("course_assignment.html")) {
  //   renderCourseAssignment()
  // } else if (window.location.pathname.includes("routine_builder.html")) {
  //   renderRoutineBuilder()
  // } else if (window.location.pathname.includes("routine_view_page.html")) {
  //   renderRoutineView()
  // }


  // Routine Builder buttons
  const clearRoutineBtn = document.getElementById("clear-routine")
  const autoGenerateBtn = document.getElementById("auto-generate")
  const saveRoutineBtn = document.getElementById("save-routine")

  if (clearRoutineBtn) {
    clearRoutineBtn.addEventListener("click", clearAllRoutines)
  }

  if (autoGenerateBtn) {
    autoGenerateBtn.addEventListener("click", autoGenerateRoutine)
  }

  if (saveRoutineBtn) {
    saveRoutineBtn.addEventListener("click", saveRoutine)
  }
})

// Schedule Functions
function renderSchedule() {
  const content = document.getElementById("schedule-content")

  if (currentView === "day") {
    renderDayView(content)
  } else {
    renderWeekView(content)
  }

  // Update date display
  const currentDateElement = document.querySelector(".current-date")
  if (currentDateElement) {
    currentDateElement.textContent = formatMonth(currentDate)
  }
}

function renderDayView(container) {
  const dayOfWeek = currentDate.getDay()
  const todaySchedule = scheduleData.filter((item) => item.days.includes(dayOfWeek))

  let html = `
  <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1.5rem;">
    ${formatDate(currentDate)}
  </h3>
  
  <div style="margin-bottom: 2rem;">
`

  if (todaySchedule.length === 0) {
    html += `
    <div style="text-align: center; padding: 2rem; color: #64748b;">
      No classes scheduled for this day.
    </div>
  `
  } else {
    todaySchedule.forEach((item) => {
      html += createScheduleCard(item)
    })
  }

  html += `</div>`

  container.innerHTML = html
}

function renderWeekView(container) {
  const weekStart = getStartOfWeek(currentDate)
  const weekDates = []

  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i)
    weekDates.push({
      date,
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
    })
  }

  let html = `
  <div class="weekly-table">
    <table>
      <thead>
        <tr>
          <th>Time</th>
`

  weekDates.forEach((day) => {
    html += `
    <th>
      <div>${day.dayName}</div>
      <div>${day.dayNumber}</div>
    </th>
  `
  })

  html += `
        </tr>
      </thead>
      <tbody>
`

  const timeSlots = [
    { time: "8:10 AM", value: 8.166 },
    { time: "9:00 AM", value: 9 },
    { time: "9:50 AM", value: 9.83 },
    { time: "11:00 AM", value: 11 },
    { time: "11:50 AM", value: 11.83 },
    { time: "12:40 PM", value: 12.66 },
    { time: "2:30 PM", value: 14.5 },
    { time: "3:20 PM", value: 15.33 },
    { time: "4:10 PM", value: 16.16 }
  ];

  timeSlots.forEach((slot) => {
    html += `<tr><td style="text-align: left; font-weight: 600;">${slot.time}</td>`

    weekDates.forEach((day, dayIndex) => {
      const classes = getClassesForDayAndTime(dayIndex, slot.value)
      html += `<td>`

      classes.forEach((classItem) => {
        html += createWeeklyClassCard(classItem)
      })

      html += `</td>`
    })

    html += `</tr>`
  })

  html += `
      </tbody>
    </table>
  </div>
`

  container.innerHTML = html
}

function createScheduleCard(item) {
  return `
  <div class="schedule-card ${item.color}">
    <div class="schedule-card-content">
      <div class="schedule-info">
        <div class="time-badge ${item.color}">
          ${item.startTime} - ${item.endTime}
        </div>
        <h4 class="subject-title">${item.subject}</h4>
        <p class="subject-details">Batch ${item.grade} - Section ${item.section}</p>
        <div class="location-info">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>${item.location}</span>
        </div>
      </div>
      <button class="edit-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
    </div>
  </div>
`
}

// function createWeeklyClassCard(item) {
//   return `
//   <div class="weekly-class ${item.color}">
//     <div class="class-name">${item.subject}</div>
//     <div class="class-time">${item.startTime} - ${item.endTime}</div>
//     <div class="class-section">Grade ${item.grade}-${item.section}</div>
//   </div>
// `
// }

// function getClassesForDayAndTime(day, timeValue) {
//   return scheduleData.filter((item) => {
//     const startHour = Number.parseInt(item.startTime.split(":")[0])
//     const isPM = item.startTime.includes("PM")
//     const adjustedHour = isPM && startHour !== 12 ? startHour + 12 : startHour

//     return item.days.includes(day) && Math.abs(adjustedHour - timeValue) < 0.5
//   })
// }

// function getClassesForDayAndTime(day, timeValue) {
//   return scheduleData.filter(item => {
//     if (!item.startTime) return false;
//     const [timeStr, meridian] = item.startTime.split(" ");
//     const [hour, minute] = timeStr.split(":").map(Number);
//     let hourFraction = hour + (minute / 60);
//     if (meridian === "PM" && hour !== 12) hourFraction += 12;
//     if (meridian === "AM" && hour === 12) hourFraction = 0;

//     return item.days.includes(day) && Math.abs(hourFraction - timeValue) < 0.25;
//   });
// }


// function getClassesForDayAndTime(day, timeValue) {
//   return scheduleData.filter(item => {
//     if (!item.startTime) return false;

//     const [timeStr, meridian] = item.startTime.split(" ");
//     const [hour, minute] = timeStr.split(":").map(Number);
//     let hourFraction = hour + (minute / 60);
//     if (meridian === "PM" && hour !== 12) hourFraction += 12;
//     if (meridian === "AM" && hour === 12) hourFraction = 0;

//     return item.days.includes(day) && Math.abs(hourFraction - timeValue) < 0.25;
//   });
// }

function getClassesForDayAndTime(day, timeValue) {
  return scheduleData.filter(item => {
    if (!item.startTime) return false;

    const [timeStr, meridian] = item.startTime.split(" ");
    const [hour, minute] = timeStr.split(":").map(Number);
    let hourDecimal = hour + (minute / 60);
    if (meridian === "PM" && hour !== 12) hourDecimal += 12;
    if (meridian === "AM" && hour === 12) hourDecimal = 0;

    return item.days.includes(day) && Math.abs(hourDecimal - timeValue) < 0.25;
  });
}


function createWeeklyClassCard(item) {
  return `
    <div class="weekly-class ${item.color}">
      <div class="class-name">${item.subject}</div>
      <div class="class-time">${item.startTime} - ${item.endTime}</div>
      <div class="class-section">Batch ${item.grade} - Section ${item.section}</div>
    </div>
  `;
}



// Routines Functions
function renderRoutines() {
  const grid = document.getElementById("routines-grid")

  let html = `
  <div class="create-routine-card" onclick="openCreateModal()">
    <div class="create-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </div>
    <h3 class="create-title">Create New Routine</h3>
    <p class="create-description">Set up a new class schedule or special event</p>
    <button class="btn btn-primary">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Create Routine
    </button>
  </div>
`

  routinesData.forEach((routine) => {
    html += createRoutineCard(routine)
  })

  grid.innerHTML = html
}

function createRoutineCard(routine) {
  return `
  <div class="routine-card ${routine.color}">
    <div class="routine-card-content">
      <div class="routine-card-header">
        <div class="routine-status-editable">
          <span 
            class="status-display ${routine.status.toLowerCase()}" 
            onclick="toggleStatusEdit(${routine.id}, this)"
            data-status="${routine.status}"
          >
            ${routine.status}
          </span>
          <select 
            class="status-edit-select" 
            style="display: none;"
            onchange="updateRoutineStatusFromEdit(${routine.id}, this.value, this)"
            onblur="hideStatusEdit(this)"
          >
            <option value="Active" ${routine.status === "Active" ? "selected" : ""}>Active</option>
            <option value="Inactive" ${routine.status === "Inactive" ? "selected" : ""}>Inactive</option>
          </select>
        </div>
        <div class="routine-icon ${routine.color}">
          ${routine.icon}
        </div>
      </div>
      <h3 class="routine-title">${routine.title}</h3>
      <div class="routine-details">
        <div class="routine-detail">Level - ${routine.level}</div>
        <div class="routine-detail">Term - ${routine.term}</div>
      </div>
    </div>
    <div class="routine-actions">
      <button class="action-btn" onclick="viewRoutine(${routine.id})">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        View
      </button>
      <button class="action-btn" onclick="editRoutine(${routine.id})">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Edit
      </button>
      <button class="action-btn" onclick="deleteRoutine(${routine.id}, '${routine.title}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="3,6 5,6 21,6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
        Delete
      </button>
    </div>
  </div>
`
}

function toggleStatusEdit(routineId, statusElement) {
  const selectElement = statusElement.nextElementSibling
  statusElement.style.display = "none"
  selectElement.style.display = "inline-block"
  selectElement.focus()
}

function updateRoutineStatusFromEdit(routineId, newStatus, selectElement) {
  const routineIndex = routinesData.findIndex((r) => r.id === routineId)
  if (routineIndex !== -1) {
    routinesData[routineIndex].status = newStatus

    // Update the display element
    const statusDisplay = selectElement.previousElementSibling
    statusDisplay.textContent = newStatus
    statusDisplay.setAttribute("data-status", newStatus)
    statusDisplay.className = `status-display ${newStatus.toLowerCase()}`

    // Hide select and show display
    selectElement.style.display = "none"
    statusDisplay.style.display = "inline-block"

    showToast(`Routine status updated to ${newStatus}`)
  }
}

function hideStatusEdit(selectElement) {
  const statusDisplay = selectElement.previousElementSibling
  selectElement.style.display = "none"
  statusDisplay.style.display = "inline-block"
}

document.getElementById("save-create")?.addEventListener("click", () => {
  const batch = document.getElementById("batch").value
  const level = document.getElementById("level").value
  const term = document.getElementById("term").value

  if (!batch || !level || !term) {
    alert("Please fill in all fields.")
    return
  }

  const currentRoutineInfo = {
    batch,
    level,
    term,
  }

  // Store routine info and default availableCourses in localStorage
  localStorage.setItem("currentRoutineInfo", JSON.stringify(currentRoutineInfo))
  localStorage.setItem("availableCourses", JSON.stringify(availableCourses)) // Use the actual availableCourses

  // Redirect after saving
  window.location.href = "course_assignment.html"
})

// Course Assignment Functions
function renderCourseAssignment() {
  const currentRoutineInfo = JSON.parse(localStorage.getItem("currentRoutineInfo"))
  const storedCourses = JSON.parse(localStorage.getItem("availableCourses")) || availableCourses

  if (!currentRoutineInfo) return

  // Update subtitle
  const subtitleElement = document.getElementById("course-assignment-subtitle")
  if (subtitleElement) {
    subtitleElement.textContent = `${currentRoutineInfo.batch} | Level ${currentRoutineInfo.level} | Term ${currentRoutineInfo.term}`
  }

  const tableBody = document.getElementById("course-assignment-table")
  if (!tableBody) return

  let html = ""
  storedCourses.forEach((course) => {
    html += `
    <tr>
      <td>
        <div class="course-info">
          <div class="course-code">${course.code}</div>
          <div class="course-name">${course.name}</div>
          <div class="course-credit">Credit: ${course.credit}</div>
        </div>
      </td>
      <td>
        <div class="teacher-list" id="teacher-list-${course.id}">
          ${course.teachers
            .map(
              (teacher) => `
            <div class="teacher-tag">
              <span>${teacher.name}</span>
              <span class="remove-teacher" onclick="removeTeacher('${course.id}', '${teacher.id}')">×</span>
            </div>
          `,
            )
            .join("")}
        </div>
        <button class="assign-teacher-btn" onclick="openTeacherModal('${course.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 16px; height: 16px;">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Assign Teacher
        </button>
      </td>
      <td>
        <input 
          type="text" 
          class="classroom-input" 
          placeholder="e.g., Room 101"
          value="${course.classroom}"
          onchange="updateClassroom('${course.id}', this.value)"
        />
      </td>
    </tr>
  `
  })

  tableBody.innerHTML = html
}

function openTeacherModal(courseId) {
  currentCourseId = courseId
  const modal = document.getElementById("teacher-assignment-modal")
  const teacherList = document.getElementById("teacher-list")
  const assignmentInfo = document.getElementById("assignment-info")

  const storedCourses = JSON.parse(localStorage.getItem("availableCourses")) || availableCourses
  const course = storedCourses.find((c) => c.id === courseId)

  if (course && assignmentInfo) {
    assignmentInfo.innerHTML = `
    <p>Assign teacher to <strong>${course.code} - ${course.name}</strong></p>
  `
  }

  let html = ""
  availableTeachers.forEach((teacher) => {
    const isAssigned = course && course.teachers.some((t) => t.id === teacher.id)

    html += `
    <div class="teacher-item">
      <span class="teacher-name">${teacher.name}</span>
      <button 
        class="assign-btn ${isAssigned ? "assigned" : ""}" 
        onclick="assignTeacher('${teacher.id}')"
        ${isAssigned ? "disabled" : ""}
      >
        ${isAssigned ? "✓ Assigned" : "Assign"}
      </button>
    </div>
  `
  })

  if (teacherList) {
    teacherList.innerHTML = html
  }

  if (modal) {
    modal.classList.add("active")
  }
}

function assignTeacher(teacherId) {
  if (!currentCourseId) return

  const teacher = availableTeachers.find((t) => t.id === teacherId)
  const storedCourses = JSON.parse(localStorage.getItem("availableCourses")) || availableCourses
  const courseIndex = storedCourses.findIndex((c) => c.id === currentCourseId)

  if (teacher && courseIndex !== -1) {
    // Check if teacher is already assigned
    if (!storedCourses[courseIndex].teachers.some((t) => t.id === teacherId)) {
      storedCourses[courseIndex].teachers.push(teacher)
      localStorage.setItem("availableCourses", JSON.stringify(storedCourses))
      renderCourseAssignment()
      openTeacherModal(currentCourseId) // Refresh modal
      showToast("Teacher assigned successfully!")
    }
  }
}

function removeTeacher(courseId, teacherId) {
  const storedCourses = JSON.parse(localStorage.getItem("availableCourses")) || availableCourses
  const courseIndex = storedCourses.findIndex((c) => c.id === courseId)
  if (courseIndex !== -1) {
    storedCourses[courseIndex].teachers = storedCourses[courseIndex].teachers.filter((t) => t.id !== teacherId)
    localStorage.setItem("availableCourses", JSON.stringify(storedCourses))
    renderCourseAssignment()
    showToast("Teacher removed successfully!")
  }
}

function updateClassroom(courseId, classroom) {
  const storedCourses = JSON.parse(localStorage.getItem("availableCourses")) || availableCourses
  const courseIndex = storedCourses.findIndex((c) => c.id === courseId)
  if (courseIndex !== -1) {
    storedCourses[courseIndex].classroom = classroom
    localStorage.setItem("availableCourses", JSON.stringify(storedCourses))
    showToast("Classroom updated!")
  }
}

function saveCourseAssignments() {
  showToast("Course assignments saved successfully!")
  window.location.href = "routine_builder.html"
}

// Routine Builder Functions
function renderRoutineBuilder() {
  // Get current routine info from localStorage or use default
  const storedRoutineInfo = JSON.parse(localStorage.getItem("currentRoutineInfo"))
  if (storedRoutineInfo) {
    currentRoutineInfo = storedRoutineInfo
  }

  if (!currentRoutineInfo) {
    // Set default routine info if none exists
    currentRoutineInfo = {
      batch: "Batch 2023",
      level: "1",
      term: "1",
      courses: availableCourses,
    }
  }

  // Update subtitle
  const subtitleElement = document.getElementById("routine-builder-subtitle")
  if (subtitleElement) {
    subtitleElement.textContent = `${currentRoutineInfo.batch} | Level ${currentRoutineInfo.level} | Term ${currentRoutineInfo.term}`
  }

  // Load existing routine data if editing
  if (currentEditingRoutineId) {
    loadRoutineForEditing(currentEditingRoutineId)
  }

  // Render both section tables
  renderSectionTable("section-a-table", sectionARoutine)
  renderSectionTable("section-b-table", sectionBRoutine)
}

function renderCourseOptions() {
  const container = document.getElementById("course-options")
  if (!container) return

  let html = `
  <div class="course-option" onclick="assignCourse('ct', 'CT')">
    <div class="course-option-code">CT</div>
    <div class="course-option-name">Class Test</div>
  </div>
`

  if (currentRoutineInfo && currentRoutineInfo.courses) {
    currentRoutineInfo.courses.forEach((course) => {
      // Check if this is a lab course
      const isLabCourse =
        course.name.toLowerCase().includes("lab") || course.code.toLowerCase().includes("lab") || course.credit === 1

      if (isLabCourse) {
        // For lab courses, show course option with lab room dropdown
        const availableRooms = getAvailableLabRooms()

        html += `
        <div class="course-option has-lab-dropdown">
          <div class="course-option-code">${course.code}</div>
          <div class="course-option-name">${course.name}</div>
          <select class="lab-room-dropdown-simple" onchange="assignCourseWithLabRoomFromDropdown('${
            course.id
          }', '${course.code}', this)" onclick="event.stopPropagation()">
            <option value="">-- Select Lab Room --</option>
            ${availableRooms
              .map(
                (room) =>
                  `<option value="${room.id}" data-name="${room.name}">${room.name} (${
                    room.type.charAt(0).toUpperCase() + room.type.slice(1)
                  } Lab - Capacity: ${room.capacity})</option>`,
              )
              .join("")}
          </select>
        </div>
      `
      } else {
        // Regular course option
        html += `
        <div class="course-option" onclick="assignCourse('${course.id}', '${course.code}')">
          <div class="course-option-code">${course.code}</div>
          <div class="course-option-name">${course.name}</div>
        </div>
      `

        // Add section variations for regular courses
        ;["A1", "A2", "B1", "B2"].forEach((sectionSuffix) => {
          html += `
          <div class="course-option" onclick="assignCourse('${course.id}', '${course.code}(${sectionSuffix})')">
            <div class="course-option-code">${course.code}(${sectionSuffix})</div>
            <div class="course-option-name">${course.name} - Section ${sectionSuffix}</div>
          </div>
        `
        })
      }
    })
  }

  container.innerHTML = html
}

function renderSectionTable(tableId, routineData) {
  const table = document.getElementById(tableId)
  if (!table) return

  let html = `
  <thead>
    <tr>
      <th>Day</th>
      ${timeSlots
        .map(
          (slot) => `
        <th style="font-size: 0.75rem;">
          ${slot.startTime}<br/>to<br/>${slot.endTime}
        </th>
      `,
        )
        .join("")}
    </tr>
  </thead>
  <tbody>
`

  days.forEach((day) => {
    html += `<tr>`
    html += `<td class="day-header">${day}</td>`

    timeSlots.forEach((slot) => {
      const period = slot.period
      const cell = routineData[day]?.[period]
      const section = tableId.includes("section-a") ? "A" : "B"

      // Skip rendering if this is part of a multi-period class but not the first period
      if (cell && cell.section === "occupied") {
        return
      }

      // Calculate colspan for multi-period classes
      const colSpan = cell?.periodSpan || 1

      html += `
      <td 
        colspan="${colSpan}" 
        class="routine-cell ${cell ? "occupied" : ""} ${getCellClass(cell)}"
        onclick="openCourseModal('${section}', '${day}', ${period})"
      >
    `

      if (cell && cell.courseId) {
        html += `
        <div class="course-info">
          <div class="course-code">${cell.section}</div>
          ${
            cell.periodSpan && cell.periodSpan > 1
              ? `<div class="period-span-badge">${cell.periodSpan} periods</div>`
              : ""
          }
          <button class="remove-course" onclick="event.stopPropagation(); removeCourse(event, '${section}', '${day}', ${period})" title="Remove course">&times;</button>
        </div>
      `
      } else {
        html += `
        <div class="empty-cell">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
      `
      }

      html += `</td>`
    })

    html += `</tr>`
  })

  html += `</tbody>`
  table.innerHTML = html
}

function getCellClass(cell) {
  if (!cell || !cell.courseId) return ""

  if (cell.courseId === "ct") return "test"
  if (cell.labRoomId || cell.section?.includes("Lab") || (cell.periodSpan && cell.periodSpan > 1)) return "lab"
  return ""
}

function openCourseModal(section, day, period) {
  selectedCell = { section, day, period }
  selectedPeriods = [period]

  const modal = document.getElementById("course-assignment-modal")
  const assignmentInfo = document.getElementById("assignment-info")
  const timeSlot = timeSlots.find((ts) => ts.period === period)

  if (assignmentInfo) {
    assignmentInfo.innerHTML = `
    <p>Assigning course for Section ${section}, ${day}, Period ${period}</p>
    <p><strong>Time:</strong> ${timeSlot.startTime} - ${timeSlot.endTime}</p>
  `
  }

  // Render period checkboxes
  renderPeriodCheckboxes(section, day, period)

  // Render course options
  renderCourseOptions()

  if (modal) {
    modal.classList.add("active")
  }
}

function renderPeriodCheckboxes(section, day, startPeriod) {
  const container = document.getElementById("period-checkboxes")
  if (!container) return

  const routineData = section === "A" ? sectionARoutine : sectionBRoutine

  let html = ""

  // Find consecutive available periods
  for (let i = 0; i < 3; i++) {
    const period = startPeriod + i
    const timeSlot = timeSlots.find((ts) => ts.period === period)

    if (!timeSlot || (routineData[day] && routineData[day][period])) {
      break
    }

    const isChecked = selectedPeriods.includes(period)

    html += `
    <div class="period-checkbox">
      <input 
        type="checkbox" 
        id="period-${period}" 
        ${isChecked ? "checked" : ""}
        onchange="togglePeriodSelection(${period})"
      />
      <label for="period-${period}">
        Period ${period} (${timeSlot.startTime} - ${timeSlot.endTime})
      </label>
    </div>
  `
  }

  if (selectedPeriods.length > 1) {
    html += `
    <div class="selected-periods-info">
      Selected ${selectedPeriods.length} periods: ${selectedPeriods.join(", ")}
    </div>
  `
  }

  container.innerHTML = html
}

function togglePeriodSelection(period) {
  if (selectedPeriods.includes(period)) {
    selectedPeriods = selectedPeriods.filter((p) => p !== period)
  } else {
    selectedPeriods = [...selectedPeriods, period].sort((a, b) => a - b)
  }

  // Re-render checkboxes to update display
  if (selectedCell) {
    renderPeriodCheckboxes(selectedCell.section, selectedCell.day, selectedCell.period)
  }
}

function assignCourseWithLabRoomFromDropdown(courseId, courseCode, selectElement) {
  const selectedOption = selectElement.options[selectElement.selectedIndex]

  if (!selectedOption.value) {
    showToast("Please select a lab room")
    return
  }

  const labRoomId = selectedOption.value
  const labRoomName = selectedOption.getAttribute("data-name")

  assignCourseWithLabRoom(courseId, courseCode, labRoomId, labRoomName)
}

function getAvailableLabRooms() {
  if (!selectedCell || selectedPeriods.length === 0) return availableLabRooms

  const { day } = selectedCell

  // Filter out rooms that are already assigned for the selected periods
  return availableLabRooms.filter((room) => {
    return selectedPeriods.every((period) => {
      const dayAssignments = labRoomAssignments[day]?.[period] || []
      return !dayAssignments.includes(room.id)
    })
  })
}

function assignCourseWithLabRoom(courseId, courseCode, labRoomId, labRoomName) {
  if (!selectedCell || selectedPeriods.length === 0) return

  const { section: selectedSection, day } = selectedCell
  const routineData = selectedSection === "A" ? sectionARoutine : sectionBRoutine

  // Check if any of the selected periods are already assigned
  const isAnyPeriodAssigned = selectedPeriods.some((period) => routineData[day] && routineData[day][period])

  if (isAnyPeriodAssigned) {
    showToast("Period already assigned - One or more of the selected periods already has a class assigned.")
    return
  }

  // Check if periods are consecutive
  const arePeriodsConsecutive = selectedPeriods.every(
    (period, index, array) => index === 0 || period === array[index - 1] + 1,
  )

  if (!arePeriodsConsecutive) {
    showToast("Non-consecutive periods - Please select consecutive periods for multi-period classes.")
    return
  }

  // Create a new routine with the assigned course and lab room
  if (!routineData[day]) {
    routineData[day] = {}
  }

  // Initialize lab room assignments if needed
  if (!labRoomAssignments[day]) {
    labRoomAssignments[day] = {}
  }

  // For multi-period classes, mark the first period with the periodSpan
  const firstPeriod = selectedPeriods[0]
  const sectionWithLabRoom = `${courseCode} - ${labRoomName}`

  routineData[day][firstPeriod] = {
    courseId,
    section: sectionWithLabRoom,
    periodSpan: selectedPeriods.length,
    labRoomId: labRoomId,
    labRoomName: labRoomName,
  }

  // Mark subsequent periods as occupied and assign lab room
  for (let i = 1; i < selectedPeriods.length; i++) {
    routineData[day][selectedPeriods[i]] = {
      courseId: null,
      section: "occupied",
    }
  }

  // Track lab room assignments
  selectedPeriods.forEach((period) => {
    if (!labRoomAssignments[day][period]) {
      labRoomAssignments[day][period] = []
    }
    labRoomAssignments[day][period].push(labRoomId)
  })

  // Close modal and refresh display
  const modal = document.getElementById("course-assignment-modal")
  if (modal) {
    modal.classList.remove("active")
  }
  renderRoutineBuilder()
  showToast(`Course assigned successfully with ${labRoomName}!`)
}

function assignCourse(courseId, courseCode) {
  if (!selectedCell || selectedPeriods.length === 0) return

  const { section: selectedSection, day } = selectedCell
  const routineData = selectedSection === "A" ? sectionARoutine : sectionBRoutine

  // Check if any of the selected periods are already assigned
  const isAnyPeriodAssigned = selectedPeriods.some((period) => routineData[day] && routineData[day][period])

  if (isAnyPeriodAssigned) {
    showToast("Period already assigned - One or more of the selected periods already has a class assigned.")
    return
  }

  // Check if periods are consecutive
  const arePeriodsConsecutive = selectedPeriods.every(
    (period, index, array) => index === 0 || period === array[index - 1] + 1,
  )

  if (!arePeriodsConsecutive) {
    showToast("Non-consecutive periods - Please select consecutive periods for multi-period classes.")
    return
  }

  // Create a new routine with the assigned course
  if (!routineData[day]) {
    routineData[day] = {}
  }

  // For multi-period classes, mark the first period with the periodSpan
  const firstPeriod = selectedPeriods[0]
  routineData[day][firstPeriod] = {
    courseId,
    section: courseCode,
    periodSpan: selectedPeriods.length,
  }

  // Mark subsequent periods as occupied
  for (let i = 1; i < selectedPeriods.length; i++) {
    routineData[day][selectedPeriods[i]] = {
      courseId: null,
      section: "occupied",
    }
  }

  // Close modal and refresh display
  const modal = document.getElementById("course-assignment-modal")
  if (modal) {
    modal.classList.remove("active")
  }
  renderRoutineBuilder()
  showToast("Course assigned successfully!")
}

function removeCourse(event, section, day, period) {
  // Prevent event bubbling
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }

  const routineData = section === "A" ? sectionARoutine : sectionBRoutine
  const cell = routineData[day]?.[period]

  if (!cell) {
    console.log("No cell found at", section, day, period)
    return
  }

  // For multi-period classes, we need to find the starting period
  let startPeriod = period
  let cellToRemove = cell

  // If this is an "occupied" cell, find the actual starting period
  if (cell.section === "occupied") {
    // Look backwards to find the starting period
    for (let i = period - 1; i >= 1; i--) {
      const prevCell = routineData[day]?.[i]
      if (prevCell && prevCell.courseId && prevCell.periodSpan) {
        // Check if this period falls within the span
        if (i + prevCell.periodSpan > period) {
          startPeriod = i
          cellToRemove = prevCell
          break
        }
      }
    }
  }

  console.log("Removing course:", cellToRemove, "starting at period", startPeriod)

  // Clean up lab room assignments if this was a lab course
  if (cellToRemove.labRoomId) {
    const periodsToClean = cellToRemove.periodSpan
      ? Array.from({ length: cellToRemove.periodSpan }, (_, i) => startPeriod + i)
      : [startPeriod]

    periodsToClean.forEach((p) => {
      if (labRoomAssignments[day]?.[p]) {
        labRoomAssignments[day][p] = labRoomAssignments[day][p].filter((roomId) => roomId !== cellToRemove.labRoomId)
        // Remove empty arrays
        if (labRoomAssignments[day][p].length === 0) {
          delete labRoomAssignments[day][p]
        }
      }
    })
  }

  // Remove all periods for this course (including multi-period spans)
  if (cellToRemove.periodSpan && cellToRemove.periodSpan > 1) {
    for (let i = 0; i < cellToRemove.periodSpan; i++) {
      delete routineData[day][startPeriod + i]
    }
  } else {
    delete routineData[day][startPeriod]
  }

  renderRoutineBuilder()
  showToast("Course removed successfully!")
}

function clearAllRoutines() {
  // Reset both section routines
  sectionARoutine = {
    SUN: {},
    MON: {},
    TUE: {},
    WED: {},
    THU: {},
  }

  sectionBRoutine = {
    SUN: {},
    MON: {},
    TUE: {},
    WED: {},
    THU: {},
  }

  // Clear lab room assignments
  Object.keys(labRoomAssignments).forEach((day) => {
    labRoomAssignments[day] = {}
  })

  // Re-render the tables
  renderSectionTable("section-a-table", sectionARoutine)
  renderSectionTable("section-b-table", sectionBRoutine)

  showToast("All routines cleared successfully!")
}

function autoGenerateRoutine() {
  // Show loading state
  const btn = document.getElementById("auto-generate")
  if (!btn) return

  const originalText = btn.innerHTML
  btn.innerHTML = '<span class="spinner"></span> Generating...'
  btn.disabled = true

  setTimeout(() => {
    // Generate mock routine data
    sectionARoutine = {
      SUN: {
        1: { courseId: "ct", section: "CT" },
        2: { courseId: "cse313", section: "CSE-313" },
        4: { courseId: "cse336", section: "CSE-336(A1)", periodSpan: 3 },
        5: { courseId: null, section: "occupied" },
        6: { courseId: null, section: "occupied" },
      },
      MON: {
        1: { courseId: "ct", section: "CT" },
        3: { courseId: "cse335", section: "CSE-335" },
        5: { courseId: "cse331", section: "CSE-331" },
      },
      TUE: {
        2: { courseId: "cse313", section: "CSE-313" },
        4: { courseId: "cse331", section: "CSE-331" },
        7: { courseId: "cse354", section: "CSE-354(A)", periodSpan: 2 },
        8: { courseId: null, section: "occupied" },
      },
      WED: {
        1: { courseId: "ct", section: "CT" },
        3: { courseId: "cse335", section: "CSE-335" },
        5: { courseId: "cse313", section: "CSE-313" },
      },
      THU: {
        2: { courseId: "cse331", section: "CSE-331" },
        4: { courseId: "cse335", section: "CSE-335" },
      },
    }

    sectionBRoutine = {
      SUN: {
        1: { courseId: "ct", section: "CT" },
        3: { courseId: "cse313", section: "CSE-313" },
        5: { courseId: "cse336", section: "CSE-336(B1)", periodSpan: 2 },
        6: { courseId: null, section: "occupied" },
      },
      MON: {
        2: { courseId: "cse335", section: "CSE-335" },
        4: { courseId: "cse331", section: "CSE-331" },
        6: { courseId: "ct", section: "CT" },
      },
      TUE: {
        1: { courseId: "ct", section: "CT" },
        3: { courseId: "cse313", section: "CSE-313" },
        7: { courseId: "cse354", section: "CSE-354(B)", periodSpan: 2 },
        8: { courseId: null, section: "occupied" },
      },
      WED: {
        2: { courseId: "cse335", section: "CSE-335" },
        4: { courseId: "cse331", section: "CSE-331" },
        6: { courseId: "cse313", section: "CSE-313" },
      },
      THU: {
        1: { courseId: "ct", section: "CT" },
        3: { courseId: "cse335", section: "CSE-335" },
        5: { courseId: "cse331", section: "CSE-331" },
      },
    }

    // Restore button state
    btn.innerHTML = originalText
    btn.disabled = false

    renderRoutineBuilder()
    showToast("Routine generated successfully!")
  }, 2000)
}

function saveRoutine() {
  if (!currentRoutineInfo) {
    showToast("No routine information found!")
    return
  }

  // Show loading state
  const btn = document.getElementById("save-routine")
  if (btn) {
    const originalText = btn.innerHTML
    btn.innerHTML = '<span class="spinner"></span> Saving...'
    btn.disabled = true

    setTimeout(() => {
      if (currentEditingRoutineId) {
        // Update existing routine
        const routineIndex = routinesData.findIndex((r) => r.id === currentEditingRoutineId)
        if (routineIndex !== -1) {
          routinesData[routineIndex] = {
            ...routinesData[routineIndex],
            title: currentRoutineInfo.batch,
            level: Number.parseInt(currentRoutineInfo.level),
            term: Number.parseInt(currentRoutineInfo.term),
            status: "Active",
          }
          showToast("Routine updated successfully!")
        }
      } else {
        // Create new routine entry
        const newRoutine = {
          id: routinesData.length + 1,
          title: currentRoutineInfo.batch,
          status: "Active",
          level: Number.parseInt(currentRoutineInfo.level),
          term: Number.parseInt(currentRoutineInfo.term),
          color: "blue",
          icon: "📅",
        }
        routinesData.push(newRoutine)
        showToast("Routine saved successfully!")
      }

      // Reset state
      currentRoutineInfo = null
      currentEditingRoutineId = null
      localStorage.removeItem("currentRoutineInfo")
      localStorage.removeItem("availableCourses")

      // Restore button state
      btn.innerHTML = originalText
      btn.disabled = false

      // Navigate back to manage routines
      setTimeout(() => {
        window.location.href = "manage_routine.html"
      }, 1000)
    }, 1500)
  }
}

// Function to load existing routine data for editing
function loadRoutineForEditing(routineId) {
  const routine = routinesData.find((r) => r.id === routineId)
  if (!routine) return

  // Set current routine info for editing
  currentRoutineInfo = {
    batch: routine.title,
    level: routine.level.toString(),
    term: routine.term.toString(),
    courses: JSON.parse(localStorage.getItem("availableCourses")) || availableCourses,
  }

  // Load existing routine data (you can replace this with actual saved routine data)
  // For now, using mock data as example
  if (routineId === 1) {
    sectionARoutine = JSON.parse(JSON.stringify(mockRoutineData.sectionA))
    sectionBRoutine = JSON.parse(JSON.stringify(mockRoutineData.sectionB))
  } else {
    // Load other routine data or keep empty for new routines
    sectionARoutine = { SUN: {}, MON: {}, TUE: {}, WED: {}, THU: {} }
    sectionBRoutine = { SUN: {}, MON: {}, TUE: {}, WED: {}, THU: {} }
  }
}

// Routine View Functions
function renderRoutineView() {
  const container = document.getElementById("routine-view-table")
  if (!container) return

  // Always show merged view of both sections
  container.innerHTML = createMergedSectionTable()
}

function createMergedSectionTable() {
  const html = `
  <div class="merged-routine-container">
    <!-- Section A Table -->
    <div class="section-routine-table">
      <div class="section-header">
        <div class="flex items-center gap-4">
          <svg class="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <h2>Section A Routine</h2>
        </div>
        <span class="section-badge section-a">Section A</span>
      </div>
      ${createSectionViewTable(mockRoutineData.sectionA, "A")}
    </div>

    <!-- Section B Table -->
    <div class="section-routine-table">
      <div class="section-header">
        <div class="flex items-center gap-4">
          <svg class="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <h2>Section B Routine</h2>
        </div>
        <span class="section-badge section-b">Section B</span>
      </div>
      ${createSectionViewTable(mockRoutineData.sectionB, "B")}
    </div>
  </div>
`
  return html
}

function createSectionViewTable(routineData, sectionName) {
  let html = `
  <div class="routine-table-container">
    <table class="routine-table">
      <thead>
        <tr>
          <th>Day</th>
`

  timeSlots.forEach((slot) => {
    html += `<th>${slot.startTime}<br/>to<br/>${slot.endTime}</th>`
  })

  html += `
        </tr>
      </thead>
      <tbody>
`

  days.forEach((day) => {
    html += `<tr><td class="day-cell">${day}</td>`

    timeSlots.forEach((slot) => {
      const cell = routineData[day]?.[slot.period]

      // Skip occupied cells
      if (cell && cell.section === "occupied") {
        return
      }

      const colSpan = cell?.periodSpan || 1

      html += `<td colspan="${colSpan}">${createCourseCell(cell)}</td>`
    })

    html += `</tr>`
  })

  html += `
      </tbody>
    </table>
  </div>
`

  return html
}

function createCourseCell(cell) {
  if (!cell || !cell.courseId) {
    return '<span style="color: #9ca3af;">-</span>'
  }

  const course = getCourseById(cell.courseId)
  const isClassTest = cell.courseId === "ct"
  const isLab = cell.section?.includes("Lab") || (cell.periodSpan && cell.periodSpan > 1)

  let colorClass = "blue"
  if (isClassTest) {
    colorClass = "purple"
  } else if (isLab) {
    colorClass = "amber"
  }

  let html = `
  <div class="course-cell ${colorClass}">
    <div class="course-name">${cell.section}</div>
`

  if (!isClassTest) {
    html += `<div class="course-details">${course.name}</div>`
  }

  if (cell.periodSpan && cell.periodSpan > 1) {
    html += `<div class="period-badge">${cell.periodSpan} periods</div>`
  }

  html += `</div>`

  return html
}

// Modal Functions
function openCreateModal() {
  const modal = document.getElementById("create-routine-modal")
  if (modal) {
    modal.classList.add("active")
  }
}

function closeCreateModal() {
  const modal = document.getElementById("create-routine-modal")
  if (modal) {
    modal.classList.remove("active")
  }
  const form = document.getElementById("create-routine-form")
  if (form) {
    form.reset()
  }
}

function deleteRoutine(id, title) {
  routineToDelete = id
  const nameElement = document.getElementById("delete-routine-name")
  if (nameElement) {
    nameElement.textContent = title
  }
  const modal = document.getElementById("delete-routine-modal")
  if (modal) {
    modal.classList.add("active")
  }
}

function closeDeleteModal() {
  const modal = document.getElementById("delete-routine-modal")
  if (modal) {
    modal.classList.remove("active")
  }
  routineToDelete = null
}

function confirmDeleteRoutine() {
  if (routineToDelete) {
    const index = routinesData.findIndex((r) => r.id === routineToDelete)
    if (index > -1) {
      routinesData.splice(index, 1)
      renderRoutines()
      showToast("Routine deleted successfully!")
    }
  }
  closeDeleteModal()
}

// FIXED: Edit routine function - now navigates to routine-builder instead of course-assignment
function editRoutine(id) {
  const routine = routinesData.find((r) => r.id === id)
  if (!routine) return

  // Set the editing state
  currentEditingRoutineId = id

  // Load the routine data for editing
  loadRoutineForEditing(id)

  // Navigate to routine builder (not course assignment)
  window.location.href = "routine_builder.html"

  showToast("Loading routine for editing...")
}

function viewRoutine(id) {
  const routine = routinesData.find((r) => r.id === id)
  if (!routine) return
mockRoutineData
  // Update page title
  const titleElement = document.getElementById("view-routine-title")
  const subtitleElement = document.getElementById("view-routine-subtitle")

  if (titleElement) {
    titleElement.textContent = routine.title
  }
  if (subtitleElement) {
    subtitleElement.textContent = `Level ${routine.level} | Term ${routine.term}`
  }

  window.location.href = "routine_view_page.html"
}

// Export Functions
function exportRoutine() {
  const csvRows = []
  const header = ["Day", "Time", "Section A", "Section B"]
  csvRows.push(header.join(","))

  days.forEach((day) => {
    timeSlots.forEach((slot) => {
      const sectionACell = mockRoutineData.sectionA[day]?.[slot.period]
      const sectionBCell = mockRoutineData.sectionB[day]?.[slot.period]

      if (
        (sectionACell && sectionACell.section === "occupied") ||
        (sectionBCell && sectionBCell.section === "occupied")
      ) {
        return
      }

      const sectionAText = sectionACell?.courseId ? `"${sectionACell.section}"` : ""
      const sectionBText = sectionBCell?.courseId ? `"${sectionBCell.section}"` : ""

      const row = [day, `${slot.startTime}-${slot.endTime}`, sectionAText, sectionBText]
      csvRows.push(row.join(","))
    })
  })

  const csvContent = csvRows.join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "routine.csv"
  link.click()
  URL.revokeObjectURL(url)

  showToast("Routine exported successfully!")
}

function printRoutine() {
  const printDate = document.getElementById("print-date")
  if (printDate) {
    printDate.textContent = new Date().toLocaleDateString()
  }

  const printInfo = document.getElementById("print-routine-info")
  if (printInfo) {
    printInfo.textContent = "Batch 2023 | Level 1 | Term 1"
  }

  window.print()
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", function () {
      const page = this.getAttribute("data-page")
      if (page) {
        navigateTo(page)
      }
    })
  })

  // View Toggle
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".toggle-btn").forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
      currentView = this.getAttribute("data-view")
      renderSchedule()
    })
  })

  // Date Navigation
  const prevBtn = document.getElementById("prev-date")
  const nextBtn = document.getElementById("next-date")

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentView === "day") {
        currentDate = addDays(currentDate, -1)
      } else {
        currentDate = addWeeks(currentDate, -1)
      }
      renderSchedule()
    })
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentView === "day") {
        currentDate = addDays(currentDate, 1)
      } else {
        currentDate = addWeeks(currentDate, 1)
      }
      renderSchedule()
    })
  }

  // Create Routine Modal
  const createModal = document.getElementById("create-routine-modal")
  const closeCreateBtn = document.getElementById("close-create-modal")
  const cancelCreateBtn = document.getElementById("cancel-create")
  const saveCreateBtn = document.getElementById("save-create")

  if (closeCreateBtn) {
    closeCreateBtn.addEventListener("click", closeCreateModal)
  }

  if (cancelCreateBtn) {
    cancelCreateBtn.addEventListener("click", closeCreateModal)
  }

  if (saveCreateBtn) {
    saveCreateBtn.addEventListener("click", () => {
      const form = document.getElementById("create-routine-form")
      if (form && form.checkValidity()) {
        const formData = new FormData(form)
        currentRoutineInfo = {
          batch: formData.get("batch"),
          level: formData.get("level"),
          term: formData.get("term"),
        }
        // Reset editing state for new routine
        currentEditingRoutineId = null
        closeCreateModal()
        window.location.href = "course_assignment.html"
      } else {
        showToast("Please fill in all required fields")
      }
    })
  }

  // Delete Routine Modal
  const deleteModal = document.getElementById("delete-routine-modal")
  const closeDeleteBtn = document.getElementById("close-delete-modal")
  const cancelDeleteBtn = document.getElementById("cancel-delete")
  const confirmDeleteBtn = document.getElementById("confirm-delete")

  if (closeDeleteBtn) {
    closeDeleteBtn.addEventListener("click", closeDeleteModal)
  }

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", closeDeleteModal)
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", confirmDeleteRoutine)
  }

  // Teacher Assignment Modal - FIXED
  const teacherModal = document.getElementById("teacher-assignment-modal")
  const closeTeacherBtn = document.getElementById("close-teacher-modal")
  const closeTeacherAssignmentBtn = document.getElementById("close-teacher-assignment")

  function closeTeacherModal() {
    if (teacherModal) {
      teacherModal.classList.remove("active")
    }
  }

  if (closeTeacherBtn) {
    closeTeacherBtn.addEventListener("click", closeTeacherModal)
  }

  if (closeTeacherAssignmentBtn) {
    closeTeacherAssignmentBtn.addEventListener("click", closeTeacherModal)
  }

  // Close modal when clicking outside
  if (teacherModal) {
    teacherModal.addEventListener("click", (e) => {
      if (e.target === teacherModal) {
        closeTeacherModal()
      }
    })
  }

  // === Course Assignment Modal ===
  const courseModal = document.getElementById("course-assignment-modal")
  const closeCourseBtn = document.getElementById("close-course-modal")
  const cancelCourseBtn = document.getElementById("cancel-course-assignment")

  if (closeCourseBtn) {
    closeCourseBtn.addEventListener("click", () => {
      courseModal.classList.remove("active")
    })
  }

  if (cancelCourseBtn) {
    cancelCourseBtn.addEventListener("click", () => {
      courseModal.classList.remove("active")
    })
  }

  // === Back Buttons Navigation ===
  const backToRoutinesBtn = document.getElementById("back-to-routines")
  const backToCourseAssignmentBtn = document.getElementById("back-to-course-assignment")
  const backToRoutinesFromViewBtn = document.getElementById("back-to-routines-from-view")

  if (backToRoutinesBtn) {
    backToRoutinesBtn.addEventListener("click", () => {
      window.location.href = "manage_routine.html"
    })
  }

  if (backToCourseAssignmentBtn) {
    backToCourseAssignmentBtn.addEventListener("click", () => {
      window.location.href = "course_assignment.html"
    })
  }

  if (backToRoutinesFromViewBtn) {
    backToRoutinesFromViewBtn.addEventListener("click", () => {
      window.location.href = "manage_routine.html"
    })
  }

  // Save buttons
  const saveCourseAssignmentsBtn = document.getElementById("save-course-assignments")
  const saveRoutineBtn = document.getElementById("save-routine")

  if (saveCourseAssignmentsBtn) {
    saveCourseAssignmentsBtn.addEventListener("click", saveCourseAssignments)
  }

  if (saveRoutineBtn) {
    saveRoutineBtn.addEventListener("click", saveRoutine)
  }

  // Routine Builder buttons
  const clearRoutineBtn = document.getElementById("clear-routine")
  const autoGenerateBtn = document.getElementById("auto-generate")

  if (clearRoutineBtn) {
    clearRoutineBtn.addEventListener("click", clearAllRoutines)
  }

  if (autoGenerateBtn) {
    autoGenerateBtn.addEventListener("click", autoGenerateRoutine)
  }

  // Routine View buttons
  const editRoutineBtn = document.getElementById("edit-routine-btn")
  const printRoutineBtn = document.getElementById("print-routine")

  if (editRoutineBtn) {
    editRoutineBtn.addEventListener("click", () => {
      window.location.href = "routine_builder.html"
    })
  }

  if (printRoutineBtn) {
    printRoutineBtn.addEventListener("click", printRoutine)
  }

  // Initialize the current page
  if (window.location.pathname.includes("teacher_schedule.html")) {
    // Set default view to day and make it active
    currentView = "day"
    const dayToggle = document.querySelector('.toggle-btn[data-view="day"]')
    if (dayToggle) {
      dayToggle.classList.add("active")
    }
    renderSchedule()
  } else if (window.location.pathname.includes("manage_routine.html")) {
    renderRoutines()
  } else if (window.location.pathname.includes("course_assignment.html")) {
    renderCourseAssignment()
  } else if (window.location.pathname.includes("routine_builder.html")) {
    renderRoutineBuilder()
  } else if (window.location.pathname.includes("routine_view_page.html")) {
    renderRoutineView()
  }
})
