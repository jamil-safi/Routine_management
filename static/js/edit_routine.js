

// const mockRoutineData = {
//   sectionA: {
//     SUN: {
//       1: { courseId: "ct", section: "CT" },
//       2: { courseId: "cse313", section: "CSE-313" },
//       4: {
//         courseId: "cse336",
//         section: "CSE-336 - Computer Lab 1",
//         periodSpan: 3,
//         labRoomId: "lab101",
//         labRoomName: "Computer Lab 1",
//       },
//     },
//     MON: {
//       1: { courseId: "ct", section: "CT" },
//       3: { courseId: "cse335", section: "CSE-335" },
//       5: { courseId: "cse331", section: "CSE-331" },
//     },
//     TUE: {
//       2: { courseId: "cse313", section: "CSE-313" },
//       4: { courseId: "cse331", section: "CSE-331" },
//       7: {
//         courseId: "cse354",
//         section: "CSE-354 - Electronics Lab",
//         periodSpan: 2,
//         labRoomId: "lab301",
//         labRoomName: "Electronics Lab",
//       },
//     },
//     WED: {
//       1: { courseId: "ct", section: "CT" },
//       3: { courseId: "cse335", section: "CSE-335" },
//       5: { courseId: "cse313", section: "CSE-313" },
//     },
//     THU: {
//       2: { courseId: "cse331", section: "CSE-331" },
//       4: { courseId: "cse335", section: "CSE-335" },
//     },
//   },
//   sectionB: {
//     SUN: {
//       1: { courseId: "ct", section: "CT" },
//       3: { courseId: "cse313", section: "CSE-313" },
//       5: {
//         courseId: "cse336",
//         section: "CSE-336 - Computer Lab 2",
//         periodSpan: 2,
//         labRoomId: "lab102",
//         labRoomName: "Computer Lab 2",
//       },
//     },
//     MON: {
//       2: { courseId: "cse335", section: "CSE-335" },
//       4: { courseId: "cse331", section: "CSE-331" },
//       6: { courseId: "ct", section: "CT" },
//     },
//     TUE: {
//       1: { courseId: "ct", section: "CT" },
//       3: { courseId: "cse313", section: "CSE-313" },
//       7: {
//         courseId: "cse354",
//         section: "CSE-354 - Network Lab",
//         periodSpan: 2,
//         labRoomId: "lab302",
//         labRoomName: "Network Lab",
//       },
//     },
//     WED: {
//       2: { courseId: "cse335", section: "CSE-335" },
//       4: { courseId: "cse331", section: "CSE-331" },
//       6: { courseId: "cse313", section: "CSE-313" },
//     },
//     THU: {
//       1: { courseId: "ct", section: "CT" },
//       3: { courseId: "cse335", section: "CSE-335" },
//       5: { courseId: "cse331", section: "CSE-331" },
//     },
//   },
// }





// If you don't define availableCourses elsewhere, at least keep it as []
// const availableCourses = window.availableCourses || JSON.parse(localStorage.getItem('availableCourses') || '[]')

// const availableCourses = [
//   {
//     id: "cse313",
//     code: "CSE-313",
//     name: "Database Systems",
//     credit: 3,
//     teachers: [],
//     classroom: "",
//   },
//   {
//     id: "cse331",
//     code: "CSE-331",
//     name: "Software Engineering",
//     credit: 3,
//     teachers: [],
//     classroom: "",
//   },
//   {
//     id: "cse335",
//     code: "CSE-335",
//     name: "Computer Networks",
//     credit: 3,
//     teachers: [],
//     classroom: "",
//   },
//   {
//     id: "cse336",
//     code: "CSE-336",
//     name: "Database Lab",
//     credit: 1,
//     teachers: [],
//     classroom: "",
//   },
//   {
//     id: "cse354",
//     code: "CSE-354",
//     name: "Software Lab",
//     credit: 1,
//     teachers: [],
//     classroom: "",
//   },
// ]

// const availableLabRooms = [
//   { id: "lab101", name: "Computer Lab 1", type: "computer", capacity: 30 },
//   { id: "lab102", name: "Computer Lab 2", type: "computer", capacity: 25 },
//   { id: "lab201", name: "Physics Lab", type: "physics", capacity: 20 },
//   { id: "lab202", name: "Chemistry Lab", type: "chemistry", capacity: 18 },
//   { id: "lab301", name: "Electronics Lab", type: "electronics", capacity: 22 },
//   { id: "lab302", name: "Network Lab", type: "network", capacity: 28 },
// ]






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


