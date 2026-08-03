/* PARALLELS — Pack registry + active-pack state
   Part of a modular, single-responsibility build. Load order matters: this is file 22/24. Classic script (shared global scope). */
const PACKS = [
  { id:'mix',    name:'The Original Mix', emoji:'🌌', blurb:'A little of everything — love, dread, comedy, consequence.', vignettes:SHIFTS },
  { id:'horror', name:'Nightmare Fuel',   emoji:'🩸', blurb:'All horror. Do not open the basement door.',            vignettes:HORROR_PACK },
  { id:'comedy', name:'Absurd Timelines', emoji:'😂', blurb:'All comedy. The multiverse is deeply unserious.',       vignettes:COMEDY_PACK },
  { id:'love',   name:'The Heart Ones',   emoji:'❤️', blurb:'All love. Every choice is really about who you keep.',   vignettes:LOVE_PACK },
  { id:'ceo',    name:'The Founder',      emoji:'💼', blurb:'All business. One decision reshapes the whole empire.',  vignettes:CEO_PACK },
  { id:'family', name:'The Bloodline',    emoji:'🏡', blurb:'All family. The universe starts at the kitchen table.',  vignettes:FAMILY_PACK },
  { id:'sports', name:'The Big Leagues',  emoji:'🏟️', blurb:'All sports. The game that made you — and the one play that could have changed everything.', vignettes:SPORTS_PACK },
];

let activePack = PACKS[0];
let shiftIdx = 0;

