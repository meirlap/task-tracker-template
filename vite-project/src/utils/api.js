const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 🧪 AUTH / ROLE
export const getUserRole = async (email) => {
  const res = await fetch(`${API_BASE}/user-role/${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error('Failed to get user role');
  return res.json(); // { role: 'parent' | 'doctor' | 'patient' | 'admin' | 'unknown' }
};

// 👨‍👩‍👧‍👦 PARENTS
export const getChildrenAndTasks = async (parentEmail) => {
  const res = await fetch(`${API_BASE}/parent/${encodeURIComponent(parentEmail)}/children-tasks`);
  if (!res.ok) throw new Error('Failed to fetch children/tasks');
  return res.json(); // [{ id, name, tasks: [...] }]
};

// 🧑‍⚕️ DOCTORS - by EMAIL instead of ID

export const getDoctorPatientsByEmail = async (email) => {
  const res = await fetch(`${API_BASE}/doctors/${encodeURIComponent(email)}/patients`);
  if (!res.ok) throw new Error('Failed to fetch doctor patients');
  return res.json();
};

export const addPatientToDoctorByEmail = async (email, patientData) => {
  const res = await fetch(`${API_BASE}/doctors/${encodeURIComponent(email)}/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData)
  });
  if (!res.ok) throw new Error('Failed to add patient');
  return res.json();
};

// 🧍 PATIENTS (general patient routes, by ID)
export const updatePatientById = async (id, updatedData) => {
  const res = await fetch(`${API_BASE}/patients/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });
  if (!res.ok) throw new Error('Failed to update patient');
  return res.json();
};

export const deletePatientById = async (id) => {
  const res = await fetch(`${API_BASE}/patients/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete patient');
  return res.json();
};

// ✅ TASKS
export const patchTask = async (taskId, updateData) => {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  });
  if (!res.ok) throw new Error('Failed to patch task');
  return res.json();
};
export const getTasksForPatient = async (patientId, days = 30) => {
  const res = await fetch(`${API_BASE}/${patientId}?days=${days}`);
  if (!res.ok) throw new Error('Failed to get patient tasks');
  return res.json();
};
export const createBulkTasks = async ({ patient_id, description, start_date, end_date }) => {
  const res = await fetch(`${API_BASE}/tasks/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patient_id, description, start_date, end_date })
  });
  if (!res.ok) throw new Error('Failed to create bulk tasks');
  return res.json();
};
export const getPatientsTasksByEmail = async (email) => {
  const res = await fetch(`${API_BASE}/doctors/${encodeURIComponent(email)}/patients-tasks`);
  if (!res.ok) throw new Error('Failed to fetch patients tasks');
  return res.json();
};
export const replaceTasksFromDate = async ({ patient_id, description, start_date, end_date }) => {
  const res = await fetch(`${API_BASE}/tasks/replace-from-date`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patient_id, description, start_date, end_date })
  });
  if (!res.ok) throw new Error('Failed to replace tasks');
  return res.json();
};
