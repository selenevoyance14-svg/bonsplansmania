import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const dir = await mkdtemp(join(tmpdir(), 'bpm-alerts-'));
const originalFetch = globalThis.fetch;
try {
  for (const [entry, name] of [['workers/alerts/src/index.ts','worker'],['functions/api/alerts.ts','proxy']]) {
    await build({ entryPoints:[entry], outfile:join(dir, name+'.mjs'), bundle:true, platform:'node', format:'esm' });
  }
  const worker = (await import(pathToFileURL(join(dir,'worker.mjs')))).default;
  const { onRequestPost } = await import(pathToFileURL(join(dir,'proxy.mjs')));
  function env() {
    const store = new Map();
    return { store, RESEND_API_KEY:'mock', FROM_EMAIL:'test@example.invalid', FROM_NAME:'Test', ALERTS: {
      get:async (k,type) => store.has(k) ? (type==='json'?JSON.parse(store.get(k)):store.get(k)):null,
      put:async (k,v) => {store.set(k,v);}, delete:async k => {store.delete(k);},
      list:async ({prefix}) => ({keys:[...store.keys()].filter(k=>k.startsWith(prefix)).map(name=>({name})),list_complete:true}),
    }};
  }
  const request = () => new Request('https://test.invalid/alerts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'test@example.invalid',query:'couches pampers',kind:'product',frequency:'instant'})});
  let e=env();globalThis.fetch=async()=>Response.json({error:'rejected'},{status:403});
  let response=await worker.fetch(request(),e);
  assert.equal(response.status,503);assert.equal(response.headers.get('Access-Control-Allow-Origin'),'*');
  assert.equal([...e.store.keys()].filter(k=>k.startsWith('alert:')).length,0);
  e=env();globalThis.fetch=async()=>Response.json({id:'mock-email'});
  response=await worker.fetch(request(),e);assert.equal((await response.json()).ok,true);
  const key=[...e.store.keys()].find(k=>k.startsWith('alert:'));const pending=e.store.get(key);
  globalThis.fetch=async()=>{throw new Error('Network failure');};
  response=await worker.fetch(request(),e);assert.equal(response.status,503);assert.equal(e.store.get(key),pending);
  const confirmed={...JSON.parse(pending),confirmedAt:new Date().toISOString()};e.store.set(key,JSON.stringify(confirmed));
  response=await worker.fetch(request(),e);assert.equal((await response.json()).alreadyExists,true);
  globalThis.fetch=async()=>new Response('upstream error',{status:500});
  response=await onRequestPost({request:request()});assert.equal(response.status,503);
  globalThis.fetch=async()=>Response.json({error:'Too many requests'},{status:429});
  response=await onRequestPost({request:request()});assert.equal(response.status,429);
  globalThis.fetch=async()=>Response.json({ok:true,alreadyExists:true});
  response=await onRequestPost({request:request()});assert.equal((await response.json()).alreadyExists,true);
  e=env();e.SITE_URL='https://site.invalid';e.store.set('state:seen-urls','[]');
  let monitoringCalls=0;
  globalThis.fetch=async(url)=>{if(String(url).endsWith('/monitoring-catalog.json')) monitoringCalls++;return Response.json([]);};
  for(let quarter=0;quarter<96;quarter++) await worker.scheduled({scheduledTime:Date.UTC(2026,9,28,0,quarter*15)},e);
  assert.equal(monitoringCalls,4);
  console.log('Alert tests passed: email failure, CORS, rollback, duplicate, proxy errors and success. No real email sent.');
} finally {globalThis.fetch=originalFetch;await rm(dir,{recursive:true,force:true});}
