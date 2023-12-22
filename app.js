(() => {
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, isVideoPage } = obj;

    applyModifications(isVideoPage);
  });

  // function searchResultHandler(string) {
  //   const res = [];
  //   for (let i = 0; i < timeStampStringList.length; i++) {
  //     if (timeStampStringList[i].includes(string)) {
  //       res.push(timeStampStringList[i]);
  //     }
  //   }

  //   console.log(string);
  //   console.log(res);
  //   return res;
  // }

  function segmentHandler(segment_children) {
    let segmentString = "";
    //   browser console log has a limit but it contains everything
    for (let i = 0; i < segment_children.length; i++) {
      const textContent = segment_children[i].childNodes[2].ariaLabel;
      segmentString += "::" + textContent.toLowerCase();
    }
    const timeStampStringList = segmentString.split("::");

    chrome.storage.local.set({ timeStamps: timeStampStringList });
    // console.log(
    //   chrome.storage.local.get("timeStamps").then((res) => {
    //     console.log(res.timeStamps);
    //   })
    // );
  }

  function transcriptHandler(transcript_btn) {
    transcript_btn.click();

    let segments_cont;

    setTimeout(() => {
      segments_cont = document.querySelector("#segments-container");
      if (segments_cont) {
        const segment_children = segments_cont.childNodes;
        document.querySelector("#panels").style.display = "none";
        segmentHandler(segment_children);
      } else {
        document.querySelector("#panels").style.display = "block";
        transcriptHandler(transcript_btn);
      }
    }, 1000);
  }

  function applyModifications(isVideoPage) {
    const ytd_app = document.querySelector("ytd-app");
    setTimeout(() => {
      const transcript_btn = document.querySelector(
        'button[aria-label="Show transcript"]'
      );

      const exists = transcript_btn;
      if (isVideoPage && exists) {
        ytd_app.style.border = "10px solid red";
        transcriptHandler(transcript_btn);
      } else {
        ytd_app.style.border = "none";
      }
    }, 1000);
  }
})();

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "executeScript") {
//     chrome.scripting.executeScript({
//       target: { tabId: sender.tab.id },
//       function: searchResultHandler,
//       args: message.argument,
//     });
//   }
// });
