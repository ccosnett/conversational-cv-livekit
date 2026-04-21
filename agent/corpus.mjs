import { readFile } from "node:fs/promises";
import path from "node:path";

const CONTENT_DIRECTORY = path.join(process.cwd(), "content");
const CONTENT_FILES = ["profile.md", "experience.md", "faq.md"];

let cachedChunksPromise;

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function flushChunk(chunks, lines, source, headings) {
  const text = lines.join(" ").trim();

  if (!text) return;

  chunks.push({
    source,
    heading: headings.at(-1) ?? source.replace(".md", ""),
    text,
    normalized: normalize(text),
  });
}

function splitMarkdownIntoChunks(markdown, source) {
  const chunks = [];
  const headings = [];
  const lines = markdown.split("\n");
  let buffer = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushChunk(chunks, buffer, source, headings);
      buffer = [];
      continue;
    }

    if (line.startsWith("#")) {
      flushChunk(chunks, buffer, source, headings);
      buffer = [];
      headings.push(line.replace(/^#+\s*/, ""));
      continue;
    }

    buffer.push(line.replace(/^- /, ""));
  }

  flushChunk(chunks, buffer, source, headings);
  return chunks;
}

async function loadChunks() {
  const files = await Promise.all(
    CONTENT_FILES.map(async (fileName) => {
      const fullPath = path.join(CONTENT_DIRECTORY, fileName);
      const content = await readFile(fullPath, "utf8");

      return splitMarkdownIntoChunks(content, fileName);
    }),
  );

  return files.flat();
}

export async function getCorpusChunks() {
  cachedChunksPromise ??= loadChunks();
  return cachedChunksPromise;
}

export async function getCorpusOverview() {
  const chunks = await getCorpusChunks();
  const headings = [...new Set(chunks.map((chunk) => `${chunk.source}: ${chunk.heading}`))];

  return headings.join("\n");
}

export async function searchCorpus(query, limit = 5) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return "No query provided.";

  const normalizedQuery = normalize(trimmedQuery);
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const chunks = await getCorpusChunks();

  const ranked = chunks
    .map((chunk) => {
      let score = 0;

      for (const token of tokens) {
        if (chunk.normalized.includes(token)) {
          score += 1;
        }
      }

      if (chunk.normalized.includes(normalizedQuery)) {
        score += 3;
      }

      return { ...chunk, score };
    })
    .filter((chunk) => chunk.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);

  if (ranked.length === 0) {
    return `No grounded notes matched "${trimmedQuery}".`;
  }

  return ranked
    .map(
      (chunk, index) =>
        `${index + 1}. [${chunk.source} / ${chunk.heading}]\n${chunk.text}`,
    )
    .join("\n\n");
}
