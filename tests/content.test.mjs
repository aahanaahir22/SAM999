import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const html=fs.readFileSync('./index.html','utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
for(const m of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(m[1]),m[1]);
assert.equal(createHash('sha256').update(fs.readFileSync('./data.js')).digest('hex'),'5ab087d886b29146dcf65caa83fff90c4b9e2ceeb8fc84147385c22677b0238c','Profile content must remain exact');
for(const f of fs.readdirSync('.').filter(f=>f.endsWith('.js'))){const s=fs.readFileSync('./'+f,'utf8');for(const m of s.matchAll(/from ['"]\.\/([^'"]+)['"]/g))assert.ok(fs.existsSync('./'+m[1]),m[1]);}
for(const id of ['contact-form','mode-select','difficulty','graphics','start-range','exit-range','radar'])assert.ok(ids.includes(id));
console.log('PASS: exact profile preservation, anchor targets, unique IDs, local imports and controls');
