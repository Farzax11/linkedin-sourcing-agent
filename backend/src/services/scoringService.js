/**
 * Multi-Agent Sourcing Pipeline
 * Mimics a CrewAI-style architecture with discrete agent steps:
 *   1. CollectorAgent  — fetches candidate pool
 *   2. FilterAgent     — applies hard filters
 *   3. ScoringAgent    — scores each candidate (skill 70% + exp 30%)
 *   4. RankingAgent    — sorts and returns top N
 */

// Agent 1: Collector — returns the full candidate pool (mock / CoreSignal ready)
function collectorAgent(allCandidates) {
  return {
    agentName: 'CollectorAgent',
    status: 'completed',
    collected: allCandidates.length,
    candidates: allCandidates,
  };
}

// Agent 2: Filter — hard filters on experience and skills
function filterAgent(candidates, { minExperience = 0, skills = [] }) {
  const filtered = candidates.filter((c) => {
    const meetsExp = c.experience >= minExperience;
    const meetsSkills =
      skills.length === 0 ||
      skills.some((s) => c.skills.map((cs) => cs.toLowerCase()).includes(s.toLowerCase()));
    return meetsExp && meetsSkills;
  });
  return {
    agentName: 'FilterAgent',
    status: 'completed',
    filtered: filtered.length,
    candidates: filtered,
  };
}

// Agent 3: Scorer — weighted scoring
function scoringAgent(candidates, jobRole, requiredSkills = [], desiredExperience = 3) {
  const roleKeywords = extractRoleKeywords(jobRole);
  const allSkills = [...new Set([...requiredSkills, ...roleKeywords])];

  const scored = candidates.map((c) => {
    const skillScore = calcSkillScore(c.skills, allSkills);
    const expScore = calcExpScore(c.experience, desiredExperience);
    const total = Math.round(skillScore * 0.7 + expScore * 0.3);
    return {
      ...c,
      score: total,
      skillMatchPercent: Math.round(skillScore),
      experienceScore: Math.round(expScore),
      matchedSkills: c.skills.filter((s) =>
        allSkills.some((r) => r.toLowerCase() === s.toLowerCase())
      ),
    };
  });

  return {
    agentName: 'ScoringAgent',
    status: 'completed',
    scored: scored.length,
    candidates: scored,
  };
}

// Agent 4: Ranker — sorts and slices top N
function rankingAgent(candidates, topN = null) {
  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  return {
    agentName: 'RankingAgent',
    status: 'completed',
    total: sorted.length,
    top3: sorted.slice(0, 3),
    candidates: topN ? sorted.slice(0, topN) : sorted,
  };
}

// Full pipeline runner
function runPipeline(allCandidates, jobRole, filters = {}, desiredExperience = 3) {
  const { skills = [], minExperience = 0 } = filters;

  const step1 = collectorAgent(allCandidates);
  const step2 = filterAgent(step1.candidates, { minExperience, skills });
  const step3 = scoringAgent(step2.candidates, jobRole, skills, desiredExperience || 3);
  const step4 = rankingAgent(step3.candidates);

  return {
    pipeline: [
      { agent: step1.agentName, status: step1.status, count: step1.collected },
      { agent: step2.agentName, status: step2.status, count: step2.filtered },
      { agent: step3.agentName, status: step3.status, count: step3.scored },
      { agent: step4.agentName, status: step4.status, count: step4.total },
    ],
    top3: step4.top3,
    all: step4.candidates,
    totalFound: step4.total,
  };
}

// Helpers
function calcSkillScore(candidateSkills, required) {
  if (!required.length) return 50;
  const norm = candidateSkills.map((s) => s.toLowerCase());
  const matched = required.filter((s) => norm.includes(s.toLowerCase())).length;
  return (matched / required.length) * 100;
}

function calcExpScore(exp, desired) {
  if (exp >= desired) return 100;
  return Math.max(0, (exp / desired) * 100);
}

function extractRoleKeywords(jobRole) {
  const map = {
    frontend: ['React', 'JavaScript', 'CSS', 'TypeScript', 'HTML'],
    backend: ['Node.js', 'Python', 'PostgreSQL', 'REST APIs', 'Docker'],
    fullstack: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'REST APIs'],
    devops: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
    mobile: ['React Native', 'JavaScript', 'TypeScript', 'Firebase'],
    react: ['React', 'JavaScript', 'TypeScript', 'CSS'],
    angular: ['Angular', 'TypeScript', 'JavaScript'],
    vue: ['Vue.js', 'JavaScript', 'CSS'],
    python: ['Python', 'Django', 'Flask', 'PostgreSQL'],
    java: ['Java', 'Spring', 'Kubernetes'],
  };
  const lower = jobRole.toLowerCase();
  for (const [key, skills] of Object.entries(map)) {
    if (lower.includes(key)) return skills;
  }
  return [];
}

module.exports = { runPipeline };
