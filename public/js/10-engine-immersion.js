/* PARALLELS — Audio engine + reveal animation
   Part of a modular, single-responsibility build. Load order matters: this is file 10/24. Classic script (shared global scope). */
/* ================= Immersion: sound + reveal ================= */
let audioCtx=null, masterGain=null, ambientGain=null, audioStarted=false, muted=false;
function initAudio(){
  if(audioStarted) return;
  try{
    const AC = window.AudioContext || window.webkitAudioContext; if(!AC) return;
    audioCtx = new AC();
    if(audioCtx.state === 'suspended') audioCtx.resume();
    masterGain = audioCtx.createGain(); masterGain.gain.value = muted?0:0.9; masterGain.connect(audioCtx.destination);
    startAmbient();
    audioStarted = true;
  }catch(e){}
}
function startAmbient(){
  ambientGain = audioCtx.createGain(); ambientGain.gain.value = 0; ambientGain.connect(masterGain);
  const filter = audioCtx.createBiquadFilter(); filter.type='lowpass'; filter.frequency.value=480; filter.Q.value=5; filter.connect(ambientGain);
  const mk=(type,freq,det)=>{ const o=audioCtx.createOscillator(); o.type=type; o.frequency.value=freq; o.detune.value=det||0; o.connect(filter); o.start(); return o; };
  mk('sine',55,0); mk('sine',82.5,6); mk('triangle',110,-5);
  const lfo=audioCtx.createOscillator(); lfo.type='sine'; lfo.frequency.value=0.05;
  const lfoGain=audioCtx.createGain(); lfoGain.gain.value=160; lfo.connect(lfoGain); lfoGain.connect(filter.frequency); lfo.start();
  ambientGain.gain.setTargetAtTime(0.05, audioCtx.currentTime, 3);
}
function tone(opts){
  if(!audioCtx || muted) return;
  const {freq=440,type='sine',gain=0.1,attack=0.005,decay=0.15,slideTo=null}=opts||{};
  const o=audioCtx.createOscillator(); o.type=type; o.frequency.value=freq;
  const g=audioCtx.createGain(); o.connect(g); g.connect(masterGain);
  const t=audioCtx.currentTime;
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(gain,t+attack); g.gain.exponentialRampToValueAtTime(0.0001,t+attack+decay);
  if(slideTo) o.frequency.exponentialRampToValueAtTime(slideTo,t+attack+decay);
  o.start(t); o.stop(t+attack+decay+0.05);
}
function sfxShift(){ tone({freq:130,slideTo:620,type:'sawtooth',gain:0.06,attack:0.03,decay:0.6}); tone({freq:320,slideTo:960,type:'sine',gain:0.04,attack:0.06,decay:0.55}); }
function sfxClick(){ tone({freq:520,type:'triangle',gain:0.05,attack:0.003,decay:0.09}); }
function sfxTick(){ tone({freq:760,type:'sine',gain:0.018,attack:0.002,decay:0.035}); }
function setMuted(m){
  muted = m;
  if(masterGain && audioCtx) masterGain.gain.setTargetAtTime(m?0:0.9, audioCtx.currentTime, 0.05);
  const b=document.getElementById('audioToggle'); if(b) b.textContent = m ? '🔇' : '🔈';
}
document.getElementById('audioToggle').addEventListener('click', ()=>{ initAudio(); setMuted(!muted); });
document.addEventListener('click', (e)=>{ if(e.target.closest('.door,.btn')){ initAudio(); sfxClick(); } }, true);

// stagger the reveal of the current stage's blocks so text unfurls cinematically
function stageReveal(gap){
  gap = gap || 150;
  const kids = Array.from(stage.children);
  let idx = 0;
  kids.forEach(el=>{
    const isBtns = el.classList && el.classList.contains('btn-row');
    el.style.opacity = '0'; el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity .55s ease, transform .55s ease';
    const delay = isBtns ? (140 + idx*gap + 300) : (140 + idx*gap);
    setTimeout(()=>{ el.style.opacity='1'; el.style.transform='none'; if(!isBtns) sfxTick(); }, delay);
    if(!isBtns) idx++;
  });
}

