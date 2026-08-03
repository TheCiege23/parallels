/* PARALLELS — Story-mode engine: title -> router -> endings -> universe
   Part of a modular, single-responsibility build. Load order matters: this is file 03/24. Classic script (shared global scope). */
/* ================= Title ================= */
function renderTitle(){
  chapterEl.textContent=""; pathLabel.textContent=""; pathSvg.innerHTML="";
  stage.className="stage fade";
  const banner = incomingChallenge ? `
    <div class="challenge-banner">🌌 You've been challenged. Someone out there built <b>${incomingChallenge.name}</b>.<br>Now the door is yours — which universe will <b>you</b> build?</div>` : '';
  stage.innerHTML = `
    <h1 class="title-h1">PARALLELS</h1>
    <p class="tagline">Every choice is a door. Every door is a universe.</p>
    ${banner}
    <div class="btn-row">
      <button class="btn" id="startBtn">${incomingChallenge?'Build my universe':'Live the Story'}</button>
      <button class="btn ghost" id="shiftBtn">Change One Thing ✦</button>
      <button class="btn ghost" id="lifeBtn">Your Own Life ✦ ᴮᴱᵀᴬ</button>
    </div>
    <p class="mode-hint"><b>Live the Story</b> — a branching life in four acts. <b>Change One Thing</b> — step sideways into another life and watch reality rewrite itself; pick a pack (horror, comedy, love, founder, family). <b>Your Own Life</b> — enter your real details, go back to a real turning point in your past, and see the universe a different choice would've opened. Not every timeline is a happy one.</p>
  `;
  toneGlow(null);
  document.getElementById('startBtn').onclick = ()=>{ toneGlow(null); resetRun(); go(STORY.start); };
  document.getElementById('shiftBtn').onclick = startShiftMode;
  document.getElementById('lifeBtn').onclick = renderProfileIntake;
}

/* ================= Router ================= */
function go(id){
  nodeId = id;
  const node = STORY.nodes[id];
  if(!node){ console.error("Missing node:", id); return; }
  if(node.ending) return renderStoryEnding(node);
  if(node.checkpoint) return renderCheckpoint(node);
  return renderDecision(node);
}

function renderDecision(node){
  chapterEl.textContent = node.act || "";
  stage.className="stage fade";
  const doors = node.choices.map((c,i)=>`
    <button class="door${c.fatal?' fatal':''}" data-i="${i}">
      <span class="icon">${c.icon}</span>
      <span class="txt"><b>${c.head}</b><span>${c.sub}</span></span>
    </button>`).join("");
  stage.innerHTML = `
    <div class="scene-kicker">${node.kicker||""}</div>
    <div class="scene-title">${node.title}</div>
    <div class="scene-body">${node.body}</div>
    <div class="doors">${doors}</div>`;
  stage.querySelectorAll('.door').forEach(b=> b.onclick = ()=>choose(node, parseInt(b.dataset.i,10)));
  drawPath();
}

function choose(node, i){
  const c = node.choices[i];
  for(const k in c.eff) totals[k]+=c.eff[k];
  journey.push({chosen:i, count:node.choices.length});
  drawPath();
  go(c.next);
}

/* ================= Checkpoint (act break) ================= */
function renderCheckpoint(node){
  chapterEl.textContent = "";
  stage.className="stage fade";
  const dom = domOf(totals)[0];
  stage.innerHTML = `
    <div class="cp-tag">${node.tag}</div>
    <div class="cp-title">${node.title}</div>
    <div class="cp-body">${node.body}</div>
    <div class="cp-blurb">${CP_BLURB[dom]}</div>
    <div class="btn-row"><button class="btn" id="contBtn">Continue the story →</button></div>`;
  document.getElementById('contBtn').onclick = ()=>go(node.next);
  drawPath();
}

/* ================= Story ending (narrative) ================= */
function renderStoryEnding(node){
  chapterEl.textContent = "";
  stage.className="stage fade";
  const soft = node.continues;
  const buttons = soft ? `
      <button class="btn" id="contBtn">Continue the story →</button>
      <button class="btn ghost" id="revealBtn">End here — reveal my universe</button>`
    : `<button class="btn" id="revealBtn">Reveal my universe →</button>`;
  stage.innerHTML = `
    <div class="end-tag">${node.tag}</div>
    <div class="end-title">${node.title}</div>
    <div class="end-body">${node.body}</div>
    ${node.softNote?`<div class="soft-note">${node.softNote}</div>`:''}
    <div class="btn-row">${buttons}</div>`;
  if(soft) document.getElementById('contBtn').onclick = ()=>go(node.continues);
  document.getElementById('revealBtn').onclick = renderCollapse;
  drawPath();
}

/* ================= Reveal beat ================= */
function renderCollapse(){
  chapterEl.textContent="";
  stage.className="stage fade";
  stage.innerHTML = `
    <div style="text-align:center;width:100%">
      <div class="collapse-txt">Every choice you made<br>is collapsing into one universe…</div>
      <div class="collapse-sub">Reading your path through the multiverse</div>
    </div>`;
  sfxShift();
  drawPath();
  setTimeout(renderUniverse, 1600);
}