// Build empty routine objects for both sections
const makeEmptyRoutine = () => ({
  SAT:{} , SUN: {}, MON: {}, TUE: {}, WED: {}, THU: {}, FRI: {}
})

let sectionARoutine = makeEmptyRoutine()
let sectionBRoutine = makeEmptyRoutine()
let availableCourses = []
let availableLabRooms = []
let currentRoutineInfo = null
let currentCourseId = null
let selectedCell = null
let selectedPeriods = []
let currentEditingRoutineId = null // Add this for tracking editing state



// Track lab room assignments for each time slot
let labRoomAssignments = {
  // Structure: { day: { period: [assignedLabRoomIds] } }
}


document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "edit_routine") {
    fetch('/api/edit_routine')
      .then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.json();
      })
      .then(data => { 
        currentEditingRoutineId = Number(data.routine_id);
        
        availableCourses = data.availableCourses.map((course, index) => ({
          id: Number(course.course_id),
          code: course.course_code,
          name: course.course_title,
          credit: Number(course.credit),
          is_sessional : Boolean(course.is_sessional),
          teachers :[],
          classroom: "",
        }));

        // Transform teachers (optional styling)
        availableLabRooms = data.corresponding_lab_rooms.map((labroom, index) => ({
          id: Number(labroom.room_id),
          name: labroom.room_name,
          courseId : Number(labroom.course_id),
          type: "Computer" ,
          capacity: 60
        }));

       data.routineSectionA.forEach(sec => {
        const day = sec.day;
        const period = Number(sec.period_id);

        sectionARoutine[day][period] = {
          courseId: Number(sec.course_id),
          section: sec.course_code,
          
          periodSpan: Number(sec.period_span ?? 1),
          room_id: Number(sec.room_id ?? null),
          room_name: sec.room_name ?? null,
          is_sessional: Boolean(sec.is_sessional)
        };
      });
      data.routineSectionB.forEach(sec => {
        const day = sec.day;
        const period = Number(sec.period_id);
        
        sectionBRoutine[day][period] = {
          courseId: sec.course_id,
          section: sec.course_code,
          periodSpan: Number(sec.period_span ?? 1),
          labRoomId: Number(sec.room_id ?? null),
          labRoomName: sec.room_name ?? null,
          is_sessional: Boolean(sec.is_sessional)
        };
      });

        console.log(currentEditingRoutineId);
        renderRoutineBuilder();
      })

      .catch(err => {
        console.error("Error:", err);
        //showToast("Failed to load routine data");
    });
    
  }
  console.log(sectionARoutine);
  console.log(sectionARoutine);
  // Add this block:
  const cancelBtn = document.getElementById("cancel-course-assignment");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      const modal = document.getElementById("course-assignment-modal");
      if (modal) modal.classList.remove("active");

      // Optionally clear selections
      selectedCell = null;
      selectedPeriods = [];
    });
  }

  // Also optional: hook for close (×) button
  const closeBtn = document.getElementById("close-course-modal");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      const modal = document.getElementById("course-assignment-modal");
      if (modal) modal.classList.remove("active");

      selectedCell = null;
      selectedPeriods = [];
    });
  }
});


// ---- RENDERERS ----
function renderRoutineBuilder() {
    renderSectionTable("section-a-table", sectionARoutine)
    renderSectionTable("section-b-table", sectionBRoutine)
    renderCourseOptions()
}

