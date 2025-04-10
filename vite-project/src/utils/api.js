import { API_BASE_URL } from './config';

// 🔐 AUTH / ROLE
export const getUserRole = async (email) => {
  const res = await fetch(`${API_BASE_URL}/users/user-role/${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error('Failed to get user role');
  return res.json();
};

// 👨‍👩‍👧‍👦 PARENTS
export const getChildrenAndTasks = async (parentEmail) => {
  const res = await fetch(`${API_BASE_URL}/parents/${encodeURIComponent(parentEmail)}/children-tasks`);
  if (!res.ok) throw new Error('Failed to fetch children/tasks');
  return res.json();
};

// 🧑‍⚕️ DOCTORS
export const getDoctorPatientsByEmail = async (email) => {
  const res = await fetch(`${API_BASE_URL}/doctors/${encodeURIComponent(email)}/patients`);
  if (!res.ok) throw new Error('Failed to fetch doctor patients');
  return res.json();
};

export const addPatientToDoctorByEmail = async (email, patientData) => {
  const res = await fetch(`${API_BASE_URL}/doctors/${encodeURIComponent(email)}/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData)
  });
  if (!res.ok) throw new Error('Failed to add patient');
  return res.json();
};

export const getPatientsTasksByEmail = async (email) => {
  const res = await fetch(`${API_BASE_URL}/doctors/${encodeURIComponent(email)}/patients-tasks`);
  if (!res.ok) throw new Error('Failed to fetch patients tasks');
  return res.json();
};

// 🧍 PATIENTS
export const updatePatientById = async (id, updatedData) => {
  const res = await fetch(`${API_BASE_URL}/patients/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });
  if (!res.ok) throw new Error('Failed to update patient');
  return res.json();
};

export const deletePatientById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/patients/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete patient');
  return res.json();
};

// ✅ TASKS (כל פעולה דרך replace-from-date)
export const replaceTasksFromDate = async ({ patient_id, description, from_date, to_date, completed, reason_not_completed, allergy_reaction, notes }) => {
  const res = await fetch(`${API_BASE_URL}/tasks/replace-from-date`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patient_id,
      description,
      start_date: from_date,
      end_date: to_date,
      completed,
      reason_not_completed,
      allergy_reaction,
      notes
    })
  });
  if (!res.ok) throw new Error('Failed to replace tasks');
  return res.json();
};

// 📲 PUSH NOTIFICATIONS
export const registerDeviceToken = async (patientId, token) => {
  const res = await fetch(`${API_BASE_URL}/register-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patient_id: patientId, token })
  });
  if (!res.ok) throw new Error('Failed to register device token');
  return res.json();
};

// 🛡️ ADMINS
export const getAllAdmins = async () => {
  const res = await fetch(`${API_BASE_URL}/admins`);
  if (!res.ok) throw new Error('Failed to fetch admins');
  return await res.json();
};

export const addAdmin = async (adminData) => {
  const res = await fetch(`${API_BASE_URL}/admins/add-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(adminData),
  });
  if (!res.ok) throw new Error('Failed to add admin');
  return await res.json();
};

export const updateAdmin = async (id, data) => {
  const res = await fetch(`${API_BASE_URL}/admins/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update admin');
  return res.json();
};

export const deleteAdmin = async (id) => {
  const res = await fetch(`${API_BASE_URL}/admins/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete admin');
  return res.json();
};

// 🧑‍⚕️ DOCTORS
export const getAllDoctors = async () => {
  const res = await fetch(`${API_BASE_URL}/doctors`);
  if (!res.ok) throw new Error('Failed to fetch doctors');
  return res.json();
};

export const addDoctor = async (doctorData) => {
  const res = await fetch(`${API_BASE_URL}/doctors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doctorData),
  });
  if (!res.ok) throw new Error('Failed to add doctor');
  return res.json();
};

export const updateDoctor = async (id, data) => {
  const res = await fetch(`${API_BASE_URL}/doctors/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update doctor');
  return res.json();
};

export const deleteDoctor = async (id) => {
  const res = await fetch(`${API_BASE_URL}/doctors/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete doctor');
  return res.json();
};
export const getTasksForPatient = async (patientId, days = 30) => {
  const res = await fetch(`${API_BASE_URL}/tasks/patients/${patientId}/tasks?days=${days}`);
  if (!res.ok) throw new Error('Failed to get patient tasks');
  return res.json();
};
