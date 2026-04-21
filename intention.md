# intention.md

## Purpose

I want to build an interactive conversational version of my CV: a speech-to-speech agent that can speak in my voice and answer questions about my background, work experience, technical decisions, and interests.

This is not meant to be a gimmick or a philosophical "digital clone." It is meant to be a practical hiring artifact: a way for recruiters, founders, and engineers to understand me through conversation rather than static text.

The project should demonstrate that I can build useful AI products, design good conversational interfaces, and present technical work clearly.

## Core idea

The product is an **interactive voice CV**.

A user can speak to it naturally and ask questions such as:

- Who are you?
- What did you do at Compass?
- What kinds of engineering roles are you looking for?
- What are your strongest technical skills?
- Why are you interested in conversational AI and voice interfaces?
- Tell me about a project you are proud of.
- What is your experience with APIs, LLMs, DeFi, or customer-facing engineering?

The system responds in a voice based on mine, using grounded information from my CV and selected supporting materials.

## Goals

### Primary goals

- Make my background more memorable than a normal CV.
- Show my ability to build a polished AI product quickly.
- Demonstrate product taste around conversation as an interface.
- Help potential employers understand me in a more natural and engaging way.
- Create something I can share directly in job applications, outreach messages, and LinkedIn.

### Secondary goals

- Learn more about real-world conversational system design.
- Build a reusable framework for voice-based personal agents.
- Create a strong portfolio piece for roles in applied AI, conversational AI, product engineering, or voice-related work.

## Non-goals

To stay focused, this project is **not** intended to be:

- a deep personality-cloning project
- a general AI companion
- a research project on speech modeling
- a perfectly faithful simulation of my inner life
- an attempt to train speech models from scratch
- a cinematic avatar or visual character project

The priority is usefulness, speed, clarity, and polish.

## Product framing

The project should be framed professionally.

Preferred framing:

- **Interactive conversational CV**
- **Voice-based portfolio**
- **Speech interface for exploring my experience**
- **Conversational candidate profile**

Less preferred framing:

- "AI clone of me"
- "Digital twin"
- "Talk to my virtual self"

Those may be catchy, but they risk sounding unserious or distracting from the real value.

## What the system should communicate about me

The agent should make it easy to understand that I am:

- a strong applied software engineer
- highly agentic and self-directed
- experienced with LLMs, APIs, backend systems, and developer tools
- comfortable in startup environments
- unusually strong at explaining technical ideas to real users
- interested in conversational interfaces and tools that augment human intelligence

## User experience principles

### 1. Fast and clear
The system should feel responsive enough to support a real conversation.

### 2. Grounded
It should answer from real information about me, not improvise wildly.

### 3. Honest
If it does not know something, it should say so.

### 4. Flexible
It should give both short and long answers depending on context.

### 5. Professional
It should sound thoughtful, direct, and intelligent, not theatrical.

### 6. Memorable
It should leave the user with a stronger impression than a PDF CV would.

## Intended audience

This project is primarily for:

- startup founders
- hiring managers
- recruiters
- technical interviewers
- product teams hiring applied AI / product / backend engineers

It is especially useful for people who would rather understand a candidate through conversation than by scanning a document.

## MVP definition

The minimum viable version should include:

- a simple web interface
- push-to-talk or live voice input
- speech output in a voice based on mine
- grounding on my CV and curated project notes
- the ability to answer common recruiter and interviewer questions
- clear fallback behavior when uncertain
- a short explanation on the homepage of what the demo is

That is enough for the first version.

## Suggested capabilities

### Must-have

- "Tell me about your background."
- "What did you build at Compass?"
- "What did you do at Wolfram?"
- "What roles are you looking for?"
- "What are your main technical strengths?"
- "Why are you interested in voice / conversational AI?"

### Nice-to-have

- recruiter mode
- founder mode
- technical interviewer mode
- short answer / detailed answer toggle
- links to GitHub, CV, and relevant projects
- shareable transcript or summary after the conversation

## Data sources

The system should be grounded on a small, high-quality corpus, not an uncontrolled pile of text.

Possible sources:

- my CV
- short structured summaries of each role
- project summaries
- a list of common interview questions with ideal answers
- GitHub links to selected repos
- optional short notes about what kind of role I want next

The source material should be curated and factual.

## Technical approach

The fastest sensible implementation is a hybrid stack:

- a strong LLM for reasoning and response generation
- speech-to-text for user input
- text-to-speech or voice cloning for output
- a lightweight web app as the interface
- retrieval or structured prompting for grounding

The point is not to reinvent speech infrastructure.  
The point is to build a convincing product quickly.

## Quality bar

The demo should feel like:

- a product, not a hack
- a coherent expression of my strengths
- something that could plausibly be useful in hiring

A weak but polished demo is better than a technically ambitious but unfinished one.

## Risks

### 1. Novelty without substance
If the system is only "cool," it will not help much. It must reveal useful information about me.

### 2. Hallucination
If it invents facts about my work, the demo becomes untrustworthy.

### 3. Excessive ambition
If I try to perfectly clone myself, I will lose time and miss the real opportunity.

### 4. Poor framing
If I market it as a strange self-replication experiment, employers may not know how to interpret it.

## Success criteria

I will consider this successful if:

- it works reliably enough to share publicly
- a recruiter can understand my background by talking to it
- it makes me more memorable than a standard CV
- it demonstrates real engineering and product ability
- I can include it in outreach and applications with confidence

## Example positioning

Possible one-line description:

> I built an interactive voice-based CV: a conversational agent that answers questions about my background, projects, and technical decisions in natural language using speech.

Possible short explanation for a homepage:

> This is a conversational version of my CV. You can speak to it and ask about my experience, projects, technical background, and the kinds of roles I am looking for.

## Why this matters

My broader belief is that conversation is one of the most natural interfaces humans have. Static documents are useful, but they do not capture how a person thinks, explains, prioritizes, and responds.

This project is a practical embodiment of that idea.

It lets me present myself in the medium I care most about, while also demonstrating the type of work I want to do.

## Final principle

Build the smallest version that feels real.

Do not chase perfect selfhood.
Do not chase artificial depth.
Build something grounded, polished, useful, and shareable.
