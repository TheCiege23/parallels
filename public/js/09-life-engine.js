/* PARALLELS — Life-mode flow: intake -> moment -> scene -> AI outcome
   Part of a modular, single-responsibility build. Load order matters: this is file 09/24. Classic script (shared global scope). */
function renderProfileIntake(){
  toneGlow(null);
  chapterEl.textContent="Your Own Life"; pathLabel.textContent=""; pathSvg.innerHTML="";
  stage.className="stage fade";
  const p = profile || {};
  const eduOpts = ["","Still figuring it out","High school","Some college","Trade / vocational","Bachelor's","Graduate degree","Prefer not to say"];
  const famOpts = ["","Single","In a relationship","Married / partnered","I have kids","It's complicated","Prefer not to say"];
  const opt=(arr,sel)=>arr.map(o=>`<option ${o===sel?'selected':''} value="${esc(o)}">${o?esc(o):'Choose…'}</option>`).join('');
  stage.innerHTML=`
    <div class="scene-kicker">Beta · your real life</div>
    <div class="scene-title">Let's open a door back into your own life.</div>
    <div class="base-life">Tell me a little about you. Then you'll pick a real moment from your past, make a different choice, and see the universe it would've opened.</div>
    <div class="import-box" id="importBox">
      <div class="import-head">✦ Shortcut — import your real history</div>
      <div class="import-sub">Downloaded your Facebook info (choose <b>JSON</b> when you request it)? Pick the unzipped folder (or its .json files) and I'll fill this in and turn your real jobs, schools, moves, and relationships into turning points. Your file is read right here in your browser and never uploaded anywhere.</div>
      <div class="import-actions">
        <button type="button" class="btn ghost" id="importFolderBtn">Choose Facebook folder</button>
        <button type="button" class="btn ghost" id="importFilesBtn">Or pick JSON files</button>
      </div>
      <input type="file" id="importDir" webkitdirectory directory multiple style="display:none">
      <input type="file" id="importFiles" accept=".json,application/json" multiple style="display:none">
      <div class="import-status" id="importStatus"></div>
    </div>
    <div class="form-grid">
      <div class="ff"><label>Your name (optional)</label><input id="pf_name" value="${esc(p.name||'')}" placeholder="What should I call you?"></div>
      <div class="ff"><label>Your age today *</label><input id="pf_age" type="number" min="16" max="100" value="${p.age?esc(p.age):''}" placeholder="e.g. 30"></div>
      <div class="ff"><label>How far did school go?</label><select id="pf_edu">${opt(eduOpts,p.education||'')}</select></div>
      <div class="ff"><label>What do you do (or want to)?</label><input id="pf_job" value="${esc(p.job||'')}" placeholder="e.g. teacher, founder, still figuring it out"></div>
      <div class="ff"><label>Family / relationship</label><select id="pf_family">${opt(famOpts,p.family||'')}</select></div>
      <div class="ff"><label>One thing you love</label><input id="pf_love" value="${esc(p.love||'')}" placeholder="e.g. music, my kids, basketball"></div>
      <div class="ff"><label>One thing you'd change about your life</label><input id="pf_gripe" value="${esc(p.gripe||'')}" placeholder="e.g. I play it too safe"></div>
    </div>
    <div class="form-err" id="pf_err"></div>
    <div class="btn-row">
      <button class="btn" id="pf_go">Find my turning points →</button>
      <button class="btn ghost" id="pf_back">← Back</button>
    </div>
    <div class="privacy">Private by design: nothing you type here is saved or sent anywhere. It lives only in this browser tab, and vanishes when you close it.</div>`;
  document.getElementById('pf_go').onclick=()=>{
    const age=parseInt(document.getElementById('pf_age').value,10);
    const err=document.getElementById('pf_err');
    if(!age || age<16 || age>100){ err.textContent="Enter an age between 16 and 100 so I can find your turning points."; err.style.display="block"; return; }
    profile={
      name:document.getElementById('pf_name').value.trim(),
      age, birthYear:CURRENT_YEAR-age,
      education:document.getElementById('pf_edu').value,
      job:document.getElementById('pf_job').value.trim(),
      family:document.getElementById('pf_family').value,
      love:document.getElementById('pf_love').value.trim(),
      gripe:document.getElementById('pf_gripe').value.trim(),
    };
    if(importedData){
      if(importedData.birthYear) profile.birthYear=importedData.birthYear;
      if(importedData.moments && importedData.moments.length) profile.moments=importedData.moments;
    }
    renderMomentPicker();
  };
  document.getElementById('pf_back').onclick=renderTitle;
  (function(){
    const dir=document.getElementById('importDir'), fil=document.getElementById('importFiles'), box=document.getElementById('importBox');
    if(!box) return;
    document.getElementById('importFolderBtn').onclick=()=>dir.click();
    document.getElementById('importFilesBtn').onclick=()=>fil.click();
    dir.onchange=()=>handleImportFiles(dir.files);
    fil.onchange=()=>handleImportFiles(fil.files);
    ['dragenter','dragover'].forEach(ev=>box.addEventListener(ev,e=>{e.preventDefault();box.classList.add('drag');}));
    ['dragleave','drop'].forEach(ev=>box.addEventListener(ev,e=>{e.preventDefault();box.classList.remove('drag');}));
    box.addEventListener('drop',e=>{ if(e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files.length) handleImportFiles(e.dataTransfer.files); });
  })();
}

