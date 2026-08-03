# PARALLELS — Architecture (built for the gen-AI world)

The game used to be one 2,300-line `parallels.html`. Every edit touched the same
file, so two people (or two AI agents) working at once meant merge conflicts, and
even a tiny change made a model re-read the whole thing — slow and expensive.

Now it's **24 small, single-responsibility modules** (most ~60–210 lines). An agent
that only needs to touch "the horror pack" or "the audio engine" opens one file,
around ~70–200 lines, and never sees the rest. Different agents can work on
different features **in parallel** without stepping on each other. A cheaper/faster
model (e.g. Sonnet) can safely own one focused file.

## How it loads (the one rule that matters)

`public/parallels.html` is a thin shell. It links the stylesheet and then loads the
JS modules **in numeric order** as plain classic scripts:

```html
<link rel="stylesheet" href="css/styles.css">
...
<script src="js/01-data-story.js"></script>
<script src="js/02-core-state.js"></script>
...
<script src="js/24-boot.js"></script>
```

These are **classic scripts, not ES modules** — on purpose. Classic scripts all
share ONE global scope, so a `const STORY` defined in file 01 is visible to a
function in file 03 with no `import`/`export` wiring. It also means the game still
runs by double-clicking the file (`file://`) with no build step and no server.

**The load-order contract:**
1. Data/config files come before the engines that read them.
2. `24-boot.js` is always **last** — it's the only file that *runs* anything on
   load (`renderTitle()`). Everything above it only *defines* things.
3. To add a file, give it a number that places it correctly and add one
   `<script src>` line in the shell at the matching spot.

Because the split preserved the original top-to-bottom order exactly,
concatenating the 24 files reproduces the old single script byte-for-byte — so
behavior is identical. `tools/verify-modules.js` proves this on demand.

## Module map — who owns what

| # | File | Responsibility | Key symbols it defines |
|---|------|----------------|------------------------|
| 01 | `js/01-data-story.js` | "Live the Story" branching graph + universe-naming data | `DIMS`, `STORY`, `PAIR_NAMES`, `TRAIT`, `CLOSERS`, `HOPE` |
| 02 | `js/02-core-state.js` | Shared run state + DOM refs + reset | `nodeId`, `totals`, `journey`, `stage`, `resetRun()`, `domOf()` |
| 03 | `js/03-engine-story.js` | Story engine: title → router → endings → universe | `renderTitle()`, `go()`, `choose()`, `renderUniverse()`, `rarityOf()` |
| 04 | `js/04-engine-share.js` | Result share-card (canvas PNG) + viral links | `shareResult()`, `downloadCard()`, `copyLink()`, `drawShareCard()` |
| 05 | `js/05-data-history.js` | Real-era history data + era lookups | `HISTORY`, `eraDetail()`, `eraContext()`, `CURRENT_YEAR` |
| 06 | `js/06-data-lifestages.js` | "Your Own Life" life-stage scenes | `STAGES` |
| 07 | `js/07-life-import.js` | Facebook export importer (parsed in-browser, never uploaded) | `parseFacebookExport()`, `handleImportFiles()` |
| 08 | `js/08-life-events.js` | Turns an imported life event into a scene | `makeEventScene()` |
| 09 | `js/09-life-engine.js` | Life flow: intake → moment → scene → AI outcome | `renderProfileIntake()`, `renderMomentPicker()`, `renderLifeScene()`, `renderLifeOutcome()`, `fetchAIOutcome()` |
| 10 | `js/10-engine-immersion.js` | Web-Audio ambient + SFX + reveal animation | `initAudio()`, `startAmbient()`, `setMuted()`, `stageReveal()` |
| 11 | `js/11-life-share.js` | "The life I found" share card | `drawLifeCard()`, `shareLife()`, `downloadLife()` |
| 12 | `js/12-engine-starfield.js` | Animated starfield background | `resize()`, `tick()` |
| 13 | `js/13-engine-challenge.js` | Decode a shared "challenge" link | `walkPath()`, `parseChallenge()`, `incomingChallenge` |
| 14 | `js/14-config-tone.js` | Tone palette shared by life + shift modes | `TONE` |
| 15 | `js/15-data-pack-mix.js` | "Change One Thing" — original mixed pack | `SHIFTS` |
| 16 | `js/16-data-pack-horror.js` | Themed pack: horror | `HORROR_PACK` |
| 17 | `js/17-data-pack-comedy.js` | Themed pack: comedy | `COMEDY_PACK` |
| 18 | `js/18-data-pack-love.js` | Themed pack: love | `LOVE_PACK` |
| 19 | `js/19-data-pack-ceo.js` | Themed pack: founder/CEO | `CEO_PACK` |
| 20 | `js/20-data-pack-family.js` | Themed pack: family | `FAMILY_PACK` |
| 21 | `js/21-data-pack-sports.js` | Themed pack: sports ("The Big Leagues") | `SPORTS_PACK` |
| 22 | `js/22-data-packs.js` | Pack registry + active-pack state | `PACKS`, `activePack`, `shiftIdx` |
| 23 | `js/23-engine-packs.js` | Pack picker + shift/ripple rendering | `startShiftMode()`, `renderPackPicker()`, `renderShift()`, `renderRipple()` |
| 24 | `js/24-boot.js` | **Entry point** — starts the app | (runs `renderTitle()`) |

Styling lives entirely in `css/styles.css`.

## Common edits, and the one file each touches

- **Tweak a themed pack's vignettes** → its `16–21` file only.
- **Add a brand-new pack** → add `js/NN-data-pack-<name>.js` (define `<NAME>_PACK`),
  register it in `22-data-packs.js`, and add one `<script src>` line in the shell
  before file 22. Nothing else changes.
- **Change the mood colors** → `14-config-tone.js`.
- **Adjust sound** → `10-engine-immersion.js`.
- **Change the AI prompt / model / provider** → `server.js` (backend, unchanged by
  this refactor).
- **Reword the real-history eras** → `05-data-history.js`.

## Verify after any edit

```bash
node tools/verify-modules.js
```

It syntax-checks all 24 modules and confirms the shell lists them in the right
order. For a full behavior pass, run the app (`npm start`) and click through the
three modes.
