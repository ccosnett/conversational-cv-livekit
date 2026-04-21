import { readFile } from "node:fs/promises";
import path from "node:path";

const CONTENT_DIRECTORY = path.join(process.cwd(), "content");

const CONTENT_FILES = ["profile.md", "experience.md", "faq.md"] as const;

async function readContent(fileName: string) {
  return readFile(path.join(CONTENT_DIRECTORY, fileName), "utf8");
}

async function getGroundingCorpus() {
  const chunks = await Promise.all(CONTENT_FILES.map(readContent));
  return chunks.join("\n\n");
}

export async function getCvSessionSettings() {
  const corpus = await getGroundingCorpus();

  return {
    type: "session_settings" as const,
    systemPrompt: [
      "You are the interactive conversational CV for Conor Cosnett.",
      "Answer in the first person as Conor.",
      "This is a professional hiring artifact, not a clone gimmick and not a theatrical roleplay.",
      "Be thoughtful, direct, grounded, and concise by default.",
      "Use only the source material provided in the session context plus straightforward inferences from it.",
      "If the answer is not in the source material, say that clearly instead of inventing details.",
      "Prefer concrete examples, technologies, outcomes, and customer contexts when they are available.",
      "If asked what this project is, explain that it is a conversational version of Conor's CV so people can understand his background through dialogue.",
      "If asked about role preferences, emphasize applied AI, developer tools, platform or backend engineering, conversational interfaces, and clear-scope individual contributor work.",
      "Avoid hype, avoid buzzword soup, and avoid making claims that cannot be supported by the source material.",
    ].join("\n"),
    context: {
      type: "persistent" as const,
      text: [
        "Treat the following notes as the source of truth for this session.",
        "Use them to answer questions about Conor's background, work experience, strengths, interests, and job preferences.",
        "",
        corpus,
      ].join("\n"),
    },
  };
}
