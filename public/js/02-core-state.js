/* PARALLELS — Shared run state, DOM refs, reset helpers
   Part of a modular, single-responsibility build. Load order matters: this is file 02/24. Classic script (shared global scope). */
/* ---------- State + rendering ---------- */
let nodeId = STORY.start;
let totals = {bold:0,bond:0,grit:0,vision:0};
let journey = [];          // {chosen, count} per decision
let currentResult = null;

const stage = document.getElementById('stage');
const chapterEl = document.getElementById('chapter');
const pathSvg = document.getElementById('pathSvg');
const pathLabel = document.getElementById('pathLabel');

function resetRun(){
  nodeId = STORY.start;
  totals = {bold:0,bond:0,grit:0,vision:0};
  journey = [];
  currentResult = null;
}
function domOf(t){ return Object.keys(t).sort((a,b)=>t[b]-t[a]); }

