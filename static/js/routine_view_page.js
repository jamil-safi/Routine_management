

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
currentEditingRoutineId = null
let RoutineData = {
  sectionA:{},
  sectionB:{}
}

let courses = {}


function getCourseById(courseId) {
  if (courseId === "ct") return { code: "CT", name: "Class Test" }
  return courses[courseId] || { code: courseId, name: courseId }
}


document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "view_routine") {
    fetch('/api/view_routine')
      .then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.json();
      })
      .then(data => { 
        currentEditingRoutineId = Number(data.routine_id);
        RoutineData = data.routine_data;
        courses = data.courses;
        // Transform teachers (optional styling)
        console.log(currentEditingRoutineId);
        console.log(courses);
        renderRoutineView();
      })

      .catch(err => {
        console.error("Error:", err);
        //showToast("Failed to load routine data");
    });
  }
});

// Routine View Functions
function renderRoutineView() {
  const container = document.getElementById("routine-view-table")
  if (!container) return

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
      ${createSectionViewTable(RoutineData.sectionA, "A")}
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
      ${createSectionViewTable(RoutineData.sectionB, "B")}
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
  const isLab = cell.is_sessional

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
    // html += `<div class="course-details">${course.name}</div>`
  }

  if (cell.periodSpan && cell.periodSpan > 1) {
    html += `<div class="period-badge">${cell.periodSpan} periods</div>`
  }

  html += `</div>`

  return html
}
