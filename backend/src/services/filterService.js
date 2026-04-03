/**
 * Filters candidates by minimum experience and required skills.
 */
function filterCandidates(candidates, { minExperience = 0, skills = [] }) {
  return candidates.filter((c) => {
    const meetsExp = c.experience >= minExperience;
    const meetsSkills =
      skills.length === 0 ||
      skills.some((s) =>
        c.skills.map((cs) => cs.toLowerCase()).includes(s.toLowerCase())
      );
    return meetsExp && meetsSkills;
  });
}

module.exports = { filterCandidates };
