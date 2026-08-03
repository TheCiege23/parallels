/* PARALLELS — Result share-card rendering + viral links
   Part of a modular, single-responsibility build. Load order matters: this is file 04/24. Classic script (shared global scope). */
/* ================= Sharing / viral loop ================= */
function shareLink(){ return location.origin + location.pathname + '?v=' + currentResult.code; }
function shareText(){ return `I built "${currentResult.name}" in PARALLELS 🌌 Every choice is a door. Which universe would YOU build?`; }
function buildCardBlob(){
  const c=document.createElement('canvas'); c.width=1080; c.height=1920;
  drawShareCard(c.getContext('2d'), currentResult);
  return new Promise(res=>c.toBlob(res,'image/png'));
}
async function shareResult(){
  const url=shareLink(), text=shareText();
  try{
    const blob=await buildCardBlob();
    const file=new File([blob],'my-universe.png',{type:'image/png'});
    if(navigator.canShare && navigator.canShare({files:[file]})){ await navigator.share({files:[file],text,url}); return; }
    if(navigator.share){ await navigator.share({text,url}); return; }
  }catch(e){}
  downloadCard(); copyLink();
}
async function downloadCard(){
  const btn=document.getElementById('dlBtn');
  try{
    const blob=await buildCardBlob();
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='my-universe.png';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),3000);
    if(btn){ btn.textContent="Saved ✓"; setTimeout(()=>btn.textContent="Download image",1800); }
  }catch(e){ if(btn) btn.textContent="Couldn't save"; }
}
function copyLink(){
  const btn=document.getElementById('linkBtn');
  navigator.clipboard?.writeText(shareLink()).then(()=>{
    if(btn){ btn.textContent="Link copied ✓"; setTimeout(()=>btn.textContent="Copy challenge link",1800); }
  }).catch(()=>{ if(btn) btn.textContent="Link ready"; });
}
function roundRect(ctx,x,y,w,h,r){ if(w<r*2)r=w/2; ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function wrapTextCentered(ctx,text,cx,y,maxW,lh){
  const words=text.split(' '); let line=''; const lines=[];
  for(const w of words){ const t=line?line+' '+w:w; if(ctx.measureText(t).width>maxW&&line){lines.push(line);line=w;}else line=t; }
  if(line)lines.push(line); lines.forEach((ln,i)=>ctx.fillText(ln,cx,y+i*lh)); return lines.length;
}
function drawShareCard(x,R){
  const W=1080,H=1920;
  x.fillStyle="#05060f"; x.fillRect(0,0,W,H);
  let g=x.createRadialGradient(W*.5,H*.10,40,W*.5,H*.10,W*.85);
  g.addColorStop(0,"rgba(139,92,246,.38)"); g.addColorStop(1,"rgba(139,92,246,0)"); x.fillStyle=g; x.fillRect(0,0,W,H);
  g=x.createRadialGradient(W*.85,H*.92,40,W*.85,H*.92,W*.75);
  g.addColorStop(0,"rgba(34,211,238,.24)"); g.addColorStop(1,"rgba(34,211,238,0)"); x.fillStyle=g; x.fillRect(0,0,W,H);
  for(let i=0;i<170;i++){ x.globalAlpha=Math.random()*.7+.2; x.beginPath();
    x.arc(Math.random()*W,Math.random()*H,Math.random()*2.2+.5,0,7); x.fillStyle=Math.random()>.5?"#cbd5ff":"#8b93c9"; x.fill(); }
  x.globalAlpha=1; x.textAlign="center";
  x.fillStyle="#9aa3c7"; x.font="700 36px -apple-system,'Segoe UI',Roboto,sans-serif"; x.fillText("P A R A L L E L S",W/2,160);
  const rc=R.rarity.color; x.font="800 30px -apple-system,'Segoe UI',Roboto,sans-serif";
  const rw=x.measureText(R.rarity.tier).width+60;
  x.fillStyle=rc+"22"; roundRect(x,W/2-rw/2,400,rw,56,28); x.fill();
  x.strokeStyle=rc+"88"; x.lineWidth=2; roundRect(x,W/2-rw/2,400,rw,56,28); x.stroke();
  x.fillStyle=rc; x.fillText(R.rarity.tier,W/2,438);
  x.fillStyle="#9aa3c7"; x.font="400 42px -apple-system,'Segoe UI',Roboto,sans-serif"; x.fillText("The universe I built",W/2,540);
  const ng=x.createLinearGradient(90,560,990,760);
  ng.addColorStop(0,"#ffffff"); ng.addColorStop(.55,"#fbbf24"); ng.addColorStop(1,"#fb7185");
  x.fillStyle=ng; x.font="900 78px -apple-system,'Segoe UI',Roboto,sans-serif";
  const nLines=wrapTextCentered(x,R.name,W/2,660,920,90);
  let idY=660+nLines*90+40;
  x.fillStyle="#22d3ee"; x.font="500 34px ui-monospace,Menlo,monospace"; x.fillText(R.verseId,W/2,idY);
  const dims=Object.keys(DIMS), max=Math.max(6,...Object.values(R.t).map(v=>Math.abs(v))); let by=idY+120;
  dims.forEach(k=>{
    const pct=Math.max(.04,Math.min(1,R.t[k]/max));
    x.textAlign="right"; x.fillStyle="#9aa3c7"; x.font="500 32px -apple-system,sans-serif"; x.fillText(DIMS[k].label,380,by+9);
    x.fillStyle="rgba(255,255,255,.09)"; roundRect(x,410,by-20,500,28,14); x.fill();
    x.fillStyle=DIMS[k].color; roundRect(x,410,by-20,Math.max(28,500*pct),28,14); x.fill(); by+=76;
  });
  x.textAlign="center";
  const cg=x.createLinearGradient(0,0,W,0); cg.addColorStop(0,"#22d3ee"); cg.addColorStop(1,"#8b5cf6");
  x.fillStyle=cg; x.font="800 60px -apple-system,'Segoe UI',Roboto,sans-serif";
  x.fillText("Which universe",W/2,1640); x.fillText("would YOU build?",W/2,1712);
  x.fillStyle="#9aa3c7"; x.font="400 36px -apple-system,sans-serif"; x.fillText("Every choice is a door.",W/2,1800);
}

