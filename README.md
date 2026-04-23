# Conversational CV LiveKit

An interactive voice-based CV for exploring Conor Cosnett's background,
projects, technical strengths, and role preferences through conversation.

## What this repo does

This repo now has two pieces:

- a small Next.js web app for the call UI and transcript
- a LiveKit voice agent powered by LiveKit.ai

The voice agent is grounded from local content files in `content/` and uses
tool calls to search that corpus during the conversation.

## Corpus files

The fastest way to improve the demo is to edit these files:

- `content/profile.md`
- `content/experience.md`
- `content/faq.md`

Those files are the grounded source material used by the LiveKit agent's
instructions and search tools.

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` from `.env.example` and set:

   - `LIVEKIT_API_KEY`
   - `LIVEKIT_API_SECRET`
   - `LIVEKIT_URL`
   - `NEXT_PUBLIC_CONOR_PHONE_NUMBER` (optional real-world call CTA)
   - `NEXT_PUBLIC_CONOR_PHONE_LABEL` (optional button copy)

3. Start the LiveKit agent worker:

   ```bash
   npm run agent:dev
   ```

4. In a second terminal, start the web app:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Deploying the agent

Install and authenticate the LiveKit CLI:

```bash
brew install livekit-cli
lk cloud auth
```

Then deploy from the repo root:

```bash
lk agent create
```

## Deployment

Deploy the Next.js app wherever you like and add the same environment variables.
Deploy the LiveKit agent separately with `lk agent create`.

## Product intention

The original project brief lives in [intention.md](./intention.md).

For a deeper architecture walkthrough, see [spec.md](./spec.md).
