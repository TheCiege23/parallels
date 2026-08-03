/* PARALLELS — Facebook export importer (parsed in-browser)
   Part of a modular, single-responsibility build. Load order matters: this is file 07/24. Classic script (shared global scope). */
/* ---- Facebook export import — parsed in-browser, never uploaded ---- */
let importedData = null;

function fixMojibake(s){
  if(typeof s!=='string') return s;
  try{ const f = decodeURIComponent(escape(s)); return f; }catch(e){ return s; }
}
function tsToYear(ts){
  if(ts==null) return null;
  let n = typeof ts==='string' ? parseInt(ts,10) : ts;
  if(!n || isNaN(n)) return null;
  if(n < 1e11) n = n*1000; // seconds -> ms
  try{ const y=new Date(n).getFullYear(); return (y>1900 && y<2100) ? y : null; }catch(e){ return null; }
}
function firstDefined(obj, keys){ for(const k of keys){ if(obj && obj[k]!=null && obj[k]!=='') return obj[k]; } return null; }

function parseFacebookExport(entries){
  const out={ name:null, birthYear:null, age:null, education:null, job:null, family:null, moments:[] };
  let root=null;
  for(const e of entries){
    let obj; try{ obj=JSON.parse(e.text); }catch(err){ continue; }
    if(!obj) continue;
    const r = obj.profile_v2 || obj.profile || ((obj.name||obj.work||obj.education||obj.birthday) ? obj : null);
    if(r && (r.name||r.work||r.education||r.birthday) && !root){ root=r; }
  }
  if(root){
    const nm = root.name;
    out.name = fixMojibake(typeof nm==='string' ? nm : (nm && (nm.full_name||nm.name)) || null);
    if(root.birthday && root.birthday.year){ out.birthYear=root.birthday.year; out.age=CURRENT_YEAR-out.birthYear; }
    const edu = root.education;
    if(Array.isArray(edu) && edu.length){
      const types = edu.map(x=>(x.school_type||x.type||'').toLowerCase());
      out.education = types.some(t=>t.includes('grad')) ? 'Graduate degree'
        : types.some(t=>t.includes('college')||t.includes('university')) ? "Bachelor's"
        : types.some(t=>t.includes('high')) ? 'High school' : 'Some college';
      edu.forEach(x=>{
        const y=tsToYear(firstDefined(x,['start_timestamp','graduation_timestamp','timestamp']));
        const name=fixMojibake(firstDefined(x,['name','school','title']));
        if(name && y) out.moments.push({type:'school',year:y,emoji:'🎓',label:'Started at '+name,data:{name}});
      });
    }
    const work = root.work;
    if(Array.isArray(work) && work.length){
      const rec=work[0];
      const emp=fixMojibake(firstDefined(rec,['employer','name','company']));
      const pos=fixMojibake(firstDefined(rec,['position','title']));
      out.job = (pos&&emp)?(pos+' at '+emp):(emp||pos||null);
      work.forEach(w=>{
        const y=tsToYear(firstDefined(w,['start_timestamp','start_date','timestamp']));
        const emp2=fixMojibake(firstDefined(w,['employer','name','company']));
        const pos2=fixMojibake(firstDefined(w,['position','title']));
        if(emp2 && y) out.moments.push({type:'job',year:y,emoji:'💼',label:'Started at '+emp2,data:{employer:emp2,position:pos2}});
      });
    }
    const places = root.places_lived || root.places;
    if(Array.isArray(places)) places.forEach(p=>{
      const y=tsToYear(firstDefined(p,['start_timestamp','timestamp']));
      const place=fixMojibake(firstDefined(p,['place','name']));
      if(place && y) out.moments.push({type:'move',year:y,emoji:'📍',label:'Moved to '+place,data:{place}});
    });
    const rel = root.relationship;
    if(rel){
      const status=fixMojibake(firstDefined(rel,['status']));
      out.family = status || out.family;
      const y=tsToYear(firstDefined(rel,['timestamp','anniversary_timestamp']));
      if(y) out.moments.push({type:'relationship',year:y,emoji:'💞',label:(status||'A relationship')+' begins',data:{status}});
    }
  }
  const seen=new Set();
  out.moments = out.moments
    .filter(m=>{ const k=m.type+'|'+m.year+'|'+m.label; if(seen.has(k)) return false; seen.add(k); return true; })
    .filter(m=> m.year>=1950 && m.year<=CURRENT_YEAR)
    .sort((a,b)=>a.year-b.year).slice(0,12);
  out.moments.forEach(m=>{ if(out.birthYear) m.age=m.year-out.birthYear; m.make=(p,year,era)=>makeEventScene(m,p,year,era); });
  return out;
}

async function handleImportFiles(fileList){
  const status=document.getElementById('importStatus');
  let files=Array.from(fileList||[]).filter(f=>/\.json$/i.test(f.name));
  if(!files.length){ if(status){status.className='import-status err'; status.textContent="I didn't see any .json files. Unzip the Facebook download first (choose JSON format when you request it), then pick the folder or its files.";} return; }
  const rel=/profile|posts|work|education|places|relationship|about/i;
  files.sort((a,b)=>(rel.test(a.webkitRelativePath||a.name)?0:1)-(rel.test(b.webkitRelativePath||b.name)?0:1));
  files=files.slice(0,80);
  if(status){ status.className='import-status'; status.textContent='Reading '+files.length+' file'+(files.length>1?'s':'')+'…'; }
  let entries=[];
  try{ entries=await Promise.all(files.map(async f=>({name:f.name, text:await f.text()}))); }
  catch(e){ if(status){status.className='import-status err'; status.textContent='Could not read those files.';} return; }
  const d=parseFacebookExport(entries);
  if(!(d.name||d.age||d.job||d.education||d.moments.length)){
    if(status){status.className='import-status err'; status.textContent="I read the files but couldn't find your profile. Make sure you include profile_information.json (in the export's 'profile_information' folder).";}
    return;
  }
  importedData=d;
  const setv=(id,val)=>{ const el=document.getElementById(id); if(el&&val) el.value=val; };
  setv('pf_name',d.name); if(d.age) setv('pf_age',String(d.age)); setv('pf_job',d.job);
  if(d.education){ const s=document.getElementById('pf_edu'); if(s) s.value=d.education; }
  if(d.family){ const s=document.getElementById('pf_family'); if(s){ const v=(d.family||'').toLowerCase();
    s.value = (v.includes('married')||v.includes('partner'))?'Married / partnered' : v.includes('relationship')?'In a relationship' : v.includes('single')?'Single' : s.value; } }
  const bits=[]; if(d.name)bits.push(d.name); if(d.age)bits.push('age ~'+d.age); if(d.job)bits.push(d.job);
  if(status){ status.className='import-status ok'; status.innerHTML='✦ Imported '+(bits.length?('<b>'+esc(bits.join(' · '))+'</b>'):'your info')+(d.moments.length?(' and <b>'+d.moments.length+' real turning point'+(d.moments.length>1?'s':'')+'</b> from your history.'):'.')+' Scroll down and hit continue.'; }
}

// build a playable, personalized scene from a real imported life event
