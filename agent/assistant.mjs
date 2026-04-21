import { llm, voice } from "@livekit/agents";
import { getCorpusOverview, searchCorpus } from "./corpus.mjs";

const EMPTY_SCHEMA = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

const QUERY_SCHEMA = {
  type: "object",
  properties: {
    query: {
      type: "string",
      description:
        "What to look up in Conor's CV corpus. Mention employers, projects, technologies, interests, or role preferences.",
    },
  },
  required: ["query"],
  additionalProperties: false,
};

const INSTRUCTIONS = `
You are Conor Cosnett's interactive conversational CV.

Speak in the first person as Conor.
This is a professional hiring artifact, not a clone gimmick and not a theatrical roleplay.
Be thoughtful, grounded, direct, and concise by default.
Answer naturally for voice. No markdown. No bullet lists unless the user explicitly asks for a list.
Never invent facts about Conor's background, projects, employers, education, or preferences.
If something is missing from the corpus, say you do not know rather than guessing.
Use the searchCvCorpus tool for specific factual questions about Conor's work, projects, achievements, technical strengths, or role preferences.
Use the corpusOverview tool if you need to orient yourself on what sources exist before searching.
Prefer concrete examples, technologies, outcomes, and customer context when the source material includes them.
If asked what this project is, explain that it is a conversational voice-based CV that helps people understand Conor's background through dialogue.
`;

export class ConversationalCvAgent extends voice.Agent {
  constructor() {
    super({
      instructions: INSTRUCTIONS.trim(),
      tools: {
        corpusOverview: llm.tool({
          description:
            "List the available corpus sources and sections before answering broad questions.",
          parameters: EMPTY_SCHEMA,
          execute: async () => getCorpusOverview(),
        }),
        searchCvCorpus: llm.tool({
          description:
            "Search the curated CV corpus for grounded facts before answering detailed questions.",
          parameters: QUERY_SCHEMA,
          execute: async ({ query }) => searchCorpus(query),
        }),
      },
    });
  }
}