/* ================= Universe capstone ================= */
function rarityOf(t){
  const vals=Object.values(t);
  const spread=Math.max(...vals)-Math.min(...vals);
  const allPos=vals.every(v=>v>0);
  if(allPos && spread<=2) return {tier:"LEGENDARY",color:"#fbbf24"};
  if(spread<=4)          return {tier:"RARE",     color:"#c4b5fd"};
  if(spread<=8)          return {tier:"UNCOMMON", color:"#67e8f9"};
  return {tier:"COMMON", color:"#9aa3c7"};
}
function makeResult(t, jrny){
  const order=domOf(t), domKey=order[0], secondKey=order[1];
  const sig=jrny.reduce((a,j,k)=>a + j.chosen*(k+3), 0);
  const rarity=rarityOf(t);
  let name, desc;
  if(rarity.tier==="LEGENDARY"){
    name=BALANCED_NAME;
    desc="In this universe, you are the rare one who refused to become just one thing — bold and loving, unbreakable and dreaming, all at once. Almost no one holds all four. You do.";
  } else {
    name=PAIR_NAMES[`${domKey}-${secondKey}`]||"The Universe You Built";
    desc=`In this universe, you are the one who ${FRAG[domKey]} — the one who also ${FRAG2[secondKey]}.`;
  }
  const code=jrny.map(j=>j.chosen).join('');
  const num=100+(sig*37)%899;
  return {t:{...t}, domKey, secondKey, name, desc, trait:TRAIT[domKey],
    closer:CLOSERS[sig%CLOSERS.length], hope:HOPE[sig%HOPE.length],
    rarity, code, num, verseId:`UNIVERSE #${num}-${code}`};
}

function renderUniverse(){
  chapterEl.textContent="Your Universe";
  sfxShift();
  const R = makeResult(totals, journey);
  currentResult = R;
  const max=Math.max(6,...Object.values(R.t).map(x=>Math.abs(x)));
  const bars=Object.keys(DIMS).map(k=>{
    const pct=Math.max(4,Math.round((R.t[k]/max)*100));
    return `<div class="bar-row"><span class="lab">${DIMS[k].label}</span>
      <span class="bar-track"><span class="bar-fill" data-pct="${Math.min(100,pct)}" style="background:${DIMS[k].color}"></span></span></div>`;
  }).join("");
  stage.className="stage fade";
  stage.innerHTML = `
    <div class="verse-top">
      <span class="verse-id">${R.verseId}</span>
      <span class="rarity" style="color:${R.rarity.color};border-color:${R.rarity.color}55;background:${R.rarity.color}14">${R.rarity.tier}</span>
    </div>
    <div class="verse-name">${R.name}</div>
    <p class="verse-desc">${R.desc}</p>
    <div class="bars">${bars}</div>
    <p class="roads">${R.trait} ${R.closer}</p>
    <p class="hope">${R.hope}</p>
    <div class="challenge-cta">Now pass the door forward: which universe would <b>someone you love</b> build? Send it and find out.</div>
    <div class="btn-row">
      <button class="btn" id="shareBtn">Share my universe ✦</button>
      <button class="btn ghost" id="dlBtn">Download image</button>
      <button class="btn ghost" id="linkBtn">Copy challenge link</button>
    </div>
    <div class="btn-row" style="margin-top:12px">
      <button class="btn ghost" id="againBtn">Live another life</button>
    </div>`;
  requestAnimationFrame(()=>stage.querySelectorAll('.bar-fill').forEach(f=>f.style.width=f.dataset.pct+"%"));
  document.getElementById('againBtn').onclick = ()=>renderTitle();
  document.getElementById('shareBtn').onclick = shareResult;
  document.getElementById('dlBtn').onclick = downloadCard;
  document.getElementById('linkBtn').onclick = copyLink;
  drawPath();
}

/* ================= Constellation path ================= */
function drawPath(){
  pathLabel.textContent = journey.length ? "Your path through the multiverse" : "";
  const W=600,H=52, n=Math.max(journey.length,1), gap=W/(n+1);
  let lines="",nodes="",prev=null;
  journey.forEach((step,i)=>{
    const x=gap*(i+1), count=step.count;
    for(let o=0;o<count;o++){
      const y=14 + o*((H-22)/(count-1||1));
      if(o===step.chosen){
        if(prev) lines+=`<line x1="${prev.x}" y1="${prev.y}" x2="${x}" y2="${y}" stroke="url(#g)" stroke-width="2" opacity=".9"/>`;
        nodes+=`<circle cx="${x}" cy="${y}" r="5.5" fill="#fff"/><circle cx="${x}" cy="${y}" r="9" fill="none" stroke="#8b5cf6" stroke-width="1.5" opacity=".8"/>`;
        prev={x,y};
      } else {
        nodes+=`<circle cx="${x}" cy="${y}" r="3" fill="#9aa3c7" opacity=".2"/>`;
      }
    }
  });
  pathSvg.innerHTML = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#22d3ee"/><stop offset="1" stop-color="#fb7185"/></linearGradient></defs>${lines}${nodes}`;
}

