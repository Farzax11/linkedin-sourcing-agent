const OpenAI = require('openai');

let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/**
 * Generates a personalized outreach message using OpenAI if available,
 * otherwise falls back to smart templates.
 */
async function generateMessage(candidate, jobRole) {
  if (openai) {
    try {
      return await generateWithOpenAI(candidate, jobRole);
    } catch (err) {
      console.warn('OpenAI failed, falling back to template:', err.message);
      return generateWithTemplate(candidate, jobRole);
    }
  }
  return generateWithTemplate(candidate, jobRole);
}

async function generateWithOpenAI(candidate, jobRole) {
  const prompt = `You are a professional tech recruiter writing a personalized LinkedIn outreach message.

Candidate Profile:
- Name: ${candidate.name}
- Current Role: ${candidate.currentRole} at ${candidate.company}
- Skills: ${candidate.skills.join(', ')}
- Experience: ${candidate.experience} years
- Location: ${candidate.location}

Job Role We're Hiring For: ${jobRole}

Write a short, warm, human-like LinkedIn message (3-4 sentences max). 
- Address them by first name
- Reference 1-2 specific skills that match the role
- Sound genuine, not like a template
- End with a soft call to action
- Do NOT use generic phrases like "I hope this message finds you well"`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
    temperature: 0.85,
  });

  return response.choices[0].message.content.trim();
}

const templates = [
  (name, role, skills, jobRole) =>
    `Hi ${name}, your background as a ${role} really caught my attention — especially your work with ${skills}. We're looking for a ${jobRole} and I think you'd be a great fit. Would you be open to a quick chat?`,

  (name, role, skills, jobRole) =>
    `Hey ${name}! I came across your profile and was impressed by your ${skills} experience. We're hiring a ${jobRole} and your ${role} background aligns really well. Mind if I share more details?`,

  (name, role, skills, jobRole) =>
    `Hi ${name}, I've been searching for strong ${jobRole} candidates and your profile stood out. Your expertise in ${skills} as a ${role} is exactly what our team needs. Would love to connect if you're open to it.`,

  (name, role, skills, jobRole) =>
    `Hello ${name}! Your ${role} experience and skills in ${skills} are a rare combination we're looking for in a ${jobRole} role. I'd love to tell you more about the opportunity — are you open to exploring it?`,
];

function generateWithTemplate(candidate, jobRole) {
  const { name, currentRole, skills } = candidate;
  const topSkills = skills.slice(0, 2).join(' and ');
  const idx = Math.floor(Math.random() * templates.length);
  return templates[idx](name, currentRole, topSkills, jobRole);
}

module.exports = { generateMessage };
