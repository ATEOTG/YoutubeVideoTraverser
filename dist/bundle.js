(()=>{let e;function t(t){const o=document.querySelector("ytd-app[darker-dark-theme]");if(!t)return void(o.style.border="none");chrome.storage.local.set({timeStamps:[]});let n=0;new MutationObserver(((t,s)=>{e=document.getElementsByClassName("video-stream")[0],console.log("observer running...."),n+=1;const c=document.querySelector('button[aria-label="Show transcript"]');c&&(o.style.border="10px solid red",console.log("Transcript Button Found"),c.click(),s.disconnect(),function(){const e=document.querySelector("#panels");e.style.display="block";let t=0;new MutationObserver(((o,n)=>{10===t&&(e.style.display="block",n.disconnect());const s=document.querySelector("#segments-container");if(console.log("Segment_cont: "+s),s){const t=s.childNodes;e.style.display="none",n.disconnect(),function(e){let t="";for(let o=0;o<e.length;o++)t+="::"+e[o].childNodes[2].ariaLabel.toLowerCase();const o=t.split("::");o.shift(),chrome.storage.local.set({timeStamps:o})}(t)}t+=1})).observe(e,{childList:!0,subtree:!0})}()),n>=20&&(console.log("Exceeded observation limit, disconnecting observer"),o.style.border="none",s.disconnect())})).observe(document.body,{childList:!0,subtree:!0})}chrome.runtime.onMessage.addListener(((o,n,s)=>{const{type:c,isVideoPage:r,value:i}=o;"NEW"===c?t(r):"PLAY"===c&&(e.currentTime=i)})),window.addEventListener("DOMContentLoaded",(()=>{t(window.location.href.includes("youtube.com/watch"))})),window.addEventListener("yt-page-data-updated",(()=>{t(window.location.href.includes("youtube.com/watch"))}))})();