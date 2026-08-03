/* PARALLELS — Story-mode graph + universe-naming data
   Part of a modular, single-responsibility build. Load order matters: this is file 01/24. Classic script (shared global scope). */
/* =========================================================================
   PARALLELS v4 — a branching multiverse story engine.
   The story is a GRAPH of nodes. Each choice points to the next node,
   paths reconverge, some endings can continue. Traits accumulate across
   every act and, at the end, collapse into the universe you built.
   Node types:
     decision  : has choices[] (each: icon,head,sub,eff,next[,fatal])
     checkpoint: act break — title/body + auto "Continue" to .next
     ending    : terminal narrative — title/body [+ continues: nodeId]
   ========================================================================= */

const DIMS = {
  bold:{label:"Boldness",color:"#fb7185"},
  bond:{label:"Connection",color:"#22d3ee"},
  grit:{label:"Grit",color:"#34d399"},
  vision:{label:"Vision",color:"#8b5cf6"},
};

const STORY = {
  start:"i_open",
  nodes:{

  /* ================= ACT I — THE THRESHOLD ================= */
  i_open:{ act:"Act I · The Threshold", kicker:"The Threshold",
    title:"It's late, and the day beat you.",
    body:"You're at the bottom of something — you can feel it. Then your phone lights up: a message, a chance, a hand reaching into the dark. You were one breath from shutting it all down for the night, maybe for good.",
    choices:[
      {icon:"💬",head:"Reach back into the dark.",sub:"Answer. Let someone in, just this once.",eff:{bond:2,bold:1},next:"i_reach"},
      {icon:"🚪",head:"Shut the door. Stay safe.",sub:"You've been let down before. Not again.",eff:{grit:2,bond:-1},next:"i_guard"},
      {icon:"⚡",head:"Ignore it — chase your own spark.",sub:"There's an idea in you that won't let go.",eff:{vision:2,bold:1},next:"i_spark"},
    ]},
  i_reach:{ act:"Act I · The Threshold", kicker:"The Meeting",
    title:"You reached back. Now they want to meet.",
    body:"It's real. There's a person on the other end of this, and a door you didn't expect. But doors swing both ways — they'll see you, all of you.",
    choices:[
      {icon:"🫀",head:"Show up as your real self.",sub:"Scars, mess, and all. Take the risk of being known.",eff:{bond:2,grit:1},next:"i_reach2"},
      {icon:"🎭",head:"Show up as who you wish you were.",sub:"Impress first. Let them meet the real you later.",eff:{bold:2,vision:1},next:"i_reach2"},
    ]},
  i_reach2:{ act:"Act I · The Threshold", kicker:"The Hard Part",
    title:"It's going well. Then they glimpse the hard part of your life.",
    body:"Every life has a room it doesn't show on the first visit. They just found the door to yours. What you do now decides whether this becomes something — or stays a stranger you almost loved.",
    choices:[
      {icon:"🔑",head:"Let them into the messy room.",sub:"No more hiding. If it's real, it survives the truth.",eff:{bond:2},next:"i_check"},
      {icon:"🛡️",head:"Pull away to protect them.",sub:"They deserve better than your storm.",eff:{grit:1,bond:-1},next:"i_check"},
    ]},
  i_guard:{ act:"Act I · The Threshold", kicker:"The Silence",
    title:"You shut the door. The silence is safe — and heavy.",
    body:"No one can hurt you in here. But no one can reach you either. The quiet you built for protection starts to feel like a cell.",
    choices:[
      {icon:"🔨",head:"Pour everything into a goal.",sub:"If people won't stay, build something that will.",eff:{grit:2,vision:1},next:"i_guard2"},
      {icon:"📱",head:"The loneliness cracks you. Reach out after all.",sub:"Maybe safe isn't the same as alive.",eff:{bond:2},next:"i_reach2"},
    ]},
  i_guard2:{ act:"Act I · The Threshold", kicker:"The Work",
    title:"You built something alone. It's yours. But who's it for?",
    body:"You made real progress in the quiet. There's pride in that. There's also an empty chair at the table you set for one.",
    choices:[
      {icon:"⛰️",head:"Keep climbing solo.",sub:"The summit is close. Don't slow down now.",eff:{grit:2,bold:1},next:"i_check"},
      {icon:"🚪",head:"Open the door to one person.",sub:"Let a single someone see what you've made.",eff:{bond:2},next:"i_check"},
    ]},
  i_spark:{ act:"Act I · The Threshold", kicker:"The Spark",
    title:"You chased the idea. Everyone said it was crazy.",
    body:"It kept you up at night — the thing only you can see. The people around you called it a distraction, a fantasy, a waste. But it's yours, and it's alive.",
    choices:[
      {icon:"🔥",head:"Go all in. Burn the boats.",sub:"No backup plan. Backup plans are for doubters.",eff:{bold:3},next:"i_spark2"},
      {icon:"🌱",head:"Build it quietly on the side.",sub:"Grow it in the dark until it's ready for light.",eff:{grit:2,vision:1},next:"i_spark2"},
    ]},
  i_spark2:{ act:"Act I · The Threshold", kicker:"The Weight",
    title:"The idea is alive, but fragile. It needs more than you have.",
    body:"You've taken it as far as one pair of hands can. Now it's asking for something — more people, more time, more of you than you're sure you can give.",
    choices:[
      {icon:"🤝",head:"Bring people in to help it grow.",sub:"Share the dream. Let it outgrow you.",eff:{bond:2,vision:1},next:"i_check"},
      {icon:"🔒",head:"Protect it. Do it all yourself.",sub:"No one will love it like you do.",eff:{grit:2},next:"i_check"},
      {icon:"💤",head:"The pressure wins. Walk away from all of it.",sub:"Maybe it was never meant to be.",eff:{bond:-1,grit:-1},next:"end_walkaway",fatal:true},
    ]},
  i_check:{ checkpoint:true, tag:"End of Act I", next:"ii_open",
    title:"The hardest part — starting — is behind you.",
    body:"You found the first door in the dark and you walked through it. Whatever it cost, you're no longer standing still. The climb is next." },

  /* ================= ACT II — THE CLIMB ================= */
  ii_open:{ act:"Act II · The Climb", kicker:"The Climb",
    title:"Now you have to build something that lasts.",
    body:"The beginning is behind you; the grind is here. There's a way up, but every route asks for a different piece of you.",
    choices:[
      {icon:"🚀",head:"Take a big swing to grow fast.",sub:"Bet bigger than is comfortable.",eff:{bold:2,vision:1},next:"ii_risk"},
      {icon:"🧱",head:"Grind — steady, reliable, brick by brick.",sub:"Slow is smooth, smooth is lasting.",eff:{grit:2},next:"ii_grind"},
      {icon:"🪜",head:"Lift others as you climb.",sub:"Build the ladder wide enough for more than you.",eff:{bond:2},next:"ii_lift"},
    ]},
  ii_risk:{ act:"Act II · The Climb", kicker:"The Bet",
    title:"You swung big. For a while, it soared.",
    body:"Momentum, attention, the taste of something working. And then the ground shifts — the thing you bet on wobbles under the weight of its own speed.",
    choices:[
      {icon:"💪",head:"Double down. Push through the wobble.",sub:"Nerve got you here. Nerve gets you out.",eff:{bold:2,grit:1},next:"ii_setback"},
      {icon:"🧭",head:"Pivot to something truer.",sub:"The wobble is information. Listen to it.",eff:{vision:2},next:"ii_setback"},
    ]},
  ii_grind:{ act:"Act II · The Climb", kicker:"The Grind",
    title:"Brick by brick, it's becoming real.",
    body:"No fireworks — just the quiet accumulation of days done right. But the load is getting heavy, and you're carrying it alone.",
    choices:[
      {icon:"🎯",head:"Keep your head down. Carry it alone.",sub:"You trust your own hands most.",eff:{grit:2},next:"ii_setback"},
      {icon:"🤲",head:"Let someone in to share the load.",sub:"A weight split two ways travels farther.",eff:{bond:2},next:"ii_setback"},
    ]},
  ii_lift:{ act:"Act II · The Climb", kicker:"The Others",
    title:"You started bringing people up with you.",
    body:"It's slower this way. Messier. But the climb has voices now, and the summit stopped feeling so lonely. Then someone you're carrying starts to slip.",
    choices:[
      {icon:"❤️",head:"Sacrifice your own climb to catch them.",sub:"No one gets left on the mountain.",eff:{bond:3,grit:1},next:"ii_setback"},
      {icon:"🌉",head:"Find a way to rise together.",sub:"Refuse the choice between them and the summit.",eff:{bond:1,vision:2},next:"ii_setback"},
    ]},
  ii_setback:{ act:"Act II · The Climb", kicker:"The Fall",
    title:"Then life knocks you flat.",
    body:"An injury. A betrayal. A door you were counting on, slammed and locked. The plan is gone, and for one long moment it feels like the whole future went with it. The next breath decides everything.",
    choices:[
      {icon:"🌅",head:"Rebuild — slower, but a new way.",sub:"The comeback writes a better story than the plan did.",eff:{grit:2,vision:1},next:"ii_check"},
      {icon:"🔥",head:"Push harder down the same road.",sub:"Refuse to let it take what you wanted.",eff:{bold:2,grit:1},next:"ii_check"},
      {icon:"🕳️",head:"Let it end you. Stop here.",sub:"You're so tired. Maybe this is where it stops.",eff:{bond:-1,grit:-1},next:"end_broken",fatal:true},
    ]},
  ii_check:{ checkpoint:true, tag:"End of Act II", next:"iii_open",
    title:"You climbed, you fell, and you got back up.",
    body:"The shape of your life is emerging now — not the one you planned, but a realer one, forged in the falling and the standing back up. What you do with it is the last question." },

  /* ================= ACT III — THE LEGACY ================= */
  iii_open:{ act:"Act III · The Legacy", kicker:"The Legacy",
    title:"You made it somewhere the old you couldn't have imagined.",
    body:"There's weight in what you've lived through, and now, finally, a choice that isn't about survival. It's about what all of it was FOR.",
    choices:[
      {icon:"📣",head:"Tell your story to help others.",sub:"Someone out there needs to hear it can be done.",eff:{vision:2,bond:1},next:"iii_tell"},
      {icon:"🛠️",head:"Build quietly. Let the work speak.",sub:"The proof is what you made, not what you said.",eff:{grit:2},next:"iii_build"},
      {icon:"👑",head:"Give it all to family first.",sub:"The legacy begins at your own kitchen table.",eff:{bond:2,grit:1},next:"iii_family"},
    ]},
  iii_tell:{ act:"Act III · The Legacy", kicker:"The Voice",
    title:"You decided your story belongs to more than just you.",
    body:"But how loud, and to whom? A story can be a stadium roar or a whisper that changes one life completely.",
    choices:[
      {icon:"🎤",head:"Take the biggest stage you can find.",sub:"Reach as many as humanly possible.",eff:{bold:2,vision:1},next:"end_stage"},
      {icon:"🌟",head:"Mentor a few people, deeply.",sub:"Change whole lives, one at a time.",eff:{bond:2},next:"end_mentor"},
    ]},
  iii_build:{ act:"Act III · The Legacy", kicker:"The Work",
    title:"You let the work be the whole speech.",
    body:"No stage, no spotlight — just the thing you're making, growing quietly into something undeniable.",
    choices:[
      {icon:"🏛️",head:"Grow it into an empire.",sub:"Build something too big to ignore.",eff:{grit:2,bold:1},next:"end_empire"},
      {icon:"💎",head:"Make one quiet masterpiece.",sub:"Perfect one true thing and let it outlive you.",eff:{grit:1,vision:2},next:"end_masterpiece"},
    ]},
  iii_family:{ act:"Act III · The Legacy", kicker:"The Table",
    title:"You pointed everything home first.",
    body:"The people at your table are the whole reason. But 'home' can be a fortress of four — or a porch light the whole street can see.",
    choices:[
      {icon:"🏠",head:"Pour everything into your own.",sub:"Give your children the ground you never had.",eff:{bond:3},next:"end_family"},
      {icon:"🕯️",head:"Home first — then lift the whole block.",sub:"Turn your porch light into a lighthouse.",eff:{bond:2,vision:1},next:"end_together"},
    ]},

  /* ================= ENDINGS ================= */
  end_walkaway:{ ending:true, tag:"An Ending · The Road Not Walked", continues:"i_open_again",
    title:"You set it down, and the world went quiet.",
    body:"You chose peace over the fight, and for a while it felt like relief. But some nights you still hear it — the hum of the life you almost built, glowing faintly in a universe next door. It isn't too late. It's never as late as it feels.",
    softNote:"This is one place your story could rest. But a door left unopened doesn't lock — it waits." },
  end_broken:{ ending:true, tag:"An Ending · The Fall", continues:"ii_setback",
    title:"You stayed down. The dark felt like the end.",
    body:"And maybe, in some universe, it was. But you're still here, reading this, breathing. Somewhere close, another version of you is getting up right now — dusting off, choosing to try one more time. That version isn't stronger than you. It's just one decision ahead.",
    softNote:"Every comeback story starts exactly here, on the floor. Yours can too — the door back is still open." },
  end_stage:{ ending:true, tag:"An Ending · The Stadium", continues:"iv_open",
    title:"You told it from the biggest stage you could find.",
    body:"And in a sea of strangers, one person heard the exact thing they needed to keep going. Then another. Then thousands. You turned your worst days into someone else's reason to hold on. That's not fame. That's a torch, passed.",
    softNote:"You could rest here, a life well-spent. Or you could see what your story did once it left the room." },
  end_mentor:{ ending:true, tag:"An Ending · The Few",
    title:"You poured yourself into a handful of people.",
    body:"You'll never trend. No stadium will chant your name. But five people became who they were meant to be because you refused to give up on them — and each of them is now refusing to give up on five more. Quiet math. World-changing sum." },
  end_empire:{ ending:true, tag:"An Ending · The Empire",
    title:"You built something too big to ignore.",
    body:"What started as one pair of desperate hands became a machine that feeds families, opens doors, and outlives its founder. They'll study what you made. Few will know what it cost you to start it in the dark. You will. That's enough." },
  end_masterpiece:{ ending:true, tag:"An Ending · The One True Thing",
    title:"You made one perfect thing and let it go.",
    body:"You resisted the urge to make it bigger, and made it truer instead. Long after you're gone, someone will find it, feel understood, and never know your name. You'll have reached across time to hold a stranger steady. That was always the point." },
  end_family:{ ending:true, tag:"An Ending · The Table",
    title:"You gave your children the ground you never stood on.",
    body:"They'll grow up not knowing the weight you carried so they wouldn't have to. They'll take for granted the safety you bled for. That's not a tragedy — that's the whole victory. You broke a cycle. The next generation gets to start from higher up." },
  end_together:{ ending:true, tag:"An Ending · The Lighthouse", continues:"iv_open",
    title:"You took care of your own — then lit the way for everyone.",
    body:"Your porch light became a lighthouse. The kids on your block, the families down the street, strangers who only ever heard of you — they steered by the glow of a life that refused to keep its warmth to itself. Home first. Then the world.",
    softNote:"You could stop here, whole and proud. Or you could see how far the light travels." },

  /* ================= ACT IV — THE RIPPLE (continuation) ================= */
  iv_open:{ act:"Act IV · The Ripple", kicker:"Years Later",
    title:"The thing you started has a life of its own now.",
    body:"You're older. You could coast on what you built. But a story is never really finished — it only hands the pen to someone else.",
    choices:[
      {icon:"🌊",head:"Watch someone you helped help others.",sub:"See the ripple reach a shore you'll never visit.",eff:{bond:2,vision:1},next:"end_ripple"},
      {icon:"🚪",head:"Quietly begin again. A brand-new door.",sub:"Prove to yourself the fire never went out.",eff:{vision:2,bold:1},next:"end_newdoor"},
    ]},
  end_ripple:{ ending:true, tag:"An Ending · The Ripple",
    title:"You watched your ripple become someone else's wave.",
    body:"A person you lifted, years ago, is now standing where you once stood — reaching back into someone's dark exactly the way someone once reached into yours. You realize the thing you built was never the point. The point was teaching the world how to reach. And it learned." },
  end_newdoor:{ ending:true, tag:"An Ending · The Next Door",
    title:"You walked through a brand-new door, just to prove you still could.",
    body:"You had every excuse to stop. Instead you started again, from scratch, with nothing to prove to anyone but yourself. Turns out the fire was never about the destination. It was about being the kind of person who always, always keeps walking forward. You are that person. You always were." },

  /* re-entry node for the walkaway comeback */
  i_open_again:{ act:"Act I · Second Chance", kicker:"Another Door",
    title:"Months later, a door you thought closed cracks open again.",
    body:"The world offers second chances more often than we take them. Here's yours, wearing a slightly different face. This time you know what it costs to say no.",
    choices:[
      {icon:"🔥",head:"This time, walk through it.",sub:"You've felt the empty version. Choose the full one.",eff:{bold:2,vision:1},next:"ii_open"},
      {icon:"🤝",head:"Walk through it — and bring someone.",sub:"Don't do the hard part alone this time.",eff:{bond:2,bold:1},next:"ii_open"},
    ]},
  }
};

