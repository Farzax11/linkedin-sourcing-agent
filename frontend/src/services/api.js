const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function searchCandidates({ jobRole, skills = [], minExperience = 0 }) {
  const res = await fetch(`${BASE_URL}/search-candidates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobRole, skills, minExperience }),
  });
  return handleResponse(res);
}

export async function generateMessage(candidate, jobRole) {
  const res = await fetch(`${BASE_URL}/generate-message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidate, jobRole }),
  });
  return handleResponse(res);
}
