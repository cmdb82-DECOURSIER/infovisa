import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {mountSatellite,SATELLITE_STREAMS} from '../design/satellite.js';
const tick=()=>new Promise(r=>setImmediate(r));
test('official satellite views respect consent and stop on view, module, visibility and consent changes',async()=>{
 const dom=new JSDOM('<html lang="fr"><body><section class="iv-extra"><section id="sat"></section></section></body></html>',{url:'https://infovisa.test/',pretendToBeVisual:true});
 for(const k of ['window','document','AbortController','MutationObserver'])globalThis[k]=dom.window[k];
 let renew=0;window.Cookiebot={consent:{marketing:false},renew(){renew++;}};
 const root=document.querySelector('#sat'),api=mountSatellite(root);
 try{
  assert.equal(root.querySelectorAll('[data-sat-region]').length,5);assert.equal(root.querySelector('iframe'),null);api.setVisible(true);assert.match(root.querySelector('[data-sat-status]').textContent,/cookies médias/);assert.equal(root.querySelector('iframe'),null);root.querySelector('[data-sat-consent]').click();assert.equal(renew,1);
  window.Cookiebot.consent.marketing=true;window.dispatchEvent(new window.Event('CookiebotOnAccept'));let frame=root.querySelector('iframe');assert.ok(frame);assert.equal(new URL(frame.src).hostname,'www.youtube-nocookie.com');assert.equal(frame.referrerPolicy,'strict-origin-when-cross-origin');assert.equal(new URL(frame.src).searchParams.get('origin'),'https://infovisa.test');
  for(const s of SATELLITE_STREAMS){root.querySelector(`[data-sat-region="${s.key}"]`).click();assert.equal(root.querySelectorAll('iframe').length,1);assert.equal(new URL(root.querySelector('iframe').src).pathname,'/embed/'+s.video);assert.equal(root.querySelector('[data-sat-external]').href,'https://www.youtube.com/watch?v='+s.video);}
  assert.match(root.querySelector('[data-sat-timing]').textContent,/pas observées simultanément/);assert.match(root.querySelector('.wx-sat-stamp').textContent,/horodatage UTC/);
  api.setVisible(false);assert.equal(root.querySelector('iframe'),null);window.dispatchEvent(new window.Event('CookiebotOnAccept'));assert.equal(root.querySelector('iframe'),null);api.setVisible(true);assert.ok(root.querySelector('iframe'));document.querySelector('.iv-extra').hidden=true;await tick();assert.equal(root.querySelector('iframe'),null);document.querySelector('.iv-extra').hidden=false;
  root.querySelector('[data-sat-play]').click();assert.ok(root.querySelector('iframe'));window.Cookiebot.consent.marketing=false;window.dispatchEvent(new window.Event('CookiebotOnDecline'));assert.equal(root.querySelector('iframe'),null);
  api.setVisible(true);api.setVisible(false);window.Cookiebot.consent.marketing=true;window.dispatchEvent(new window.Event('CookiebotOnAccept'));assert.equal(root.querySelector('iframe'),null,'Late consent must not open a hidden view');
  api.setVisible(true);assert.ok(root.querySelector('iframe'));Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new window.Event('visibilitychange'));assert.equal(root.querySelector('iframe'),null);
 }finally{api.destroy();dom.window.close();}
});
test('satellite headings and instructions cover the five live page languages',()=>{for(const lang of ['fr','en','de','es','pt']){const dom=new JSDOM(`<html lang="${lang}"><body><div><section id="sat"></section></div></body></html>`,{url:'https://infovisa.test/',pretendToBeVisual:true});for(const k of ['window','document','AbortController','MutationObserver'])globalThis[k]=dom.window[k];const root=document.querySelector('#sat'),api=mountSatellite(root);assert.ok(root.querySelector('h3').textContent.length>10);assert.doesNotMatch(root.textContent,/undefined/);api.destroy();dom.window.close();}});