function renderMomentPicker(){
  toneGlow(null);
  chapterEl.textContent="Your Own Life";
  stage.className="stage fade";
  const imported = !!(profile.moments && profile.moments.length);
  const avail = imported ? profile.moments : STAGES.filter(s=> s.age <= profile.age);
  const hi = profile.name ? esc(profile.name)+", pick" : "Pick";
  const yearOf = s => (s.year!=null) ? s.year : (profile.birthYear + s.age);
  const cards = avail.length ? avail.map((s,i)=>{
    const y=yearOf(s); const agePart = (s.age!=null) ? `Age ${s.age} · ` : '';
    return `<button class="door" data-i="${i}">
      <span class="icon">${s.emoji}</span>
      <span class="txt"><b>${agePart}<span class="moment-year">${y}</span></b><span>${esc(s.label)} · ${esc(eraDetail(y).vibe)}</span></span>
    </button>`;
  }).join('') : `<div class="base-life">You're at the very start of the story. Come back in a few years and there'll be turning points to revisit.</div>`;
  const kicker = imported ? `✦ Pulled from your real history` : `You were born around ${profile.birthYear}`;
  const body = imported
    ? `These are real turning points from your own timeline. Step into one, make the other choice, and watch the universe it opens.`
    : `These are the real forks in your timeline. Step into one, make the other choice, and watch the universe it opens.`;
  stage.innerHTML=`
    <div class="scene-kicker">${kicker}</div>
    <div class="scene-title">${hi} a moment to go back to.</div>
    <div class="base-life">${body}</div>
    <div class="doors">${cards}</div>
    <div class="btn-row"><button class="btn ghost" id="editBtn">← Edit my info</button></div>`;
  stage.querySelectorAll('.door').forEach(b=> b.onclick=()=>renderLifeScene(avail[parseInt(b.dataset.i,10)]));
  document.getElementById('editBtn').onclick=renderProfileIntake;
}

function renderLifeScene(s){
  toneGlow(null);
  const year = (s.year!=null) ? s.year : (profile.birthYear + s.age);
  const era=eraContext(year), d=eraDetail(year);
  const sc=s.make(profile, year, era);
  chapterEl.textContent = (s.age!=null ? `Age ${s.age} · ` : '') + year;
  stage.className="stage fade";
  const doors=sc.choices.map((c,i)=>`
    <button class="door" data-i="${i}">
      <span class="icon">${c.icon}</span>
      <span class="txt"><b>${c.head}</b><span>${c.sub}</span></span>
    </button>`).join('');
  stage.innerHTML=`
    <div class="scene-kicker">${s.emoji} ${sc.kicker}</div>
    <div class="scene-title">${sc.title}</div>
    <div class="base-life">${sc.body}</div>
    <div class="era-card">
      <div class="eh">📅 The world in ${year}</div>
      <div class="era-row"><span class="k">Around you</span><span class="v">${d.world}</span></div>
      <div class="era-row"><span class="k">Money &amp; work</span><span class="v">${d.money}</span></div>
      <div class="era-row"><span class="k">The vibe</span><span class="v">${d.culture}</span></div>
    </div>
    <div class="shift-prompt">If you'd chosen differently —</div>
    <div class="doors">${doors}</div>`;
  stage.querySelectorAll('.door').forEach(b=> b.onclick=()=>renderLifeOutcome(s, parseInt(b.dataset.i,10)));
}

// AI is available only when the page is served by the backend (not opened as a file).
const AI_ENABLED = (location.protocol==='http:'||location.protocol==='https:');

