chrome.runtime.onMessage.addListener(((e,t,o)=>{const{type:n,isVideoPage:r}=e;!function(e){setTimeout((()=>{const t=document.querySelector("ytd-app[darker-dark-theme]");if(console.log("Apply modifications running..."),!e)return void(t.style.border="none");let o,n=0,r=!1;const c=document.querySelector("div#description"),s=()=>{clearTimeout(o),n+=1,r||(document.querySelector('button[aria-label="Show transcript"]')?(t.style.border="10px solid red",console.log("Transcript Button Found"),i.disconnect(),r=!0,function(){document.querySelector('button[aria-label="Show transcript"]').click();const e=setInterval((()=>{const t=document.querySelector("#segments-container");if(t){const o=t.childNodes;document.querySelector("#panels").style.display="none",function(e){let t="";for(let o=0;o<e.length;o++)t+="::"+e[o].childNodes[2].ariaLabel.toLowerCase();const o=t.split("::");o.shift(),chrome.storage.local.set({timeStamps:o})}(o),clearInterval(e)}}),1e3)}()):n>=20?(console.log("Exceeded observation limit, disconnecting observer"),i.disconnect(),r=!0,t.style.border="none"):(console.log("Transcript button not found yet"),o=setTimeout(s,1e3)))},i=new MutationObserver((()=>{o=setTimeout(s,1e3)}));i.observe(c,{childList:!0,subtree:!0}),i.disconnect=()=>{r=!0,clearTimeout(o),MutationObserver.prototype.disconnect.call(i)}}),1e3)}(r)}));