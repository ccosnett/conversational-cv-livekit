import {
  ServerOptions,
  cli,
  defineAgent,
  voice,
} from "@livekit/agents";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { ConversationalCvAgent, GREETING, pickAnswer } from "./assistant.mjs";

dotenv.config({ path: ".env.local" });

const AGENT_NAME =
  process.env.LIVEKIT_AGENT_NAME ?? "conversational-cv-livekit";
const INFERENCE_STT_MODEL =
  process.env.LIVEKIT_INFERENCE_STT_MODEL ?? "deepgram/flux-general:en";
const INFERENCE_TTS_MODEL =
  process.env.LIVEKIT_INFERENCE_TTS_MODEL ??
  "cartesia/sonic-3:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc";
export default defineAgent({
  entry: async (ctx) => {
    console.log("agent_entry_started", {
      room: ctx.room.name,
      agentName: AGENT_NAME,
    });

    await ctx.connect();
    console.log("agent_room_connected", {
      room: ctx.room.name,
    });

    const participant = await ctx.waitForParticipant();
    console.log("agent_participant_linked", {
      room: ctx.room.name,
      participant: participant.identity,
    });

    const session = new voice.AgentSession({
      stt: INFERENCE_STT_MODEL,
      tts: INFERENCE_TTS_MODEL,
      turnHandling: {
        turnDetection: "stt",
      },
    });

    session.on("user_input_transcribed", (event) => {
      if (!event.isFinal) return;
      console.log("user_input_transcribed", {
        transcript: event.transcript,
      });
    });

    session.on("conversation_item_added", (event) => {
      console.log("conversation_item_added", {
        role: event.item.role,
        text:
          typeof event.item.textContent === "string"
            ? event.item.textContent
            : null,
      });
    });

    session.on("error", (event) => {
      const error =
        event.error instanceof Error
          ? { message: event.error.message, stack: event.error.stack }
          : event.error;

      console.error("agent_session_error", {
        source:
          event.source && typeof event.source === "object"
            ? event.source.constructor?.name
            : typeof event.source,
        error,
      });
    });

    console.log("agent_session_starting", {
      room: ctx.room.name,
      participant: participant.identity,
    });

    await session.start({
      agent: new ConversationalCvAgent(),
      room: ctx.room,
      inputOptions: {
        participantIdentity: participant.identity,
        textInputCallback: (_session, event) => {
          const { key, answer } = pickAnswer(event.text);

          console.log("deterministic_text_reply", {
            key,
            question: event.text,
          });

          session.say(answer, {
            addToChatCtx: true,
            allowInterruptions: false,
          });
        },
      },
      outputOptions: {
        syncTranscription: false,
      },
    });

    console.log("agent_session_started", {
      room: ctx.room.name,
      participant: participant.identity,
    });

    session.say(GREETING, {
      addToChatCtx: true,
      allowInterruptions: false,
    });

    console.log("agent_greeting_sent", {
      room: ctx.room.name,
      participant: participant.identity,
    });
  },
});

cli.runApp(
  new ServerOptions({
    agent: fileURLToPath(import.meta.url),
    agentName: AGENT_NAME,
  }),
);
