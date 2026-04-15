const SECTION_ALIASES = {
  skills: ["skills", "technical skills", "core skills"],
  techStack: ["tech stack", "technologies", "tools", "stack"],
  projects: ["projects", "project experience", "personal projects"],
};

const normalizeHeading = (line) => line.toLowerCase().replace(/[^a-z ]/g, "").trim();

const splitItems = (text) =>
  text
    .split(/[,|•\u2022]/)
    .map((item) => item.trim())
    .filter(Boolean);

export const extractResumeData = (rawText) => {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const sections = { skills: [], techStack: [], projects: [] };
  let currentSection = null;

  for (const line of lines) {
    const heading = normalizeHeading(line);

    if (SECTION_ALIASES.skills.includes(heading)) {
      currentSection = "skills";
      continue;
    }

    if (SECTION_ALIASES.techStack.includes(heading)) {
      currentSection = "techStack";
      continue;
    }

    if (SECTION_ALIASES.projects.includes(heading)) {
      currentSection = "projects";
      continue;
    }

    if (!currentSection) continue;

    if (currentSection === "projects") {
      sections.projects.push(line);
    } else {
      sections[currentSection].push(...splitItems(line));
    }
  }

  const unique = (items) => Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));

  return {
    text: rawText,
    skills: unique(sections.skills),
    techStack: unique(sections.techStack),
    projects: unique(sections.projects),
  };
};
