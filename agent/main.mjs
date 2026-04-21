import {
  ServerOptions,
  cli,
  defineAgent,
  voice,
} from "@livekit/agents";
import * as google from "@livekit/agents-plugin-google";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { ConversationalCvAgent } from "./assistant.mjs";

dotenv.config({ path: ".env.local" });

const AGENT_NAME =
  process.env.LIVEKIT_AGENT_NAME ?? "conversational-cv-livekit";
const GEMINI_LIVE_MODEL = process.env.GEMINI_LIVE_MODEL ?? "gemini-2.5-flash";
const GEMINI_LIVE_VOICE = process.env.GEMINI_LIVE_VOICE ?? "Puck";

export default defineAgent({
  entry: async (ctx) => {
    const session = new voice.AgentSession({
      llm: new google.beta.realtime.RealtimeModel({
        model: GEMINI_LIVE_MODEL,
        voice: GEMINI_LIVE_VOICE,
      }),
    });

    await session.start({
      agent: new ConversationalCvAgent(),
      room: ctx.room,
    });

    await ctx.connect();

    await session.generateReply({
      instructions:
        "Greet the visitor, explain that you are Conor's conversational CV, and invite questions about work experience, projects, strengths, or role preferences.",
    });
  },
});

cli.runApp(
  new ServerOptions({
    agent: fileURLToPath(import.meta.url),
    agentName: AGENT_NAME,
  }),
);
