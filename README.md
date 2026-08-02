# PARALLELS

A game about the multiverse of choices. Live the story, change one thing, or step back into a real turning point in your own life and watch the universe a different choice would have opened — written **live by AI**, grounded in the real history of that year.

This is the Stage 3 build: a tiny backend serves the game and generates personalized outcomes with the Anthropic API.

## Run it locally

```bash
# 1. (optional) turn the AI engine on
cp .env.example .env      # then paste your ANTHROPIC_API_KEY into .env
#    On most shells you can also just export it:
#    export ANTHROPIC_API_KEY=sk-ant-...

# 2. start it (no npm install needed — zero dependencies, pure Node 18+)
npm start

# 3. open http://localhost:3000
```

Without an API key the game runs fine — the "Your Own Life" mode falls back to its built-in written outcomes. Add the key and those outcomes become AI-written, personalized, and infinite.

## How the AI engine works

- The browser posts the player's profile + the chosen turning point to `POST /api/generate`.
- The server calls the Anthropic API with a system prompt that grounds the outcome in the real era, personalizes it, keeps the tonal range (love / dark / funny / consequence / scary), and always leaves a thread of hope.
- It returns strict JSON `{ outcome, ripple, line, tone }`, which the game renders with the matching mood.
- The API key lives only on the server. It is never exposed to the browser.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `ANTHROPIC_API_KEY` | Turns the AI engine on. Get one at https://console.anthropic.com |
| `PARALLELS_MODEL` | Which model writes outcomes. Default `claude-3-5-haiku-latest` (cheap + fast). |
| `PORT` | Port to listen on. Most hosts set this for you. |

## Deploy

Any Node host works (Railway, Render, Fly, a VPS). The start command is `npm start`; set the env vars above in the host's dashboard. Nothing else to configure.

## Cost & honesty

Each AI outcome is a small API call (a few hundred tokens), so cost per play is low — but it is not zero, so keep an eye on usage. Outcomes are **plausible fiction, not predictions**; the game says so to the player.
