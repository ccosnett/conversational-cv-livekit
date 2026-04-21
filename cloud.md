# Conversational CV LiveKit Cloud Notes

This file covers the operational side of the project:
- env vars
- local run model
- cloud responsibilities
- deployment split
- failure modes

Pair this with [spec.md](/Users/johncosnett/PycharmProjects/conversational-cv-livekit/spec.md), which focuses on architecture and runtime behavior.

## 1. Environment variables

Runtime env lives in `.env.local`.

Important keys:
- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `GOOGLE_API_KEY`
- `LIVEKIT_AGENT_NAME`
- `NEXT_PUBLIC_LIVEKIT_AGENT_NAME`
- `GEMINI_LIVE_MODEL`
- `GEMINI_LIVE_VOICE`

What each one does:
- `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`: authenticate token generation and worker registration with LiveKit
- `GOOGLE_API_KEY`: authenticates Gemini Live
- `LIVEKIT_AGENT_NAME`: the worker name registered with LiveKit
- `NEXT_PUBLIC_LIVEKIT_AGENT_NAME`: the agent the browser asks LiveKit to join
- `GEMINI_LIVE_MODEL`: the realtime Gemini model name
- `GEMINI_LIVE_VOICE`: the built-in Gemini voice preset

Important model note:
- this project needs a realtime-supported Gemini Live model
- a plain text model like `gemini-2.5-flash` is not enough
- current working default:
  `gemini-2.5-flash-native-audio-preview-12-2025`

## 2. Local run model

Locally the app is two processes, not one:
- `npm run dev`
- `npm run agent:dev`

Why:
- `npm run dev` runs Next.js for the web app and token endpoint
- `npm run agent:dev` runs the LiveKit worker that answers the call

If the site is up but the worker is not, the page can still mint tokens and
join rooms, but no useful voice agent will answer.

## 3. Who owns what in production

This system is split across four layers.

### 3.1 Next.js app

Owns:
- page rendering
- token minting
- browser UX
- transcript UI

Can be deployed to:
- Vercel
- another Node host
- basically any Next-compatible host

### 3.2 LiveKit Cloud

Owns:
- realtime rooms
- agent dispatch
- participant orchestration
- audio/session transport

### 3.3 Gemini Live

Owns:
- realtime reasoning
- speech generation
- tool-use planning inside the session

### 3.4 Your worker code

Owns:
- persona
- prompt
- tool definitions
- corpus lookup behavior

This split is useful because transport stays in LiveKit, generation stays in
Gemini, and product logic stays in your repo.

## 4. Deployment model

The project is deployed as two separate units.

### 4.1 Web app deployment

Deploy the Next.js app wherever you like. It needs the same env values that the
token route depends on:
- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `NEXT_PUBLIC_LIVEKIT_AGENT_NAME`

It may also need other presentational env vars if the UI grows.

### 4.2 Agent deployment

Deploy the LiveKit agent separately with the LiveKit CLI:
- `lk cloud auth`
- `lk agent create`

The worker needs:
- LiveKit credentials
- Google API key
- agent name
- Gemini model/voice config

The key mental model:
- the web app is not the agent
- the agent is not the token service
- both are required for the full product

## 5. Security model

Security boundaries:
- browser never sees `LIVEKIT_API_SECRET`
- browser never sees `GOOGLE_API_KEY`
- server mints short-lived participant tokens
- worker talks to Gemini using server-side env only

This is a reasonable MVP security model for a demo app.

## 6. Failure modes already encountered

These are the main real breakages we hit while wiring the project.

### 6.1 Wrong Google import path

Broken:
- `google.realtime.RealtimeModel`

Working:
- `google.beta.realtime.RealtimeModel`

### 6.2 Invalid Google API key

If `.env.local` still contains the placeholder value, Gemini rejects the
session immediately.

### 6.3 Wrong Gemini model name

A plain text model like `gemini-2.5-flash` can pass basic API checks but fail
for realtime LiveKit audio sessions.

### 6.4 Missing worker process

If the page is running but `npm run agent:dev` is not, the browser can fetch
tokens but no useful agent joins.

### 6.5 Browser autoplay restrictions

If audio is blocked, the user must click `Enable audio`.

## 7. Debug checklist

If the app feels broken, check in this order:
1. does `http://localhost:3000` load?
2. does `POST /api/token` return `200`?
3. is the worker process running?
4. did the worker register with LiveKit?
5. is `GOOGLE_API_KEY` real?
6. is `GEMINI_LIVE_MODEL` a realtime model?
7. did the browser join the LiveKit room?
8. did autoplay block audio?

## 8. Operational caveats

Worth knowing:
- each session uses a fresh random room
- there is no persistent cross-session memory
- corpus loading is cached in the worker process, so corpus edits are safest
  after restarting the worker
- the current voice is a Gemini preset, not a cloned Conor voice
