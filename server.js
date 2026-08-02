/* =========================================================================
   PARALLELS — Stage 3 backend
   Pure Node (no dependencies). Serves the game and generates personalized,
   historically-grounded life outcomes with the Anthropic API.
   - Set ANTHROPIC_API_KEY to switch the AI engine on.
   - Without a key, /api/generate returns {fallback:true} and the frontend
     gracefully uses its built-in written outcomes, so the game still runs.
   ========================================================================= */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY || '';
const MODEL = process.env.PARALLELS_MODEL || 'claude-3-5-haiku-latest';
const PUBLIC_DIR = path.join(__dirname, 'public');

const SYSTEM_PROMPT = `You are the narrative engine for PARALLELS, a game about the multiverse of choices.
Given a real person's profile and a real turning point in their life, you write what happens in the parallel universe where they made a DIFFERENT choice.

Rules:
- Write in second person ("you"). Vivid, cinematic, emotionally true, concrete.
- Ground it firmly in the real historical era provided (the events, economy, and culture of that exact year).
- Personalize using their real details (name, job, education, family, what they love, the thing they'd change). Weave a couple of them in naturally; do not list them.
- It is NOT all happy. Match the emotional tone requested. The multiverse contains dread, comedy, love, hard consequence, and the uncanny.
- ALWAYS end with a thread of hope or hard-won wisdom, even in dark outcomes. Never nihilistic. Never cruel about the person. Never encourage or depict self-harm; stay caring and life-affirming underneath.
- This is a game: it is plausible fiction, never a real prediction. Do not claim certainty about their real life.

Output STRICT JSON and nothing else, in exactly this shape:
{"outcome":"2-4 sentences: the immediate rewritten reality, in the moment","ripple":"2-4 sentences: the cost or cascade of that choice across the years that follow","line":"one short, punchy, reflective closing sentence","tone":"one of: love, dark, funny, consequence, scary"}`;

function buildUserPrompt(b){
  const p = b.profile || {};
  const era = b.era || {};
  const bits = [];
  if(p.name) bits.push(`Name: ${p.name}`);
  if(p.age) bits.push(`Age today: ${p.age}`);
  if(p.education) bits.push(`Education: ${p.education}`);
  if(p.job) bits.push(`Work: ${p.job}`);
  if(p.family) bits.push(`Family/relationship: ${p.family}`);
  if(p.love) bits.push(`Something they love: ${p.love}`);
  if(p.gripe) bits.push(`Something they'd change about their life: ${p.gripe}`);
  return `THE PERSON:
${bits.join('\n') || '(sparse profile — keep it universal)'}

THE MOMENT THEY'RE REVISITING:
Life stage: ${b.stage || 'a turning point'}
Year: ${b.year}
What the world was like that year:
- Around them: ${era.world || ''}
- Money & work: ${era.money || ''}
- The cultural vibe: ${era.culture || ''}

THE DIFFERENT CHOICE THEY'RE EXPLORING (what they did NOT do in real life):
"${(b.choice && b.choice.head) || ''}" — ${(b.choice && b.choice.sub) || ''}

Suggested emotional tone: ${b.suggestedTone || 'your call'} (use it, or pick a better-fitting one from the allowed list).

Write the parallel universe this choice opens. Return only the JSON.`;
}

function extractJson(text){
  if(!text) return null;
  let t = text.trim();
  // strip code fences if present
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if(fence) t = fence[1].trim();
  const a = t.indexOf('{'), z = t.lastIndexOf('}');
  if(a===-1 || z===-1 || z<a) return null;
  try{ return JSON.parse(t.slice(a, z+1)); }catch(e){ return null; }
}

function callAnthropic(body){
  return new Promise((resolve)=>{
    const payload = JSON.stringify({
      model: MODEL,
      max_tokens: 700,
      system: SYSTEM_PROMPT,
      messages: [{ role:'user', content: buildUserPrompt(body) }],
    });
    const req = https_request({
      method:'POST',
      hostname:'api.anthropic.com',
      path:'/v1/messages',
      headers:{
        'content-type':'application/json',
        'x-api-key': API_KEY,
        'anthropic-version':'2023-06-01',
        'content-length': Buffer.byteLength(payload),
      },
    }, (res)=>{
      let data='';
      res.on('data', d=> data+=d);
      res.on('end', ()=>{
        try{
          const j = JSON.parse(data);
          const text = j && j.content && j.content[0] && j.content[0].text;
          const parsed = extractJson(text);
          if(parsed && parsed.outcome && parsed.ripple && parsed.line){
            const allowed=['love','dark','funny','consequence','scary'];
            if(!allowed.includes(parsed.tone)) parsed.tone = body.suggestedTone || 'consequence';
            resolve(parsed);
          } else {
            resolve(null);
          }
        }catch(e){ resolve(null); }
      });
    });
    req.on('error', ()=> resolve(null));
    req.write(payload);
    req.end();
  });
}
// lazy require so the file reads top-down cleanly
const https = require('https');
function https_request(opts, cb){ return https.request(opts, cb); }

const MIME = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.svg':'image/svg+xml', '.ico':'image/x-icon' };

function serveFile(res, file){
  fs.readFile(file, (err, buf)=>{
    if(err){ res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
}

const server = http.createServer((req, res)=>{
  if(req.method==='GET' && (req.url==='/' || req.url==='')){
    return serveFile(res, path.join(PUBLIC_DIR, 'parallels.html'));
  }
  if(req.method==='GET' && req.url==='/favicon.ico'){ res.writeHead(204); return res.end(); }
  if(req.method==='GET' && req.url==='/healthz'){
    res.writeHead(200, {'content-type':'application/json'});
    return res.end(JSON.stringify({ ok:true, ai: !!API_KEY, model: API_KEY?MODEL:null }));
  }
  if(req.method==='POST' && req.url==='/api/generate'){
    let body='';
    req.on('data', d=>{ body+=d; if(body.length>20000) req.destroy(); });
    req.on('end', async ()=>{
      res.setHeader('content-type','application/json');
      if(!API_KEY){ res.writeHead(200); return res.end(JSON.stringify({ fallback:true, reason:'no_api_key' })); }
      let parsedBody={};
      try{ parsedBody = JSON.parse(body||'{}'); }catch(e){ res.writeHead(400); return res.end(JSON.stringify({error:'bad_json'})); }
      const out = await callAnthropic(parsedBody);
      if(out){ res.writeHead(200); res.end(JSON.stringify(out)); }
      else   { res.writeHead(200); res.end(JSON.stringify({ fallback:true, reason:'generation_failed' })); }
    });
    return;
  }
  // static assets under public/
  if(req.method==='GET'){
    const safe = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    const file = path.join(PUBLIC_DIR, safe);
    if(file.startsWith(PUBLIC_DIR) && fs.existsSync(file) && fs.statSync(file).isFile()){
      return serveFile(res, file);
    }
  }
  res.writeHead(404); res.end('Not found');
});

if(require.main === module){
  server.listen(PORT, ()=>{
    console.log(`PARALLELS running on :${PORT}  (AI engine: ${API_KEY?'ON — '+MODEL:'OFF — set ANTHROPIC_API_KEY to enable'})`);
  });
}
module.exports = server;
