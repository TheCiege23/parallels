'use strict';
/* PARALLELS module verifier — run: node tools/verify-modules.js
   1. syntax-checks every js/*.js module
   2. confirms the shell (public/parallels.html) loads them in numeric order
   3. confirms css/styles.css is linked
   Exits non-zero on any problem, so agents/CI can gate on it. */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const PUB = path.join(__dirname, '..', 'public');
const JS = path.join(PUB, 'js');
const shell = fs.readFileSync(path.join(PUB, 'parallels.html'), 'utf8');

let problems = 0;
const fail = m => { console.log('✗ ' + m); problems++; };

// 1. syntax
const files = fs.readdirSync(JS).filter(f => f.endsWith('.js')).sort();
for (const f of files) {
  try { execFileSync(process.execPath, ['--check', path.join(JS, f)], { stdio: 'pipe' }); }
  catch (e) { fail('syntax error in js/' + f + '\n' + String(e.stderr || e.message)); }
}

// 2. shell references every module, in order, and only those
const referenced = [...shell.matchAll(/<script src="js\/([^"]+)"><\/script>/g)].map(m => m[1]);
if (referenced.join(',') !== files.join(',')) {
  fail('shell script order != files on disk.\n  shell: ' + referenced.join(', ') +
       '\n  disk : ' + files.join(', '));
}
// boot must be last
if (referenced.length && !/boot/.test(referenced[referenced.length - 1])) {
  fail('last loaded module is not the boot file: ' + referenced[referenced.length - 1]);
}

// 3. css linked
if (!/<link rel="stylesheet" href="css\/styles\.css">/.test(shell)) fail('css/styles.css not linked in shell');

if (problems) { console.log('\n' + problems + ' problem(s).'); process.exit(1); }
console.log('✓ ' + files.length + ' modules syntax-OK, load order correct, css linked.');