async function renderLifeOutcome(s, i){
  const year = (s.year!=null) ? s.year : (profile.birthYear + s.age);
  const era=eraContext(year), d=eraDetail(year);
  const sc=s.make(profile, year, era);
  const c=sc.choices[i];
  const fallback={outcome:c.outcome, ripple:c.ripple, line:c.line, tone:c.tone, source:'written-in'};
  if(!AI_ENABLED){ return renderLifeOutcomeView(s,i,year,c,fallback); }
  // loading state while the AI writes a universe that has never existed
  const tone=TONE[c.tone]||TONE.love; toneGlow(tone.c);
  chapterEl.textContent="Computing your universe…";
  stage.className="stage fade";
  stage.innerHTML=`<div style="text-align:center;width:100%">
      <div class="collapse-txt">Opening a universe that has<br>never existed before…</div>
      <div class="collapse-sub">writing ${year} just for you</div>
    </div>`;
  let out=null;
  try{ out=await fetchAIOutcome(s,i,year,d,c); }catch(e){ out=null; }
  renderLifeOutcomeView(s,i,year,c, out||fallback);
}

async function fetchAIOutcome(s,i,year,d,c){
  const ctrl=new AbortController(); const t=setTimeout(()=>ctrl.abort(),28000);
  try{
    const res=await fetch('/api/generate',{
      method:'POST', headers:{'Content-Type':'application/json'}, signal:ctrl.signal,
      body:JSON.stringify({ profile, stage:s.label, year, era:d, choice:{head:c.head, sub:c.sub}, suggestedTone:c.tone })
    });
    clearTimeout(t);
    if(!res.ok) return null;
    const j=await res.json();
    if(j && j.outcome && j.ripple && j.line){
      return { outcome:j.outcome, ripple:j.ripple, line:j.line, tone:j.tone||c.tone, source:'ai' };
    }
    return null; // server fallback (no key) → use the written-in outcome
  }catch(e){ clearTimeout(t); return null; }
}

function renderLifeOutcomeView(s,i,year,c,out){
  const tone=TONE[out.tone]||TONE.love;
  currentLife = { name:profile.name, year, headline:c.head, outcome:out.outcome, tone:out.tone };
  toneGlow(tone.c);
  chapterEl.textContent="The universe it opens";
  stage.className="stage";
  const badge = out.source==='ai' ? `◈ ${year} · WRITTEN LIVE, JUST FOR YOU` : `◈ ${year} · REWRITTEN · ${tone.tag}`;
  const note = out.source==='ai' ? `<div class="ai-note">✦ Generated live by AI from your details and the real ${year} — plausible fiction, not a prediction.</div>` : '';
  stage.innerHTML=`
    <span class="tone-tag" style="color:${tone.c};border-color:${tone.c}66;background:${tone.c}18">${badge}</span>
    <div class="scene-kicker">You chose: ${c.head}</div>
    <div class="life-out">${esc(out.outcome)}</div>
    <div class="ripple-label">…and the ripple through your life</div>
    <div class="ripple-txt">${esc(out.ripple)}</div>
    <div class="shift-line">${esc(out.line)}</div>
    ${note}
    <div class="challenge-cta">Someone you love has a moment like this too. Send it and see the life <b>they'd</b> find.</div>
    <div class="btn-row">
      <button class="btn" id="shareLifeBtn">Share this life ✦</button>
      <button class="btn ghost" id="dlLifeBtn">Download image</button>
    </div>
    <div class="btn-row" style="margin-top:12px">
      <button class="btn ghost" id="elseBtn">Make a different choice</button>
      <button class="btn ghost" id="momentBtn">Visit another moment →</button>
    </div>
    <div class="btn-row" style="margin-top:12px">
      <button class="btn ghost" id="editBtn2">Edit my info</button>
      <button class="btn ghost" id="menuBtn">Back to the start</button>
    </div>`;
  document.getElementById('shareLifeBtn').onclick=shareLife;
  document.getElementById('dlLifeBtn').onclick=downloadLife;
  document.getElementById('elseBtn').onclick=()=>renderLifeScene(s);
  document.getElementById('momentBtn').onclick=()=>{ toneGlow(null); renderMomentPicker(); };
  document.getElementById('editBtn2').onclick=()=>{ toneGlow(null); renderProfileIntake(); };
  document.getElementById('menuBtn').onclick=()=>{ toneGlow(null); renderTitle(); };
  sfxShift();
  requestAnimationFrame(()=>stageReveal());
}

