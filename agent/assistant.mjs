import { voice } from "@livekit/agents";

const GREETING =
  "Hi, I'm Conor's conversational CV. Ask me about Compass, Wolfram, my technical strengths, or the kinds of roles I'm looking for.";

const FAQ_ANSWERS = [
  {
    key: "who",
    matches: ["who are you", "tell me about yourself", "introduce yourself"],
    answer:
      "I'm a software engineer with a background in applied mathematics and physics. Most recently I worked at Compass Labs, and before that at Wolfram Research. I'm especially interested in applied AI, developer tools, APIs, backend systems, and conversational interfaces.",
  },
  {
    key: "compass",
    matches: ["compass", "defi", "aave"],
    answer:
      "At Compass Labs I worked on a universal DeFi API in Python using FastAPI and Pydantic. That included unsigned EVM transaction endpoints, generated Python and TypeScript SDK workflows from OpenAPI specs, analytics endpoints, gas-saving transaction bundling research, and product and developer-relations work. I also helped shape two agentic systems: a natural-language transaction interface and an internal monitoring agent that alerted the team when users hit problems.",
  },
  {
    key: "wolfram",
    matches: ["wolfram", "mathematica", "openai api integration"],
    answer:
      "At Wolfram I solved a large volume of technical problems for demanding customers, including advanced mathematics and programming issues. I became the team expert for OpenAI API integration into Mathematica, helped customers using Wolfram GPT and related tools, and later worked as a Customer Success Manager with top enterprise accounts.",
  },
  {
    key: "roles",
    matches: ["role", "roles", "looking for", "what next", "job", "jobs"],
    answer:
      "I'm mainly interested in clear-scope individual contributor roles across applied AI, developer tools, API or SDK engineering, backend or platform work, product engineering, and conversational interfaces. I like AI-native engineering cultures and I care a lot about building tools that genuinely increase leverage for users.",
  },
  {
    key: "skills",
    matches: ["skills", "technical strengths", "strengths", "best at", "tech stack"],
    answer:
      "My strongest technical themes are Python, FastAPI, Pydantic, API design, OpenAPI, generated SDK workflows, CI and CD, backend systems, LLM integrations, agentic patterns, and technical problem-solving. I'm also strong at explaining complex systems to real users and bridging product thinking with implementation.",
  },
  {
    key: "voice",
    matches: ["voice", "conversational ai", "why voice", "why are you interested in voice"],
    answer:
      "I care about conversational interfaces because conversation is one of the most natural ways people explore ideas, ask follow-up questions, and build trust. More broadly, I'm interested in intelligence augmentation: tools that help people think better and act more effectively. Voice and conversational systems sit right at that intersection of usability, product design, and applied AI.",
  },
  {
    key: "background",
    matches: ["background", "education", "galway", "mathematics", "physics"],
    answer:
      "My background includes first-class honours in both a Diploma in Applied Mathematics and a Bachelor of Science in Applied Physics from University of Galway. My applied mathematics thesis was about SAT solvers, and my physics thesis was about deep learning for exoplanet detection.",
  },
  {
    key: "project",
    matches: ["what is this project", "this project", "conversational cv"],
    answer:
      "This project is a conversational voice-based CV. The idea is that instead of scanning a PDF, someone can ask grounded questions about my background, projects, strengths, and role preferences through dialogue.",
  },
];

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function pickAnswer(question) {
  const normalized = normalize(question);

  if (!normalized) {
    return {
      key: "empty",
      answer:
        "Ask me about Compass, Wolfram, my technical strengths, or the kinds of roles I'm looking for.",
    };
  }

  for (const entry of FAQ_ANSWERS) {
    if (entry.matches.some((match) => normalized.includes(match))) {
      return { key: entry.key, answer: entry.answer };
    }
  }

  return {
    key: "fallback",
    answer:
      "I can answer grounded questions about Compass Labs, Wolfram Research, my technical strengths, my background, and the kinds of engineering roles I'm looking for. Try asking one of those directly.",
  };
}

export class ConversationalCvAgent extends voice.Agent {
  constructor() {
    super({
      instructions:
        "You are Conor Cosnett's conversational CV. Keep responses concise, grounded, and first person.",
    });
  }

  async onUserTurnCompleted(_chatCtx, newMessage) {
    const question = newMessage.textContent ?? "";
    const { key, answer } = pickAnswer(question);

    console.log("deterministic_reply", {
      key,
      question,
    });

    this.session.say(answer, {
      addToChatCtx: true,
      allowInterruptions: false,
    });
  }
}

export { GREETING, pickAnswer };
