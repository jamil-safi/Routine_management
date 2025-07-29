
let routinesData = [];

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "manage_routines") {
      fetch('/api/manage_routines')
      .then(res => res.json())
      .then(rawData => {
        const colorCycle = ["blue", "amber", "purple", "green", "red"];
        const iconCycle = ["📅", "☀", "♥", "💡", "🧪"];

        routinesData = rawData.map((routine, index) => ({
          id: Number(routine.routine_id),
          title: `Batch ${(routine.batch)}`,
          status: routine.active_status ? "Active" : "Inactive",
          level: Number(routine.level),
          term: Number(routine.term),
          color: colorCycle[index % colorCycle.length],
          icon: iconCycle[index % iconCycle.length],
        }));

        console.log("routinesData:", routinesData);
        renderRoutines();
      })
      .catch(err => console.error("Error loading routinesData:", err));
  }
});



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


// const viewRoutineURL = "{{ url_for('view_routine') }}"
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
      <button class="action-btn" id="edit-routine-button" onclick="editRoutine(${routine.id})">
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

// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.getElementById("edit-routine-button");

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();  // stop normal form submission

//     const batch = document.getElementById("batch").value;
//     const level = document.getElementById("level").value;
//     const term  = document.getElementById("term").value;

//     const payload = {
//       batch: parseInt(batch),
//       level: parseInt(level),
//       term: parseInt(term)
//     };

//     try {
//       const response = await fetch("/api/store_routine_session", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(payload)
//       });

//       const result = await response.json();

//       if (response.ok) {
//         console.log("Routine created:", result);
//         // Optional: Redirect, close modal, or show success message
//         windows.location.href = editRoutineURL
//         // closeCreateModal();
//       } else {
//         console.error("Server error:", result);
//         alert(result.error || "Failed to create routine");
//       }
//     } catch (err) {
//       console.error("Network error:", err);
//       alert("Something went wrong. Check console.");
//     }
//   });
// });


// function viewRoutine(id) {
//   const routine = routinesData.find((r) => r.id === id)
//   if (!routine) return mockRoutineData
//   window.location.href = viewRoutineURL
// }


// function editRoutine(id) {
//   const routine = routinesData.find((r) => r.id === id)
//   if (!routine) return

//   currentEditingRoutineId = id
//   window.location.href = editRoutineURL
// }

// function viewRoutine(id) {
//   const routine = routinesData.find(r => r.id === id);
//   if (!routine) return;
//   window.location.href = viewRoutineTpl.replace('__ID__', id);
// }

// function editRoutine(id) {
//   const routine = routinesData.find(r => r.id === id);
//   if (!routine) return;
//   window.location.href = editRoutineTpl.replace('__ID__', id);
// }

function viewRoutine(id) {
  const routine = routinesData.find(r => r.id === id);
  if (!routine) return;

  const url = new URL(viewRoutineURL, window.location.origin);
  url.searchParams.set('routine_id', id);
  window.location.href = url.toString();
}

function editRoutine(id) {
  const routine = routinesData.find(r => r.id === id);
  if (!routine) return;

  const url = new URL(editRoutineURL, window.location.origin);
  url.searchParams.set('routine_id', id);
  window.location.href = url.toString();
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
      fetch("/api/delete_routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          routine_id: routineToDelete
        }) 
      })
      .then(response => response.json())
      .then(result => {
        if (result.status === "success") {
          renderRoutines()
          closeDeleteModal()
          showToast("Routine deleted successfully!")
        } else {
          alert("Error: " + result.error);
        }
      })
      .catch(err => {
        console.error("Error:", err);
        alert("Failed to save. Please try again.");
      });
      
    }
  }
}


