/* PARALLELS — Real-era history data + era lookups
   Part of a modular, single-responsibility build. Load order matters: this is file 05/24. Classic script (shared global scope). */
/* ============================================================
   YOUR OWN LIFE — personalization (Stage 1 of the big vision)
   Enter real details, pick a real turning point, make a different
   choice, see the universe it opens. In-memory only; nothing saved.
   ============================================================ */
const CURRENT_YEAR = new Date().getFullYear();
let profile = null;

function esc(s){ return (s==null?'':String(s)).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

// Deep historical layer — vibe + real world/money/culture texture per era.
const HISTORY = [
  { from:2024, to:9999, vibe:"AI everywhere and prices that won't quit",
    world:"AI tools were suddenly in everything, the pandemic had faded into a strange memory, and the world felt like it was rewriting its own rules in real time.",
    money:"Prices and interest rates stayed stubbornly high, good jobs were fiercely competitive, and everyone had opinions about whether a house would ever be affordable again.",
    culture:"Work was hybrid, attention was scattered across a dozen apps, and 'wait, is this real or AI?' had become a normal question to ask about almost anything." },
  { from:2021, to:2023, vibe:"reopening, inflation, and the Great Resignation",
    world:"The world cautiously reopened after lockdown, everything cost more than it used to, and millions of people quit jobs to chase something that actually mattered.",
    money:"Inflation spiked hard, remote work went mainstream, wages finally nudged up, and crypto and side hustles were the dinner-table conversation.",
    culture:"Everyone lived on video calls, streamed everything, and quietly re-examined what they wanted their whole life to be for." },
  { from:2020, to:2020, vibe:"the year the whole world stopped",
    world:"A pandemic shut the planet indoors all at once — empty streets, masks, and a collective stillness and fear nobody had lived through before.",
    money:"Whole industries froze overnight, unemployment spiked, and 'essential worker' entered everyone's vocabulary as offices emptied for good.",
    culture:"Life moved onto screens — work, school, birthdays, funerals — and banana bread, home workouts, and 3am doomscrolling filled the silence." },
  { from:2017, to:2019, vibe:"peak everything, right before the pause",
    world:"The economy was humming, phones ran everyone's lives, and the culture felt loud and fast and endlessly online — the calm-chaos right before 2020 changed it all.",
    money:"Unemployment hit generational lows, the gig economy boomed, rent climbed relentlessly, and 'do what you love' was both the mantra and the trap.",
    culture:"Streaming killed cable, everyone was an aspiring brand, and your worth felt measured in follows, likes, and side projects." },
  { from:2015, to:2016, vibe:"smartphones everywhere, the ground shifting",
    world:"Smartphones were now simply the air everyone breathed, social media reshaped how the world argued, and the culture felt like it was splitting into camps.",
    money:"The recovery was real but uneven, tech money surged, and gig apps promised freedom while quietly redefining what a 'job' even was.",
    culture:"On-demand everything, binge-watching, and a feed for every mood — connection had never been so constant, or so exhausting." },
  { from:2012, to:2014, vibe:"the climb out, a phone in every hand",
    world:"The worst of the crash was behind you, social media went fully mainstream, and a smartphone in every pocket was quietly rewiring daily life.",
    money:"Jobs were slowly returning but wages lagged, student debt ballooned, and 'start a company from your laptop' became a real and seductive idea.",
    culture:"Instagram, streaming, and startups — the culture ran on optimism, hustle, and the feeling the internet could remake anything." },
  { from:2009, to:2011, vibe:"the long, hard recovery",
    world:"The financial crash had gutted things, unemployment stayed brutal, and a whole generation graduated into a job market with no room for them.",
    money:"Layoffs, foreclosures, and 'overqualified and underemployed' — money was tight and the future felt genuinely uncertain for millions.",
    culture:"Frugality was cool again, social media became the megaphone for a frustrated public, and everyone learned to do more with less." },
  { from:2008, to:2008, vibe:"the year the bottom fell out",
    world:"The financial system nearly collapsed — banks failed, markets crashed, and the fear was thick enough to taste as jobs vanished overnight.",
    money:"Retirement accounts halved, homes went underwater, and 'once-in-a-lifetime crisis' turned out to define a whole era.",
    culture:"Amid the wreckage a strange hope flickered too — the sense that the old rules had broken and something new would have to be built." },
  { from:2004, to:2007, vibe:"cheap credit and the early social web",
    world:"Money felt easy, houses only ever went up (everyone said), and the social web was just being born — MySpace, then this new thing called Facebook.",
    money:"Credit was everywhere and cheap, the housing boom made everyone feel rich, and almost nobody saw the cliff at the edge of the party.",
    culture:"Flip phones, iPods, and the first taste of living your life online — the last few years before the smartphone changed everything." },
  { from:2001, to:2003, vibe:"the bust and the long shadow",
    world:"The dot-com bubble burst, then a hard new decade began under a shadow of fear and recession that reset everyone's sense of safety.",
    money:"Tech jobs evaporated, the market slid, and the exuberance of the '90s gave way to caution and slow rebuilding.",
    culture:"The internet grew up fast, reality TV took over, and a more anxious, security-minded mood settled over everything." },
  { from:1997, to:2000, vibe:"the dot-com gold rush",
    world:"The internet arrived for real, the economy roared, and it felt like anyone with a website and a dream could get rich by Friday.",
    money:"Jobs were plentiful, stocks looked like magic, and 'irrational exuberance' was the mood right up until the bubble stretched too thin.",
    culture:"Dial-up screeches, chat rooms, CD binders, and Y2K panic — the analog world was going digital in real time." },
  { from:1994, to:1996, vibe:"the web arrives, the boom begins",
    world:"The world was climbing out of a recession, the web was a brand-new frontier, and optimism was building toward the coming boom.",
    money:"Jobs were returning, the middle class felt sturdy, and a computer in the home was going from luxury to normal.",
    culture:"Grunge and hip-hop ruled, cable had a channel for everything, and 'you've got mail' was a small daily miracle." },
  { from:1990, to:1993, vibe:"the early '90s, before it all went online",
    world:"The Cold War ended, a recession bit hard, and the world felt between chapters — the old order gone, the digital one not yet here.",
    money:"Layoffs hit white-collar workers for the first time in a while, and 'a job for life' started to feel like an old promise.",
    culture:"Mixtapes, MTV, and landlines — connection meant showing up in person, and everyone did." },
  { from:1985, to:1989, vibe:"the neon boom",
    world:"Big ambition, bigger hair, and a booming late-'80s economy — with the Cold War still humming quietly under everything.",
    money:"Wall Street was king, greed was openly good, and the money felt fast and flashy for anyone who could reach it.",
    culture:"MTV, arcades, mall culture, and the first home computers — loud, bright, and sure of itself." },
  { from:1980, to:1984, vibe:"recession, then Reagan-era reinvention",
    world:"The decade opened in a harsh recession with sky-high interest rates, then swung into a brash new era of reinvention and ambition.",
    money:"Interest rates were punishing, factories were changing, and the ground under blue-collar work began shifting for good.",
    culture:"Personal computers arrived, synth-pop took over the radio, and the culture started dreaming bigger and shinier." },
  { from:1975, to:1979, vibe:"stagflation, oil lines, and disco",
    world:"Oil shocks, long gas lines, and a national mood of malaise defined the late '70s — even as the music got euphoric to compensate.",
    money:"Stagflation was the strange curse of the era: high prices and a stalled economy at the same time, squeezing everyone.",
    culture:"Disco, denim, and the last fully analog decade in swing — everyone gathered around the same few TV channels." },
  { from:1970, to:1974, vibe:"upheaval and a decade refusing to sit still",
    world:"War, scandal, and an oil crisis rocked the era — a time of protest, disillusionment, and enormous change.",
    money:"An oil shock and rising prices ended the long postwar boom, and the sense of endless prosperity cracked.",
    culture:"Rock, revolution, and a generation openly questioning everything their parents had taken for granted." },
];
const HISTORY_FALLBACK = { vibe:"a different world, one you remember better than any headline",
  world:"The world of that year had its own texture — one you lived and remember far better than any history book could capture.",
  money:"Work and money meant something specific then, shaped by the particular pressures and promises of the time.",
  culture:"The music, the technology, the daily rhythms — all of it made that year unmistakably its own." };
function eraDetail(y){ return HISTORY.find(h=> y>=h.from && y<=h.to) || HISTORY_FALLBACK; }
function eraContext(y){ return eraDetail(y).vibe; }

// Each stage: age anchor + a make(profile, year, era) that returns a personalized scene.
