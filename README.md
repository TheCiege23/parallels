# PARALLELS

A game about the multiverse of choices. Live the story, change one thing, or step back into a real turning point in your own life and watch the universe a different choice would have opened — written **live by AI**, grounded in the real history of that year.

This is the Stage 3 build: a tiny backend serves the game and generates personalized outcomes with the Anthropic API.

The frontend is split into **24 small, single-responsibility modules** (`public/js/`) so features can be worked on in parallel — see [`ARCHITECTURE.md`](ARCHITECTURE.md) for the module map and the load-order rule. Run `node tools/verify-modules.js` after any frontend edit.

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
- The server calls your AI provider (OpenAI or Anthropic) with a system prompt that grounds the outcome in the real era, personalizes it, keeps the tonal range (love / dark / funny / consequence / scary), and always leaves a thread of hope.
- It returns strict JSON `{ outcome, ripple, line, tone }`, which the game renders with the matching mood.
- The API key lives only on the server. It is never exposed to the browser.

## Providers

Set **either** provider's key. If both are set, Anthropic is used unless `AI_PROVIDER=openai`.

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Turns the AI on via OpenAI. Get one at https://platform.openai.com/api-keys |
| `OPENAI_MODEL` | OpenAI model. Default `gpt-4o-mini` (very cheap: $0.15/$0.60 per 1M tokens). |
| `ANTHROPIC_API_KEY` | Turns the AI on via Anthropic. Get one at https://console.anthropic.com |
| `PARALLELS_MODEL` | Anthropic model. Default `claude-haiku-4-5` ($1/$5 per 1M tokens). |
| `AI_PROVIDER` | Optional. Force `openai` or `anthropic`. Blank = auto-pick. |
| `PORT` | Port to listen on. Most hosts set this for you. |

Check `/healthz` to see which provider is active: `{"ok":true,"ai":true,"provider":"openai","model":"gpt-4o-mini"}`.

## Deploy

Any Node host works (Railway, Render, Fly, a VPS). The start command is `npm start`; set the env vars above in the host's dashboard. Nothing else to configure.

## Cost & honesty

Each AI outcome is a small API call (a few hundred tokens), so cost per play is low — but it is not zero, so keep an eye on usage. Outcomes are **plausible fiction, not predictions**; the game says so to the player.