/* ---------- Universe naming (dominant + secondary) ---------- */
const PAIR_NAMES = {
  "bold-bond":"The Universe of Fearless Love","bold-grit":"The Universe of the Relentless","bold-vision":"The Universe of the Pioneer",
  "bond-bold":"The Universe of the Ride-or-Die","bond-grit":"The Universe of the Unbreakable","bond-vision":"The Universe of the Circle of Dreamers",
  "grit-bold":"The Universe of the Comeback","grit-bond":"The Universe of the Rock","grit-vision":"The Universe of the Quiet Builder",
  "vision-bold":"The Universe of the Wayfinder","vision-bond":"The Universe of the Lightbringer","vision-grit":"The Universe of the Architect",
};
const BALANCED_NAME = "The Universe of Perfect Balance";
const FRAG = {
  bold:"moved before the fear could finish talking",
  bond:"measured your life by the people you refused to lose",
  grit:"treated every fall as a starting line",
  vision:"saw the door before anyone believed there was a wall",
};
const FRAG2 = {
  bold:"never waited for permission to begin",
  bond:"made sure no one you loved had to climb alone",
  grit:"outlasted every good reason to quit",
  vision:"built worlds in your mind long before they existed",
};
const TRAIT = {
  bold:"Somewhere another you stayed safe and always wondered. This one leapt.",
  bond:"In a thousand other universes you climbed alone. In this one, you brought people with you.",
  grit:"Somewhere another you stayed down. This one stood up so many times it became who you are.",
  vision:"Other versions of you followed a map. This one drew a new one.",
};
const CLOSERS = [
  "Every road you didn't take is real too — faded, humming in the dark. But this is the one with your name on it, and it isn't finished yet.",
  "There are infinite versions of your life. You're living in the one that got up, reached back, and kept going. That's not luck. That's you.",
  "Some universe out there chose differently and lost everything that mattered. Not this one. You built this one, one door at a time.",
];
const HOPE = [
  "And somewhere in your real life, a door like these is already waiting. You've walked through harder ones to get this far.",
  "The doors in this game aren't make-believe. You meet them for real — and you're more ready for the next one than you know.",
  "Whatever you survived to reach this screen, that was the hard part. The next door is lighter than it looks. You've got this.",
];
const CP_BLURB = {
  bold:"So far, you're the one who moves first and lets the doubt catch up later.",
  bond:"So far, your story is being written in the people you've chosen to keep close.",
  grit:"So far, you've refused to break, no matter what the day has thrown at you.",
  vision:"So far, you've been chasing a picture only you can fully see.",
};

