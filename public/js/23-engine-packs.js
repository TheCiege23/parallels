/* PARALLELS — Pack picker + shift/ripple rendering engine
   Part of a modular, single-responsibility build. Load order matters: this is file 23/24. Classic script (shared global scope). */
function toneGlow(color){
  const el=document.getElementById('toneglow');
  if(!el) return;
  if(!color){ el.style.opacity=0; return; }
  el.style.background=`radial-gradient(75% 60% at 50% 42%, ${color}55, transparent 72%)`;
  el.style.opacity=1;
}

function startShiftMode(){ renderPackPicker(); }

function renderPackPicker(){
  toneGlow(null);
  chapterEl.textContent="Change One Thing";
  pathLabel.textContent=""; pathSvg.innerHTML="";
  stage.className="stage fade";
  const cards=PACKS.map((p,i)=>`
    <button class="door" data-i="${i}">
      <span class="icon">${p.emoji}</span>
      <span class="txt"><b>${p.name} · ${p.vignettes.length}</b><span>${p.blurb}</span></span>
    </button>`).join('');
  stage.innerHTML=`
    <div class="scene-kicker">Pick a universe pack</div>
    <div class="scene-title">Which reality do you want to bend?</div>
    <div class="base-life">Each pack is a different flavor of "what if." Some will make you laugh. Some will keep you up tonight. Choose your door.</div>
    <div class="doors">${cards}</div>
    <div class="btn-row"><button class="btn ghost" id="backTitle">← Back</button></div>`;
  stage.querySelectorAll('.door').forEach(b=> b.onclick=()=>{
    activePack = PACKS[parseInt(b.dataset.i,10)];
    shiftIdx = Math.floor(Math.random()*activePack.vignettes.length);
    renderShift(shiftIdx);
  });
  document.getElementById('backTitle').onclick=renderTitle;
}

function renderShift(idx){
  toneGlow(null);
  const V=activePack.vignettes[idx];
  chapterEl.textContent=activePack.name;
  pathLabel.textContent=""; pathSvg.innerHTML="";
  stage.className="stage fade";
  const doors=V.variables.map((v,i)=>`
    <button class="door" data-i="${i}">
      <span class="icon">${v.icon}</span>
      <span class="txt"><b>${v.label}</b><span>${v.sub}</span></span>
    </button>`).join('');
  stage.innerHTML=`
    <div class="scene-kicker">${activePack.emoji} ${activePack.name} · a universe next door</div>
    <div class="scene-title">${V.title}</div>
    <div class="base-life">${V.base}</div>
    <div class="shift-prompt">Change one thing —</div>
    <div class="doors">${doors}</div>`;
  stage.querySelectorAll('.door').forEach(b=> b.onclick=()=>renderShifted(idx, parseInt(b.dataset.i,10)));
}

function renderShifted(idx, vi){
  const v=activePack.vignettes[idx].variables[vi], tone=TONE[v.tone];
  toneGlow(tone.c);
  sfxShift();
  chapterEl.textContent="Reality shifting…";
  stage.className="stage reality";
  stage.innerHTML=`
    <span class="tone-tag" style="color:${tone.c};border-color:${tone.c}66;background:${tone.c}18">◈ REALITY SHIFTED · ${tone.tag}</span>
    <div class="scene-kicker">You changed: ${v.label}</div>
    <div class="shift-new">${v.shift}</div>
    <div class="btn-row"><button class="btn" id="costBtn">See what it costs →</button></div>`;
  document.getElementById('costBtn').onclick=()=>renderRipple(idx,vi);
}

function renderRipple(idx, vi){
  const v=activePack.vignettes[idx].variables[vi], tone=TONE[v.tone];
  toneGlow(tone.c);
  chapterEl.textContent="The ripple";
  stage.className="stage";
  stage.innerHTML=`
    <span class="tone-tag" style="color:${tone.c};border-color:${tone.c}66;background:${tone.c}18">◈ ${tone.tag}</span>
    <div class="shift-new dim">${v.shift}</div>
    <div class="ripple-label">…and then the ripple</div>
    <div class="ripple-txt">${v.ripple}</div>
    <div class="shift-line">${v.line}</div>
    <div class="btn-row">
      <button class="btn" id="elseBtn">Change something else</button>
      <button class="btn ghost" id="nextUniBtn">Slide to another universe →</button>
    </div>
    <div class="btn-row" style="margin-top:12px">
      <button class="btn ghost" id="packBtn">← Another pack</button>
      <button class="btn ghost" id="menuBtn">Back to the start</button>
    </div>`;
  document.getElementById('elseBtn').onclick=()=>renderShift(idx);
  document.getElementById('nextUniBtn').onclick=()=>{
    const n=activePack.vignettes.length;
    shiftIdx = n>1 ? (idx + 1 + Math.floor(Math.random()*(n-1))) % n : 0;
    renderShift(shiftIdx);
  };
  document.getElementById('packBtn').onclick=()=>{ toneGlow(null); renderPackPicker(); };
  document.getElementById('menuBtn').onclick=()=>{ toneGlow(null); renderTitle(); };
  requestAnimationFrame(()=>stageReveal());
}

