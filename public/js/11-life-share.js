/* PARALLELS — "The life I found" share card
   Part of a modular, single-responsibility build. Load order matters: this is file 11/24. Classic script (shared global scope). */
/* ---- Your Own Life: shareable "the life I found" card ---- */
let currentLife = null;
function blobFromDraw(drawFn){ const c=document.createElement('canvas'); c.width=1080; c.height=1920; drawFn(c.getContext('2d')); return new Promise(r=>c.toBlob(r,'image/png')); }
function wrapParagraph(text, maxChars){
  const words=String(text||'').split(' '); const lines=[]; let line='';
  for(const w of words){ if((line+' '+w).trim().length>maxChars){ if(line) lines.push(line.trim()); line=w; } else line+=' '+w; }
  if(line.trim()) lines.push(line.trim()); return lines;
}
function drawLifeCard(x, L){
  const W=1080,H=1920, tone=TONE[L.tone]||TONE.love, rc=tone.c;
  x.fillStyle="#05060f"; x.fillRect(0,0,W,H);
  let g=x.createRadialGradient(W*.5,H*.12,40,W*.5,H*.12,W*.85); g.addColorStop(0,rc+"55"); g.addColorStop(1,rc+"00"); x.fillStyle=g; x.fillRect(0,0,W,H);
  g=x.createRadialGradient(W*.85,H*.9,40,W*.85,H*.9,W*.7); g.addColorStop(0,"rgba(34,211,238,.18)"); g.addColorStop(1,"rgba(34,211,238,0)"); x.fillStyle=g; x.fillRect(0,0,W,H);
  for(let i=0;i<160;i++){ x.globalAlpha=Math.random()*.7+.2; x.beginPath(); x.arc(Math.random()*W,Math.random()*H,Math.random()*2.2+.5,0,7); x.fillStyle=Math.random()>.5?"#cbd5ff":"#8b93c9"; x.fill(); }
  x.globalAlpha=1; x.textAlign="center";
  x.fillStyle="#9aa3c7"; x.font="700 36px -apple-system,'Segoe UI',Roboto,sans-serif"; x.fillText("P A R A L L E L S", W/2, 150);
  x.fillStyle=rc; x.font="800 30px -apple-system,sans-serif"; x.fillText("THE LIFE I FOUND · "+L.year, W/2, 250);
  const ng=x.createLinearGradient(90,300,990,470); ng.addColorStop(0,"#ffffff"); ng.addColorStop(1,rc);
  x.fillStyle=ng; x.font="900 60px -apple-system,'Segoe UI',Roboto,sans-serif";
  const nLines=wrapTextCentered(x, L.headline, W/2, 380, 900, 72);
  let y=380 + nLines*72 + 60;
  x.fillStyle="#d7dcff"; x.font="400 37px -apple-system,sans-serif";
  wrapParagraph(L.outcome, 46).slice(0,11).forEach(ln=>{ x.fillText(ln, W/2, y); y+=52; });
  const cg=x.createLinearGradient(0,0,W,0); cg.addColorStop(0,"#22d3ee"); cg.addColorStop(1,"#8b5cf6");
  x.fillStyle=cg; x.font="800 50px -apple-system,'Segoe UI',Roboto,sans-serif";
  x.fillText("What life would YOU find?", W/2, 1750);
  x.fillStyle="#9aa3c7"; x.font="400 33px -apple-system,sans-serif"; x.fillText("Go back. Change one thing. — PARALLELS", W/2, 1806);
}
async function shareLife(){
  if(!currentLife) return;
  const text=`I went back to ${currentLife.year} and found another life in PARALLELS 🌌 What life would you find?`;
  const url=location.origin+location.pathname;
  try{
    const blob=await blobFromDraw(x=>drawLifeCard(x,currentLife));
    const file=new File([blob],'my-life.png',{type:'image/png'});
    if(navigator.canShare && navigator.canShare({files:[file]})){ await navigator.share({files:[file],text,url}); return; }
    if(navigator.share){ await navigator.share({text,url}); return; }
  }catch(e){}
  downloadLife();
}
async function downloadLife(){
  if(!currentLife) return;
  const btn=document.getElementById('dlLifeBtn');
  try{
    const blob=await blobFromDraw(x=>drawLifeCard(x,currentLife));
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='my-life.png'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),3000);
    if(btn){ btn.textContent="Saved ✓"; setTimeout(()=>btn.textContent="Download image",1800); }
  }catch(e){ if(btn) btn.textContent="Couldn't save"; }
}

