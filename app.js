(() => {
  console.log("injected on to page");
  let youtubePlayer;
  let tabURL = null;
  let timeStampStringList = [];
  let isTranscribable = null;

  function newHandler(value, sendResponse) {
    if (tabURL === null) {
      tabURL = value;
      console.log(tabURL);

      const response = applyModifications();
      sendResponse({ res: response });
    } else {
      if (tabURL === value) {
        chrome.storage.local.set({ timeStamps: timeStampStringList });
        sendResponse({ res: isTranscribable });
      } else {
        tabURL = value;

        const response = applyModifications();
        sendResponse({ res: response });
      }
    }
  }

  chrome.runtime.onMessage.addListener((obj, sender, sendResponse) => {
    const { type, value } = obj;

    if (type === "NEW") {
      newHandler(value, sendResponse);
    }
    if (type === "PLAY") {
      youtubePlayer.currentTime = value;
      sendResponse({ message: "success" });
    }

    return true;
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
    chrome.storage.local.set({ timeStamps: [] });

    youtubePlayer = document.getElementsByClassName("video-stream")[0];

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
    } else {
      isTranscribable = false;
      return false;
    }
  }
})();
