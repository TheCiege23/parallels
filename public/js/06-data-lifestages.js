/* PARALLELS — "Your Own Life" life-stage scene data
   Part of a modular, single-responsibility build. Load order matters: this is file 06/24. Classic script (shared global scope). */
const STAGES = [
  { age:16, label:"The First Rebellion", emoji:"🔥", make:(p,year,era)=>{
    const name=esc(p.name), love=esc(p.love)||"the thing you loved most";
    return { kicker:"A real turning point",
      title:`${year}. You're sixteen.`,
      body:`Outside, it was ${era}. At sixteen everything felt enormous and unfair and yours to fight. ${name?name+', you':'You'} stood at the first fork where the person you were becoming started arguing with the person everyone expected.`,
      choices:[
        { icon:"🎸", head:"You rebelled — loudly.", sub:"Push against every rule you could find.", tone:"consequence",
          outcome:"You pushed against every rule in reach. It scared the people who loved you and thrilled the part of you that needed to know it existed.",
          ripple:"Some of it cost you. Some of it became the backbone you'd lean on for the rest of your life. The kid who pushed back at sixteen is the reason the adult you doesn't fold easily now.",
          line:"Teenage defiance is just self-respect that hasn't learned its manners yet. Don't regret having had a spine early." },
        { icon:"📚", head:"You kept your head down and played it safe.", sub:"Keep the peace. Get through clean.", tone:"dark",
          outcome:"You followed the rules, kept the peace, got through it without a scratch. It made the adults comfortable and kept a lid on the storm inside you.",
          ripple:"It also meant a few things you wanted got quietly shelved 'for later.' This version of you is steady and dependable, and spends part of adulthood learning it's finally safe to want things out loud.",
          line:"Playing it safe young is neither wrong nor free. Just make sure 'later' eventually arrives." },
        { icon:"🎨", head:"You poured it all into one obsession.", sub:`Disappear into ${love}.`, tone:"love",
          outcome:`You funneled everything into ${love}, the way only a teenager can love a thing. The world around you called it a phase.`,
          ripple:"It wasn't a phase. Whether or not it ever became a career, that obsession taught you how to go deep, how to be great at something, how to lose yourself in work you love. That's a muscle most people never build.",
          line:"The obsession everyone told you to outgrow was secretly your first training in mastery. Keep a little of it." },
      ]};
  }},
  { age:18, label:"Leaving the Nest", emoji:"🚪", make:(p,year,era)=>{
    const name=esc(p.name), fam=esc(p.family);
    return { kicker:"A real turning point",
      title:`${year}. You're eighteen, and the door out is right there.`,
      body:`The world was ${era}. Everyone had a plan for you. But the first genuinely enormous choice — go, or stay — was finally yours to make, and no one could make it for you.`,
      choices:[
        { icon:"✈️", head:"You left. Chased the wider world.", sub:"Bet on the version of you that hadn't happened yet.", tone:"consequence",
          outcome:"You packed up and went, toward something bigger and unknown. It was thrilling and lonely in equal measure, and it stretched you into someone your hometown wouldn't have.",
          ripple:"You gained the world and lost some of home — a few Sunday tables you'd never sit at again. This you learns early that growth and roots pull in opposite directions, and that leaving is its own kind of grief even when it's the right call.",
          line:"Leaving isn't betrayal. But it always costs something real. Go with your eyes open and your gratitude packed." },
        { icon:"🏡", head:"You stayed close to home.", sub:"Keep the people you love within reach.", tone:"love",
          outcome:"You stayed near the people and the ground that made you. You watched younger cousins grow up, kept the old friendships alive, stayed woven into a place that knew your name.",
          ripple:"Some nights you wondered about the bigger road you didn't take. But this you built something quieter and deeper — a life measured in belonging instead of distance. Not smaller. Just rooted. There's a specific richness the wanderers never quite get.",
          line:"Staying is not the same as settling. A life spent close to your people is a real and worthy epic." },
        { icon:"🎲", head:"You took the path nobody predicted.", sub:"Confuse absolutely everyone.", tone:"funny",
          outcome:"You did the thing no one saw coming. Your family is, to this day, not entirely sure how to describe your life at dinner parties. They gave up trying and just say you're 'doing your own thing.'",
          ripple:"It was chaos and it was yours. This you learns that a life nobody can summarize in one sentence is often a life actually worth living. You confused everyone and delighted yourself. Fair trade.",
          line:"If your relatives can neatly explain your life choices at Thanksgiving, you might be playing it too safe." },
      ]};
  }},
  { age:22, label:"The First Real Fork", emoji:"💼", make:(p,year,era)=>{
    const job=esc(p.job)||"the work you'd end up doing", edu=esc(p.education);
    const eduLine = (edu && edu!=="Prefer not to say") ? `You had ${/^[aeiou]/i.test(edu)?'an':'a'} ${edu.toLowerCase()} behind you and a blank page in front.` : "The training-wheels years were ending.";
    return { kicker:"A real turning point",
      title:`${year}. You're twenty-two.`,
      body:`${eduLine} The world, which right then was ${era}, wanted to know what you were going to DO with yourself — and for the first time the answer had real weight.`,
      choices:[
        { icon:"🚀", head:"You bet on the risky, exciting path.", sub:`Chase ${job} the bold way.`, tone:"consequence",
          outcome:`You chased ${job} the reckless, exciting way — no safety net, all conviction. It was a rollercoaster, and the era around you (${era}) made it even wilder.`,
          ripple:"Some of those bets paid off huge and some blew up in your face. But this you learned, young and permanently, that they were survivable — and stopped being afraid of the fall. That fearlessness compounds for decades.",
          line:"The best time to take the survivable risk is when you're too young to know how scary it should've been." },
        { icon:"🧱", head:"You took the stable, sensible one.", sub:"Slow and smooth and built to last.", tone:"dark",
          outcome:"You chose the steady road — the reliable paycheck, the sensible plan, the thing that let everyone stop worrying about you.",
          ripple:"It gave you a real foundation, and it quietly filed away a bolder dream 'for when things are secure.' This you learns that 'secure' is a horizon that keeps moving — and that at some point you have to decide the dream gets a turn anyway.",
          line:"Stability is a gift you give your future self. Just don't let it become the excuse that outlives its usefulness." },
        { icon:"❤️", head:"You followed a person, not a plan.", sub:"Chase the heart instead of the résumé.", tone:"love",
          outcome:"You made the fork about a person, not a paycheck. Everyone with a spreadsheet told you it was foolish. You did it anyway.",
          ripple:"Careers can be rebuilt; some people only pass through once. This you sometimes wonders about the road not taken — but rarely regrets choosing the human over the plan. The résumé recovered. The love wrote the actual story.",
          line:"Sometimes the smartest career move on paper is the dumbest life move in your chest. Know which ledger you're reading." },
      ]};
  }},
  { age:26, label:"The Love Fork", emoji:"💞", make:(p,year,era)=>{
    const fam=esc(p.family), name=esc(p.name);
    return { kicker:"A real turning point",
      title:`${year}. You're twenty-six, and your heart is at a crossroads.`,
      body:`The world was ${era}, and your own was full of the biggest questions of the twenties: who to keep, who to let go, whether to open all the way up or protect yourself a little longer. ${name?name+', this':'This'} was the fork the rest of your relationships would echo.`,
      choices:[
        { icon:"🔓", head:"You let someone all the way in.", sub:"Drop the armor. Risk being known.", tone:"love",
          outcome:"You took the terrifying risk of being fully seen — flaws, history, all of it. It meant handing someone the power to really hurt you.",
          ripple:"It didn't go perfectly; that kind of thing never does. But this you learned that the walls that keep the pain out also keep the love out, and chose, again and again, to keep the door open anyway. That's the whole secret nobody tells you.",
          line:"Being truly known is the scariest thing you'll ever risk, and the only thing that ever actually cures the loneliness." },
        { icon:"🛡️", head:"You guarded your heart and stayed free.", sub:"Keep your independence intact.", tone:"consequence",
          outcome:"You kept your freedom, your options, your armor. You built a life that couldn't be knocked over by anyone else's choices.",
          ripple:"It was genuinely great for a long stretch — and quietly lonely in a way you didn't always admit. This you eventually learns that independence and intimacy aren't enemies, and that the bravest freedom is choosing to need someone anyway.",
          line:"Self-protection keeps out the knives and the flowers both. At some point, it's worth risking the flowers." },
        { icon:"🌍", head:"You chose yourself and your own becoming, first.", sub:"Grow into who you are before joining a we.", tone:"love",
          outcome:"You decided the twenties were for becoming fully yourself before you tied your life to anyone else's. You traveled, or built, or healed, or just figured out who you actually were.",
          ripple:"You showed up to love later, whole instead of half-formed, and this you learns there's no wrong order — that time spent becoming yourself is never time lost. The people worth having were always going to be worth the wait.",
          line:"You can't fully share a self you haven't finished meeting yet. Sometimes the most loving choice is to grow first." },
      ]};
  }},
  { age:32, label:"Settle or Chase", emoji:"🔀", make:(p,year,era)=>{
    const gripe=esc(p.gripe)||"the thing you'd most want to change", job=esc(p.job)||"your work";
    return { kicker:"A real turning point",
      title:`${year}. You're thirty-two, and the ground has gotten comfortable.`,
      body:`Life was working, mostly. The world outside was ${era}. But underneath the fine-ness was a restless whisper about ${gripe} — and a fork between keeping the good-enough life or risking it for a truer one.`,
      choices:[
        { icon:"🔥", head:"You blew up the comfortable and chased the dream.", sub:"Risk the good for the great.", tone:"consequence",
          outcome:`You risked the stable life to finally chase the bigger thing — to fix ${gripe} instead of tolerating it. It terrified everyone, including you.`,
          ripple:"It cost you comfort and a few certainties, and some of it didn't work. But this you never has to lie awake wondering 'what if I'd tried' — and that particular peace turns out to be worth almost any price.",
          line:"Comfortable and fulfilled are different destinations. Be sure you didn't accidentally settle into the wrong one." },
        { icon:"🌳", head:"You chose to be grateful for the good life you had.", sub:"Stop chasing. Start appreciating.", tone:"love",
          outcome:`You looked hard at the life you'd built and decided it was, in fact, enough — that ${job} and the people around you were a quiet gift you'd been too busy to notice.`,
          ripple:"This you learns that gratitude isn't giving up; it's a skill, and a rare one. While others burned themselves chasing more, you learned to actually inhabit what you had. Contentment, it turns out, is its own kind of wealth.",
          line:"Sometimes the bravest, hardest thing isn't chasing more. It's realizing you already have enough and letting yourself feel it." },
        { icon:"🌗", head:"You kept the life AND started the dream on the side.", sub:"Refuse to fully choose.", tone:"consequence",
          outcome:`You didn't blow it up and didn't give up. You kept the stable life and built the dream in the margins — early mornings, late nights, stolen weekends aimed at ${gripe}.`,
          ripple:"It was exhausting and you were split in two for years. But this you never had to gamble everything or abandon anything — and the dream stayed a live coal instead of an ash. Some people don't need all-or-nothing. Some just need to refuse to quit.",
          line:"You don't always have to choose between the safe life and the dream. Sometimes you just have to carry both, tired and stubborn." },
      ]};
  }},
  { age:40, label:"The Reinvention", emoji:"🦋", make:(p,year,era)=>{
    const gripe=esc(p.gripe)||"a part of your life that stopped fitting", love=esc(p.love)||"what you love", name=esc(p.name);
    return { kicker:"A real turning point",
      title:`${year}. You're forty, and something is quietly asking to change.`,
      body:`The world was ${era}. You'd built a whole self by now — and a piece of it, maybe ${gripe}, had started to feel like a coat that no longer fit. ${name?name+', you':'You'} stood at the fork between staying who you'd been and becoming someone new.`,
      choices:[
        { icon:"🚪", head:"You reinvented yourself completely.", sub:"Start a new chapter from scratch.", tone:"consequence",
          outcome:`You did the thing people call a crisis and you called a calling — you changed course, leaned into ${love}, and rebuilt around who you'd actually become instead of who you'd been at twenty-five.`,
          ripple:"It rattled the people used to the old you, and it was scarier at forty than it would've been at twenty. But this you proves the thing everyone secretly needs to see: that it is never, ever too late to become someone new. Watching you do it gave other people permission to try.",
          line:"Reinvention at forty isn't a crisis. It's proof the story isn't over. You're allowed more than one chapter." },
        { icon:"🌱", head:"You deepened who you already were.", sub:"Not a new tree. A stronger one.", tone:"love",
          outcome:"You didn't burn it down. You went deeper instead — got better, wiser, and more fully yourself in the life you already had. Mastery instead of a fresh start.",
          ripple:"This you learns that reinvention isn't always about becoming someone new; sometimes it's about finally becoming all the way who you already were. The people around you got a richer, steadier version of the person they already loved. Depth is its own adventure.",
          line:"Not every fork is a hard turn. Sometimes growth just means becoming more completely the person you already are." },
        { icon:"🫶", head:"You reinvented around the people, not the career.", sub:"Rebuild the life to fit the love.", tone:"love",
          outcome:`You aimed the reinvention at the things that actually mattered — more time, more presence, a life reshaped around ${love} and the people in it instead of the résumé.`,
          ripple:"The world doesn't hand out awards for this one. But this you gets something the trophies can't buy: to actually be there, awake, for the handful of people and moments that were always the real point. Years later, this is the choice you're quietly proudest of.",
          line:"The most radical midlife reinvention isn't a new career. It's building a life that finally has room for what you love." },
      ]};
  }},
];

