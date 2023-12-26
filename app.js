(() => {
  let youtubePlayer;
  let tabId = null;
  let timeStampStringList = [];
  let isTranscribable = null;

  function newHandler(value, sendResponse) {
    console.log("tabId: " + tabId);
    if (tabId === null) {
      tabId = value;
      console.log(tabId);

      const response = applyModifications();
      console.log("Response: " + response);
      sendResponse({ res: response });
    } else {
      console.log(
        "tabId: " + tabId + " timeStrampString: " + timeStampStringList
      );
      chrome.storage.local.set({ timeStamps: timeStampStringList });
      console.log("IsTrabscribible: " + isTranscribable);
      sendResponse({ res: isTranscribable });
    }
  }

  chrome.runtime.onMessage.addListener((obj, sender, sendResponse) => {
    console.log("Event listener executing");
    const { type, value } = obj;

    if (type === "NEW") {
      console.log("Type: " + type + " Value: " + value);
      newHandler(value, sendResponse);
    }
    if (type === "PLAY") {
      youtubePlayer.currentTime = value;
    }
    // if (type === "TEST") {
    //   console.log("TEST running swimmingly");
    //   sendResponse({ message: true });
    // }

    // return true;
  });

  function segmentHandler(segment_children) {
    let segmentString = "";
    for (let i = 0; i < segment_children.length; i++) {
      if (segment_children[i].getAttribute("hidden") === null) {
        const textContent = segment_children[i].childNodes[2].ariaLabel;
        segmentString += "::" + textContent.toLowerCase();
      }
    }
    timeStampStringList = segmentString.split("::");
    timeStampStringList.shift();

    chrome.storage.local.set({ timeStamps: timeStampStringList });
    // await chrome.storage.local.set({ isTranscribable: true });
  }

  function transcriptHandler(transcript_btn, panel) {
    transcript_btn.click();
    const panelObserverHandler = (mutations, observer) => {
      const segments_cont = document.querySelector("#segments-container");
      if (segments_cont) {
        const segment_children = segments_cont.childNodes;
        panel.style.display = "none";
        observer.disconnect();
        segmentHandler(segment_children);
      }
    };

    const panelObserver = new MutationObserver(panelObserverHandler);

    panelObserver.observe(panel, {
      childList: true,
      subtree: true,
    });
  }

  function applyModifications() {
    // if (!isVideoPage) {
    //   return;
    // }
    chrome.storage.local.set({ timeStamps: [] });

    // let numberObserved = 0;

    // const applyModificationsWhenReady = (mutation, observer) => {
    youtubePlayer = document.getElementsByClassName("video-stream")[0];
    // numberObserved += 1;

    const transcript_btn = document.querySelector(
      'button[aria-label="Show transcript"]'
    );

    if (transcript_btn) {
      const panel = document.querySelector(
        "div#panels.style-scope.ytd-watch-flexy"
      );
      panel.style.display = "flex";
      transcriptHandler(transcript_btn, panel);
      isTranscribable = true;
      return true;
      // observer.disconnect();
    } else {
      isTranscribable = false;
      return false;
      // isTranscribable = false;
      // await chrome.storage.local.set({ isTranscribable: isTranscribable });
    }

    // if (numberObserved >= 20) {
    //   console.log("Exceeded observation limit, disconnecting observer");
    //   observer.disconnect();
    // }
    // };

    // const observer = new MutationObserver(applyModificationsWhenReady);

    // observer.observe(document.body, {
    //   childList: true,
    //   subtree: true,
    // });
  }

  // window.addEventListener("DOMContentLoaded", () => {
  //   applyModifications(window.location.href.includes("youtube.com/watch"));
  // });
  // window.addEventListener("yt-page-data-updated", () => {
  //   applyModifications(window.location.href.includes("youtube.com/watch"));
  // });
})();
