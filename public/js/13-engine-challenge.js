/* PARALLELS — Challenge-link decode / viral entry
   Part of a modular, single-responsibility build. Load order matters: this is file 13/24. Classic script (shared global scope). */
/* ================= Incoming challenge (viral loop) ================= */
function walkPath(digits){
  let id=STORY.start, t={bold:0,bond:0,grit:0,vision:0}, jrny=[], di=0, guard=0;
  while(guard++<200){
    const node=STORY.nodes[id];
    if(!node) break;
    if(node.ending) break;
    if(node.checkpoint){ id=node.next; continue; }
    const ci=digits[di++]; if(ci==null) break;
    const ch=node.choices[ci]; if(!ch) break;
    for(const k in ch.eff) t[k]+=ch.eff[k];
    jrny.push({chosen:ci,count:node.choices.length});
    id=ch.next;
  }
  return {t,jrny};
}
function parseChallenge(){
  try{
    const p=new URLSearchParams(location.search).get('v');
    if(p && /^[0-9]{3,30}$/.test(p)){
      const digits=p.split('').map(Number);
      const {t,jrny}=walkPath(digits);
      if(jrny.length) return makeResult(t,jrny);
    }
  }catch(e){}
  return null;
}
const incomingChallenge = parseChallenge();

