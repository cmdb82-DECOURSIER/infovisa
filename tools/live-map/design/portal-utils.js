export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function labels(rows){const lang=['fr','en','de','es','pt'].includes(document.documentElement.lang)?document.documentElement.lang:'fr',i=['fr','en','de','es','pt'].indexOf(lang);return {lang,t:key=>rows[key][i]};}
export async function json(url,signal){const r=await fetch(url,{signal});if(!r.ok)throw Error('service_unavailable');return r.json();}
export const date=(value,lang)=>new Intl.DateTimeFormat(lang,{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
