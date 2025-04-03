const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getUserRole = async (email) => {
  const res = await fetch(`${API_BASE}/user-role/${email}`);
  if (!res.ok) throw new Error('Failed to get role');
  return res.json(); // { role: "parent" | "patient" | "doctor" }
};

export const getChildrenAndTasks = async (parentEmail) => {
  const res = await fetch(`${API_BASE}/parent/${encodeURIComponent(parentEmail)}/children-tasks`);
  if (!res.ok) throw new Error('Failed to load children and tasks');
  return res.json(); // [{ name, israeli_id, tasks: [...] }]
};

export const patchTask = async (taskId, updatedFields) => {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedFields),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
};
