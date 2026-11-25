// Real hrefs remain useful without JavaScript; the descriptions are server-rendered.
export function initPortalLinks(){
 const buttons={world:'[data-v="world"]',markets:'[data-market-view="crypto"]',stocks:'[data-market-view="stocks"]'};
 for(const name of ['local','weather','marine','webcams','traffic','media','health','uap'])buttons[name]='[data-extra="'+name+'"]';
 function open(route){const button=document.querySelector(buttons[route]||':not(*)');if(!button)return;button.click();history.replaceState(null,'','#'+route);}
 document.addEventListener('click',e=>{const link=e.target.closest('a[data-live-route]');if(!link||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button>0)return;e.preventDefault();const route=link.dataset.liveRoute;if(!buttons[route])return;history.pushState(null,'','#'+route);open(route);});
 window.addEventListener('hashchange',()=>{const route=location.hash.slice(1);if(buttons[route])open(route);else if(!route)document.querySelector(buttons.world)?.click();});
 const initial=location.hash.slice(1);if(buttons[initial])open(initial);
}
