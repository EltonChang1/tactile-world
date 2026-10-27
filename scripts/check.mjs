import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures=[];
let linkCount=0;
const assert=(condition,message)=>{if(!condition)failures.push(message);};
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const json=rel=>JSON.parse(read(rel));
const unique=(items,label)=>assert(new Set(items.map(x=>x.id)).size===items.length,`${label}: duplicate IDs`);
const checkLink=(href,from)=>{
  if(!href || /^(?:[a-z]+:|#|\/\/)/i.test(href))return;
  const clean=decodeURIComponent(href.split(/[?#]/)[0]);
  if(!clean)return;
  const target=path.resolve(path.dirname(path.join(root,from)),clean);
  assert(target===root||target.startsWith(root+path.sep),`${from}: link escapes repository: ${href}`);
  assert(fs.existsSync(target),`${from}: missing local target: ${href}`);
  linkCount++;
};

for(const rel of ['README.md',...fs.readdirSync(path.join(root,'docs')).filter(x=>x.endsWith('.md')).map(x=>'docs/'+x)]) {
  for(const match of read(rel).matchAll(/\]\((<?[^)\n]+>?)\)/g))checkLink(match[1].replace(/^<|>$/g,''),rel);
}
const html=read('web/index.html');
for(const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g))checkLink(match[1],'web/index.html');
for(const match of read('web/app.js').matchAll(/["'`]((?:\.\.\/|\.\/)[^"'`\s<>]+)["'`]/g))checkLink(match[1],'web/app.js');
const ids=[...html.matchAll(/\bid=["']([^"']+)["']/g)].map(x=>x[1]);
assert(new Set(ids).size===ids.length,'HTML contains duplicate static IDs');
assert(/lang=["']en["']/.test(html),'HTML needs English lang');
assert(/name=["']viewport["']/.test(html),'HTML needs mobile viewport');
assert(html.includes('knowledge.js'),'HTML must load generated canonical data');

const industry=json('data/industry.json');
assert(industry.asOf==='2026-10-26','Industry review date changed without updating check');
assert(industry.items.length>=16,'Industry catalog incomplete');unique(industry.items,'industry');
for(const item of industry.items){
  for(const key of ['id','name','category','relationship','status','summary','implication','verification'])assert(typeof item[key]==='string'&&item[key].length>0,`industry ${item.id}: missing ${key}`);
  assert(['primary-source checked','report only'].includes(item.verification),`industry ${item.id}: invalid verification`);
  assert(item.sources?.length>0,`industry ${item.id}: no sources`);
  for(const source of item.sources||[]) {
    assert(source.title&&source.url,`industry ${item.id}: invalid source`);
    if(!/^https:\/\//.test(source.url))checkLink(source.url,'data/industry.json');
  }
}
const questions=json('data/questions.json');unique(questions.questions,'questions');assert(questions.questions.length>=30,'Question bank incomplete');
for(const item of questions.questions){
  for(const key of ['id','category','prompt','why','answerFrame','followup'])assert(typeof item[key]==='string'&&item[key].length>0,`question ${item.id}: missing ${key}`);
  assert(questions.categories.includes(item.category),`question ${item.id}: unknown category`);
  assert(Array.isArray(item.evidenceNeeded)&&item.evidenceNeeded.length>0,`question ${item.id}: no evidence prompts`);
}
const milestones=json('data/milestones.json');unique(milestones.milestones,'milestones');
for(const item of milestones.milestones){
  assert(['planned','in-progress','blocked','complete'].includes(item.status),`milestone ${item.id}: invalid status`);
  for(const dependency of item.dependsOn)assert(milestones.milestones.some(x=>x.id===dependency),`milestone ${item.id}: missing dependency ${dependency}`);
  if(item.status==='complete')assert(item.evidence.length>0,`milestone ${item.id}: completed without evidence`);
}
const manifest=json('sources/manifest.json');
for(const file of manifest.files){
  const target=path.join(root,file.path);assert(fs.existsSync(target),`Missing archive ${file.path}`);
  if(fs.existsSync(target))assert(crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex')===file.sha256,`Source changed: ${file.path}`);
}
for(const rel of ['web/app.js','web/knowledge.js','scripts/serve.mjs','scripts/sync-data.mjs','scripts/check.mjs']){
  const result=spawnSync(process.execPath,['--check',path.join(root,rel)],{encoding:'utf8'});
  assert(result.status===0,`Syntax failed ${rel}: ${result.stderr}`);
}
const sync=spawnSync(process.execPath,[path.join(root,'scripts/sync-data.mjs'),'--check'],{encoding:'utf8'});
assert(sync.status===0,sync.stderr||'Generated data mismatch');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log(`PASS: ${linkCount} maintained local links, ${industry.items.length} industry entries, ${questions.questions.length} questions, ${milestones.milestones.length} milestones, ${manifest.files.length} source hashes, generated data and JS syntax.`);
console.log('Archived sources are immutable historical inputs; their original relative links are outside the maintained-link check. External URLs and scientific claims are not evaluated by this script.');

