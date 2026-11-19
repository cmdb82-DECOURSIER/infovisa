/* Apply appearance before first paint; only this explicit preference is stored. */
(function(){
 var root=document.documentElement,key='infovisa-theme',stored=null,explicit=false;
 try{stored=localStorage.getItem(key);}catch(e){}
 explicit=stored==='light'||stored==='dark';
 var media=window.matchMedia?window.matchMedia('(prefers-color-scheme: dark)'):null;
 var theme=explicit?stored:media&&media.matches?'dark':'light';
 var words={fr:['Clair','Sombre','Mode sombre','Passer au mode clair','Passer au mode sombre'],en:['Light','Dark','Dark mode','Switch to light mode','Switch to dark mode'],de:['Hell','Dunkel','Dunkler Modus','Zum hellen Modus wechseln','Zum dunklen Modus wechseln'],es:['Claro','Oscuro','Modo oscuro','Cambiar a modo claro','Cambiar a modo oscuro'],pt:['Claro','Escuro','Modo escuro','Mudar para o modo claro','Mudar para o modo escuro']};
 function apply(next,save){theme=next;root.dataset.theme=theme;if(save){explicit=true;try{localStorage.setItem(key,theme);}catch(e){}}var meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=theme==='light'?'#ffffff':'#080d12';var b=document.querySelector('[data-theme-toggle]'),w=words[root.lang]||words.fr;if(b){b.setAttribute('aria-checked',String(theme==='dark'));b.setAttribute('aria-label',w[2]);b.title=w[theme==='dark'?3:4];b.querySelector('[data-theme-label]').textContent=w[theme==='light'?0:1];b.querySelector('[data-theme-icon]').textContent=theme==='light'?'☀':'☾';}document.dispatchEvent(new CustomEvent('infovisa:theme-change',{detail:{theme:theme}}));}
 apply(theme,false);
 function bind(){apply(theme,false);var b=document.querySelector('[data-theme-toggle]');if(b)b.addEventListener('click',function(){apply(theme==='dark'?'light':'dark',true);});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
 if(media&&media.addEventListener)media.addEventListener('change',function(e){if(!explicit)apply(e.matches?'dark':'light',false);});
 window.addEventListener('storage',function(e){if(e.key!==key)return;if(e.newValue==='light'||e.newValue==='dark'){explicit=true;apply(e.newValue,false);}else if(e.newValue===null){explicit=false;apply(media&&media.matches?'dark':'light',false);}});
})();
