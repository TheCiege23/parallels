/* PARALLELS — Animated starfield background
   Part of a modular, single-responsibility build. Load order matters: this is file 12/24. Classic script (shared global scope). */
/* ================= Starfield ================= */
const canvas=document.getElementById('stars'), ctx=canvas.getContext('2d');
let starsArr=[], W2, H2;
function resize(){
  W2=canvas.width=window.innerWidth; H2=canvas.height=window.innerHeight;
  const count=Math.min(220,Math.floor(W2*H2/9000));
  starsArr=Array.from({length:count},()=>({x:Math.random()*W2,y:Math.random()*H2,z:Math.random()*.8+.2,r:Math.random()*1.4+.3,tw:Math.random()*Math.PI*2}));
}
function tick(){
  ctx.clearRect(0,0,W2,H2);
  for(const s of starsArr){
    s.tw+=0.02*s.z; const a=.35+Math.sin(s.tw)*.35+.3*s.z;
    ctx.globalAlpha=Math.max(0,Math.min(1,a)); ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=s.z>.7?"#c9d4ff":"#8b93c9"; ctx.fill();
    s.y+=s.z*0.06; if(s.y>H2){s.y=0;s.x=Math.random()*W2;}
  }
  ctx.globalAlpha=1; requestAnimationFrame(tick);
}
window.addEventListener('resize',resize); resize(); requestAnimationFrame(tick);

