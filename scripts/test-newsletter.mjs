import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const dir=await mkdtemp(join(tmpdir(),'bpm-newsletter-'));
const originalFetch=globalThis.fetch;
try {
  for(const [entry,name] of [['src/lib/newsletter-client.ts','client'],['functions/api/newsletter.ts','proxy']]) await build({entryPoints:[entry],outfile:join(dir,name+'.mjs'),bundle:true,platform:'node',format:'esm'});
  const {subscribeNewsletter,hasNewsletterSubscription}=await import(pathToFileURL(join(dir,'client.mjs')));
  const {onRequestPost}=await import(pathToFileURL(join(dir,'proxy.mjs')));
  globalThis.localStorage={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};
  assert.equal(hasNewsletterSubscription(),false);
  globalThis.fetch=async()=>Response.json({success:true});
  await subscribeNewsletter('test@example.invalid');
  globalThis.fetch=async()=>Response.json({});
  await assert.rejects(subscribeNewsletter('test@example.invalid'),/confirmée/);
  globalThis.fetch=async()=>{throw new TypeError('Failed to fetch');};
  await assert.rejects(subscribeNewsletter('test@example.invalid'),/Impossible de joindre/);
  const request=()=>new Request('https://test.invalid/api/newsletter',{method:'POST',body:'{}'});
  assert.equal((await onRequestPost({request:request()})).status,503);
  globalThis.fetch=async()=>Response.json({already:true});
  assert.equal((await (await onRequestPost({request:request()})).json()).success,true);
  globalThis.fetch=async()=>Response.json({error:'Unavailable'},{status:503});
  assert.equal((await onRequestPost({request:request()})).status,503);
  console.log('Newsletter tests passed: blocked storage, explicit success, network errors, duplicate and proxy failure. No real signup or email.');
}finally{globalThis.fetch=originalFetch;delete globalThis.localStorage;await rm(dir,{recursive:true,force:true});}
