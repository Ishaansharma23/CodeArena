const DEFAULT_CHUNK_SIZE = 900;
const DEFAULT_CHUNK_OVERLAP = 160;

const normalizeText = (text) =>
  String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/[\t ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export const chunkText = (text, { chunkSize = DEFAULT_CHUNK_SIZE, chunkOverlap = DEFAULT_CHUNK_OVERLAP } = {}) => {
  const normalizedText = normalizeText(text);
  if (!normalizedText) return [];

  const chunks = [];
  let start = 0;

  while (start < normalizedText.length) {
    let end = Math.min(start + chunkSize, normalizedText.length);

    if (end < normalizedText.length) {
      const lastBreak = normalizedText.lastIndexOf("\n", end);
      const lastSentence = normalizedText.lastIndexOf(". ", end);
      const preferredEnd = Math.max(lastBreak, lastSentence);

      if (preferredEnd > start + Math.floor(chunkSize * 0.6)) {
        end = preferredEnd + 1;
      }
    }

    const chunk = normalizedText.slice(start, end).trim();
    if (chunk) chunks.push(chunk);

    if (end >= normalizedText.length) break;
    start = Math.max(end - chunkOverlap, start + 1);
  }

  return chunks;
};

export const buildResumeChunks = (resumeText, resumeMeta = {}) => {
  const chunks = [];
  const uniqueList = (items) => Array.from(new Set((items || []).map((item) => String(item || "").trim()).filter(Boolean)));

  const pushSection = (section, lines) => {
    const cleanLines = uniqueList(lines);
    if (!cleanLines.length) return;

    chunks.push({
      section,
      text: cleanLines.join(" | "),
    });
  };

  pushSection("skills", resumeMeta.skills);
  pushSection("techStack", resumeMeta.techStack);
  pushSection("projects", resumeMeta.projects);

  const bodyChunks = chunkText(resumeText);
  bodyChunks.forEach((text, index) => {
    chunks.push({
      section: "resumeText",
      text,
      chunkIndex: index,
    });
  });

  return chunks;
};
