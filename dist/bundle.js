(()=>{let e;chrome.runtime.onMessage.addListener(((t,o,n)=>{const{type:r,isVideoPage:c,value:s}=t;"NEW"===r?function(t){setTimeout((()=>{e=document.getElementsByClassName("video-stream")[0];const o=document.querySelector("ytd-app[darker-dark-theme]");if(!t)return void(o.style.border="none");let n,r=0,c=!1;const s=document.querySelector("div#description"),l=()=>{clearTimeout(n),r+=1,c||(document.querySelector('button[aria-label="Show transcript"]')?(o.style.border="10px solid red",console.log("Transcript Button Found"),i.disconnect(),c=!0,function(){document.querySelector('button[aria-label="Show transcript"]').click();const e=setInterval((()=>{console.log("Interval Running...");const t=document.querySelector("#segments-container");if(console.log("Segment_cont: "+t),t){const o=t.childNodes;document.querySelector("#panels").style.display="none",function(e){let t="";for(let o=0;o<e.length;o++)t+="::"+e[o].childNodes[2].ariaLabel.toLowerCase();const o=t.split("::");o.shift(),chrome.storage.local.set({timeStamps:o})}(o),clearInterval(e)}}),1e3)}()):r>=20?(console.log("Exceeded observation limit, disconnecting observer"),i.disconnect(),c=!0,o.style.border="none"):(console.log("Transcript button not found yet"),n=setTimeout(l,1e3)))},i=new MutationObserver((()=>{n=setTimeout(l,1e3)}));i.observe(s,{childList:!0,subtree:!0}),i.disconnect=()=>{c=!0,clearTimeout(n),MutationObserver.prototype.disconnect.call(i)}}),1e3)}(c):"PLAY"===r&&(e.currentTime=s)}))})();