function renderSectionTable(tableId, routineData) {
  const table = document.getElementById(tableId)
  if (!table) return

  let html = `
    <thead>
      <tr>
        <th>Day</th>
        ${timeSlots.map(slot => `
          <th style="font-size: 0.75rem;">
            ${slot.startTime}<br/>to<br/>${slot.endTime}
          </th>
        `).join("")}
      </tr>
    </thead>
    <tbody>
  `

  days.forEach(day => {
    html += `<tr>`
    html += `<td class="day-header">${day}</td>`

    timeSlots.forEach(slot => {
      const period = slot.period
      const cell = routineData?.[day]?.[period] // <- safe access
      const section = tableId.includes("section-a") ? "A" : "B"

      // Skip if it's a continuation cell
      if (cell && cell.section === "occupied") return

      const colSpan = cell?.periodSpan || 1

      html += `
        <td
          colspan="${colSpan}"
          class="routine-cell ${cell ? "occupied" : ""} ${getCellClass(cell)}"
          onclick="openCourseModal('${section}', '${day}', ${period})"
        >
      `

      if (cell && cell.courseId) {
        console.log(cell)
        html += `
          <div class="course-info">
            <div class="course-code">${cell.section}</div>
            ${cell.periodSpan && cell.periodSpan > 1 ? `<div class="period-span-badge">${cell.periodSpan} periods</div>` : ""}
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
  if (!cell || !cell.courseId) return "";
  if (cell.courseId === "ct") return "test";
  // Use is_sessional flag to identify lab courses
  if (cell.is_sessional || cell.labRoomId) return "lab";
  return "";
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


function renderCourseOptions() {
  const container = document.getElementById("course-options");
  if (!container) return;

  let html =''
  // Use availableCourses directly
  availableCourses.forEach(course => {
    if (course.is_sessional) {
      const availableRooms = getAvailableLabRoomsForCourse(course.id);
      console.log("Available Rooms:", availableRooms)
      
      html += `<div class="course-option has-lab-dropdown">
        <div class="course-option-code">${course.code}</div>
        <div class="course-option-name">${course.name}</div>
        <select 
            class="lab-room-dropdown-simple" 
            name="lab_room"
            id="lab-room-selector-${course.id}"
            onchange="assignCourseWithLabRoomFromDropdown('${course.id}', '${course.code}', this)" 
            onclick="event.stopPropagation()"
          >
          <option value="">-- Select Lab Room --</option>
          ${availableRooms.map(room => `
            <option value="${room.id}" data-name="${room.name}">
              ${room.name}
            </option>
          `).join("")}
        </select>
      </div>`;
    } else {
      // Regular course option
      html += `<div class="course-option" onclick="assignCourse('${course.id}', '${course.code}')">
        <div class="course-option-code">${course.code}</div>
        <div class="course-option-name">${course.name}</div>
      </div>`;
    }
  });

  container.innerHTML = html;
}

// New helper function
function getAvailableLabRoomsForCourse(courseId) {
  return availableLabRooms.filter(room => 
    room.courseId === parseInt(courseId)  // Ensure both are numbers
  );
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
    //showToast("Please select a lab room")
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
    //showToast("Period already assigned - One or more of the selected periods already has a class assigned.")
    return
  }

  // Check if periods are consecutive
  const arePeriodsConsecutive = selectedPeriods.every(
    (period, index, array) => index === 0 || period === array[index - 1] + 1,
  )

  if (!arePeriodsConsecutive) {
    //showToast("Non-consecutive periods - Please select consecutive periods for multi-period classes.")
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
    section: courseCode,
    periodSpan: selectedPeriods.length,
    labRoomId: labRoomId,
    labRoomName: labRoomName,
    is_sessional: true
  };

  // Mark subsequent periods as occupied and assign lab room
  for (let i = 1; i < selectedPeriods.length; i++) {
    routineData[day][selectedPeriods[i]] = {
      courseId: null,
      section: "occupied",
      periodSpan: 1
    };
  }
  

  // Track lab room assignments
  selectedPeriods.forEach((period) => {
    if (!labRoomAssignments[day][period]) {
      labRoomAssignments[day][period] = []
    }
    labRoomAssignments[day][period].push(labRoomId)
  })

  fetch("/api/save_course_assignment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      routine_id: currentEditingRoutineId,
      course_id: courseId,
      period_id: selectedCell.period,
      period_span: selectedPeriods.length,
      section: selectedCell.section,
      day: selectedCell.day,
      room_id: labRoomId  // Pass lab room ID
    })
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === "success") {
      // Update UI only after successful save
      const modal = document.getElementById("course-assignment-modal");
      if (modal) modal.classList.remove("active");
      renderRoutineBuilder();
    } else {
      alert("Error: " + result.error);
    }
  })
  .catch(err => {
    console.error("Error:", err);
    alert("Failed to save lab assignment");
  });
  // Close modal and refresh display
  // const modal = document.getElementById("course-assignment-modal")
  // if (modal) {
  //   modal.classList.remove("active")
  // }
  // renderRoutineBuilder()
  //showToast(`Course assigned successfully with ${labRoomName}!`)
}


function assignCourse(courseId, courseCode) {
  if (!selectedCell || selectedPeriods.length === 0) return

  const { section: selectedSection, day } = selectedCell
  const routineData = selectedSection === "A" ? sectionARoutine : sectionBRoutine

  // Check if any of the selected periods are already assigned
  const isAnyPeriodAssigned = selectedPeriods.some((period) => routineData[day] && routineData[day][period])

  if (isAnyPeriodAssigned) {
    //showToast("Period already assigned - One or more of the selected periods already has a class assigned.")
    return
  }

  // Check if periods are consecutive
  const arePeriodsConsecutive = selectedPeriods.every(
    (period, index, array) => index === 0 || period === array[index - 1] + 1,
  )

  if (!arePeriodsConsecutive) {
    //showToast("Non-consecutive periods - Please select consecutive periods for multi-period classes.")
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
  const roomId = 1; // Default room
  // const roomName = "Default Room"; // Default room name

  fetch("/api/save_course_assignment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      routine_id: currentEditingRoutineId,
      course_id: courseId,
      period_id: selectedCell.period,
      period_span: selectedPeriods.length,
      section: selectedCell.section,
      day: selectedCell.day,
      room_id: roomId  // Pass room ID
    })
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === "success") {
      // Update UI
      const modal = document.getElementById("course-assignment-modal");
      if (modal) modal.classList.remove("active");
      renderRoutineBuilder();
    } else {
      alert("Error: " + result.error);
    }
  })
  .catch(err => {
    console.error("Error:", err);
    alert("Failed to save. Please try again.");
  });
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
  

  fetch("/api/remove_course_assignment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      routine_id: currentEditingRoutineId,
      period_id: period,
      section: section,
      day : day
    }) 
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === "success") {
      renderRoutineBuilder();
    } else {
      alert("Error: " + result.error);
    }
  })
  .catch(err => {
    console.error("Error:", err);
    alert("Failed to save. Please try again.");
  });
  // renderRoutineBuilder()
  //showToast("Course removed successfully!")
}

function clearAllRoutines() {
  // Reset both section routines
  const btn = document.getElementById("clear-routine-modal-btn")
  if (!btn) return

  const originalText = btn.innerHTML
  btn.innerHTML = '<span class="spinner"></span> Clearing...'
  btn.disabled = true

  setTimeout(() => {
  
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
    closeClearRoutineModal();
    renderSectionTable("section-a-table", sectionARoutine)
    renderSectionTable("section-b-table", sectionBRoutine)
    btn.innerHTML = originalText
    btn.disabled = false

    //showToast("All routines cleared successfully!")
  }, 1000)
  // Re-render the tables
}

function openClearRoutineModal() {
  const modal = document.getElementById("confirm-clear-routine-modal");
  if (modal) modal.classList.add("active");
}

function closeClearRoutineModal() {
  const modal = document.getElementById("confirm-clear-routine-modal");
  if (modal) modal.classList.remove("active");
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
    //showToast("Routine generated successfully!")
  }, 2000)
}

function saveRoutine() {
  const btn = document.getElementById("save-routine")
  if (!btn) return

  const originalText = btn.innerHTML
  btn.innerHTML = '<span class="spinner"></span> Saving...'
  btn.disabled = true

  setTimeout(() => {
    btn.innerHTML = originalText
    btn.disabled = false
    renderSectionTable("section-a-table", sectionARoutine)
    renderSectionTable("section-b-table", sectionBRoutine)

  }, 1000)
  
}


function returnToTeacherAssignment(){
  fetch("/teacher_assignment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ routine_id: currentEditingRoutineId})
  })
  .then(response => {
    console.log("Fetch response status:", response.status);
    return response.json();
  })
  .then(result => {
    console.log("Fetch result:", result);
    if (result.status === "success") {
      window.location.href=teacherAssignmentURL;
    } else {
      alert("Error Back to teacher Assignment: " + result.error);
    }
  })
  .catch(err => {
    console.error("Error during fetch:", err);
    alert("Failed to save. Please try again.");
  });
}