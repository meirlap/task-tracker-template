const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getChildrenAndTasks = async (parentEmail) => {
  const res = await fetch(`${API_BASE}/parent/${encodeURIComponent(parentEmail)}/children-tasks`);
  if (!res.ok) throw new Error('Failed to fetch children/tasks');
  return res.json();
};
