

let currentRoutineInfo = null
let availableCourses = [];
let availableTeachers = [];
let currentCourseId = null

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "teacher_assignment") {
      fetch('/api/teacher_assignment')
      .then(response => response.json())
      .then(data => {
        
        const teacherMap = {};
        data.assignments.forEach(row => {
          const cid = row.course_id;
          if (!teacherMap[cid]) teacherMap[cid] = [];
          teacherMap[cid].push({ id: row.id, name: row.name });
        });

        availableCourses = data.availableCourses.map((course, index) => ({
          id: Number(course.course_id),
          code: course.course_code,
          name: course.course_title,
          credit: Number(course.credit),
          teachers: teacherMap[course.course_id] || [],
          classroom: "",
        }));

        // Transform teachers (optional styling)
        availableTeachers = data.availableTeachers.map((teacher, index) => ({
          id: Number(teacher.id),
          name: teacher.name,
        }));

      
        renderCourseAssignment()
      })
      .catch(err => console.error("Error loading routinesData:", err));

  }
});

// Course Assignment Functions
function renderCourseAssignment() {

  const tableBody = document.getElementById("course-assignment-table")
  if (!tableBody) return

  let html = ""
  availableCourses.forEach((course) => {
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
  currentCourseId = Number(courseId);
  const modal = document.getElementById("teacher-assignment-modal");
  const teacherList = document.getElementById("teacher-list");
  const assignmentInfo = document.getElementById("assignment-info");

  const course = availableCourses.find(c => c.id === currentCourseId);

  if (course && assignmentInfo) {
    assignmentInfo.innerHTML = `
      <p>Assign teacher to <strong>${course.code} - ${course.name}</strong></p>
    `;
  }

  let html = "";
  availableTeachers.forEach((teacher) => {
    const isAssigned = course && course.teachers.some(t => t.id === teacher.id);
    html += `
      <div class="teacher-item">
        <span class="teacher-name">${teacher.name}</span>
        <button
          class="assign-btn ${isAssigned ? "assigned" : ""}"
          onclick="assignTeacher(${teacher.id})"
          ${isAssigned ? "disabled" : ""}
        >
          ${isAssigned ? "✓ Assigned" : "Assign"}
        </button>
      </div>
    `;
  });

  teacherList.innerHTML = html;
  modal.classList.add("active");
}

// function assignTeacher(teacherId) {
//   const id = Number(teacherId);
//   const courseIndex = availableCourses.findIndex(c => c.id === currentCourseId);
//   const teacher = availableTeachers.find(t => t.id === id);
//   if (courseIndex === -1 || !teacher) return;

//   if (!availableCourses[courseIndex].teachers.some(t => t.id === id)) {
//     availableCourses[courseIndex].teachers.push(teacher);
//     renderCourseAssignment();
//     openTeacherModal(currentCourseId); // refresh modal state
//     fetch('/api/assign_teacher_to_course', {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         teacher_id: id,
//         course_id: currentCourseId
//       })
//     })
//     .then(res => res.json())
//     .then(data => {
//       console.log("Saved:", data);
//     })
//     .catch(err => {
//       console.error("Save failed:", err);
//     });

//   }
// }

function assignTeacher(teacherId) {
  const id = Number(teacherId);
  const courseIndex = availableCourses.findIndex(c => c.id === currentCourseId);
  const teacher = availableTeachers.find(t => t.id === id);
  if (courseIndex === -1 || !teacher) return;

  if (!availableCourses[courseIndex].teachers.some(t => t.id === id)) {
    availableCourses[courseIndex].teachers.push(teacher);
    renderCourseAssignment();
    openTeacherModal(currentCourseId);

    fetch('/api/assign_teacher_to_course', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacher_id: id,
        course_id: currentCourseId
      })
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to assign");
      }
      console.log("Teacher assigned:", data);
    })
    .catch(err => {
      console.error("Save failed:", err);
      // Rollback the optimistic push
      availableCourses[courseIndex].teachers = availableCourses[courseIndex].teachers.filter(t => t.id !== id);
      renderCourseAssignment();
      openTeacherModal(currentCourseId);
      alert("Could not assign teacher.");
    });
  }
}



function removeTeacher(courseId, teacherId) {
  const cId = Number(courseId);
  const tId = Number(teacherId);

  const courseIndex = availableCourses.findIndex(c => c.id === cId);
  if (courseIndex === -1) return;

  availableCourses[courseIndex].teachers = availableCourses[courseIndex].teachers.filter(t => t.id !== tId);
  fetch('/api/remove_teacher_assignment', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacher_id: tId,
        course_id: cId
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Teacher assignment removed removed:", data);
    })
    .catch(err => {
      console.error("Remove teacher assignment failed:", err);
    });
  renderCourseAssignment();
}


function closeTeacherModal() {
  const modal = document.getElementById("teacher-assignment-modal")
  if (modal) {
    modal.classList.remove("active")
  }
}

function saveAndContinue() {
  console.log("saveAndContinue triggered");

  const dataToSend = availableCourses.map(course => ({
    course_id: parseInt(course.id),
    teachers: course.teachers.map(t => parseInt(t.id)),
    classroom: course.classroom.trim()
  }));

  console.log("Data to send:", dataToSend);

  fetch("/api/save_teacher_assignments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dataToSend)
  })
  .then(response => {
    console.log("Fetch response status:", response.status);
    return response.json();
  })
  .then(result => {
    console.log("Fetch result:", result);
    if (result.status === "success") {
      window.location.href=editRoutineURL;
    } else {
      alert("Error saving assignments: " + result.error);
    }
  })
  .catch(err => {
    console.error("Error during fetch:", err);
    alert("Failed to save. Please try again.");
  });
}