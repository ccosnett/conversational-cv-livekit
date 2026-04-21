"use client";

import Image from "next/image";
import { FormEvent, useCallback, useMemo, useState } from "react";
import {
  RoomAudioRenderer,
  useAgent,
  useAudioPlayback,
  useSession,
  useSessionMessages,
} from "@livekit/components-react";
import { TokenSource } from "livekit-client";

const SUGGESTIONS = [
  "Who are you?",
  "What did you do at Compass?",
  "What did you do at Wolfram?",
  "What roles are you looking for?",
  "What are your strongest technical skills?",
  "Why are you interested in voice and conversational AI?",
];

function PhoneIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5.15 12.8 19.8 19.8 0 0 1 2.08 4.09 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.35 1.78.68 2.62a2 2 0 0 1-.45 2.11L8 9.94a16 16 0 0 0 6.06 6.06l1.49-1.29a2 2 0 0 1 2.11-.45c.84.33 1.72.56 2.62.68A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

const AGENT_NAME =
  process.env.NEXT_PUBLIC_LIVEKIT_AGENT_NAME ||
  "conversational-cv-livekit";

function CallUI() {
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const tokenSource = useMemo(() => TokenSource.endpoint("/api/token"), []);
  const session = useSession(
    tokenSource,
    AGENT_NAME ? { agentName: AGENT_NAME } : undefined,
  );
  const { state: agentState, failureReasons } = useAgent(session);
  const { messages, send, isSending } = useSessionMessages(session);
  const { canPlayAudio, startAudio } = useAudioPlayback(session.room);

  const isConnected = session.isConnected;
  const isConnecting = session.connectionState === "connecting";

  const handleClick = useCallback(async () => {
    setError(null);
    try {
      if (isConnected) {
        await session.end();
      } else {
        await session.start();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, [isConnected, session]);

  const handleSend = useCallback(
    async (text: string) => {
      const value = text.trim();
      if (!value) return;

      try {
        setError(null);
        if (!isConnected) {
          await session.start();
        }
        await send(value);
        setDraft("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Message send failed");
      }
    },
    [isConnected, send, session],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await handleSend(draft);
    },
    [draft, handleSend],
  );

  const liveError =
    error ?? failureReasons?.find((reason) => reason)?.toString() ?? null;

  const statusText = liveError
    ? `Error: ${liveError}`
    : !isConnected
      ? isConnecting
        ? "Connecting to LiveKit..."
        : "Ready"
      : agentState === "thinking"
        ? "Thinking..."
        : agentState === "speaking"
          ? "Speaking"
          : agentState === "listening"
            ? "Listening"
            : agentState === "initializing"
              ? "Agent joining..."
              : "Connected - ask away";

  const buttonLabel = isConnected
    ? "Hang up"
    : isConnecting
      ? "Connecting..."
      : "Start conversation";

  return (
    <main className="min-h-screen px-6 py-12 text-stone-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-stone-300/80 bg-white/75 p-8 shadow-[0_24px_80px_rgba(64,44,17,0.08)] backdrop-blur">
            <div className="inline-flex rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-stone-600">
              Interactive conversational CV
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              Talk through Conor&apos;s background instead of scanning a PDF.
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-700">
              Ask about Compass, Wolfram, technical strengths, projects, or the
              kinds of engineering roles he wants next. The voice session is
              grounded on a small hand-written corpus rather than generic AI
              improvisation.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleClick}
                disabled={isConnecting}
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition ${
                  isConnected
                    ? "bg-red-500 text-white hover:bg-red-400"
                    : "bg-stone-950 text-stone-50 hover:bg-stone-800"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {!isConnected ? <PhoneIcon /> : null}
                {buttonLabel}
              </button>

              {!canPlayAudio ? (
                <button
                  type="button"
                  onClick={() => startAudio()}
                  className="rounded-full border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                >
                  Enable audio
                </button>
              ) : null}

              <div className="rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm text-stone-700">
                {statusText}
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-stone-300 bg-stone-50/80 p-4">
                <p className="text-sm font-semibold text-stone-900">Grounded</p>
                <p className="mt-1 text-sm text-stone-600">
                  Uses curated CV notes and recruiter-style FAQs via agent
                  tools.
                </p>
              </div>
              <div className="rounded-2xl border border-stone-300 bg-stone-50/80 p-4">
                <p className="text-sm font-semibold text-stone-900">Honest</p>
                <p className="mt-1 text-sm text-stone-600">
                  If something is not in the source material, it should say so.
                </p>
              </div>
              <div className="rounded-2xl border border-stone-300 bg-stone-50/80 p-4">
                <p className="text-sm font-semibold text-stone-900">
                  LiveKit + Gemini
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  Voice runtime on LiveKit, responses on Gemini Live.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Try asking
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => void handleSend(suggestion)}
                    className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-stone-300/80 bg-[#10261f] p-8 text-stone-100 shadow-[0_24px_80px_rgba(20,34,28,0.24)]">
            <Image
              src="/me.png"
              alt="Conor Cosnett"
              width={180}
              height={180}
              priority
              className="h-32 w-32 rounded-[1.5rem] border border-white/10 object-cover shadow-2xl"
            />

            <h2 className="mt-6 text-3xl font-semibold">Conor Cosnett</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.24em] text-emerald-200/70">
              Applied AI and product engineering
            </p>

            <div className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
              <p>
                Most recently: Founding Engineer at Compass Labs, building DeFi
                APIs, SDK tooling, analytics, and agentic systems.
              </p>
              <p>
                Previously: Customer-facing Software Engineer and Customer
                Success Manager at Wolfram Research. I did the work of a Forward Deployed Engineer.
              </p>
              <p>
                Background: first-class honours in Mathematics and
                Physics from University of Galway.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <a
                href="https://github.com/ccosnett"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 px-4 py-2 text-stone-100 transition hover:bg-white/10"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/conorcosnett/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 px-4 py-2 text-stone-100 transition hover:bg-white/10"
              >
                LinkedIn
              </a>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-stone-300">
              <p className="font-semibold text-stone-100">Local dev</p>
              <p className="mt-2">
                Run <code>npm run agent:dev</code> in one terminal and{" "}
                <code>npm run dev</code> in another.
              </p>
            </div>
          </aside>
        </section>

        <section className="rounded-[2rem] border border-stone-300/80 bg-white/80 p-6 shadow-[0_24px_80px_rgba(64,44,17,0.08)] backdrop-blur">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-stone-950">
                Live transcript
              </h2>
              <p className="text-sm text-stone-600">
                The assistant only renders user and assistant messages here.
              </p>
            </div>
          </div>

          <div className="mt-6 flex min-h-72 flex-col gap-3 rounded-[1.5rem] border border-stone-200 bg-stone-50/70 p-4">
            {messages.length === 0 ? (
              <div className="flex min-h-60 items-center justify-center rounded-[1.25rem] border border-dashed border-stone-300 bg-white/70 p-6 text-center text-sm leading-7 text-stone-500">
                Start a call and ask about Conor&apos;s background, Compass Labs,
                Wolfram Research, technical strengths, or the roles he wants next.
              </div>
            ) : (
              messages.map((msg) => {
                const isLocal = msg.from?.isLocal ?? false;

                if (isLocal) {
                  return (
                    <div
                      key={msg.id}
                      className="max-w-[85%] self-end rounded-2xl bg-stone-950 px-4 py-3 text-sm leading-7 text-stone-50"
                    >
                      {msg.message}
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className="max-w-[85%] self-start rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-7 text-stone-900"
                  >
                    {msg.message}
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type a recruiter or interviewer question..."
              className="flex-1 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-500"
            />
            <button
              type="submit"
              disabled={isSending || draft.trim().length === 0}
              className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </form>
        </section>
      </div>
      <RoomAudioRenderer room={session.room} />
    </main>
  );
}

export default function Call() {
  return <CallUI />;
}
