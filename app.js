(() => {
  let youtubePlayer;

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, isVideoPage, value } = obj;

    if (type === "NEW") {
      applyModifications(isVideoPage);
    } else if (type === "PLAY") {
      youtubePlayer.currentTime = value;
    }
  });

  function segmentHandler(segment_children) {
    let segmentString = "";
    for (let i = 0; i < segment_children.length; i++) {
      const textContent = segment_children[i].childNodes[2].ariaLabel;
      segmentString += "::" + textContent.toLowerCase();
    }
    const timeStampStringList = segmentString.split("::");
    timeStampStringList.shift();

    chrome.storage.local.set({ timeStamps: timeStampStringList });
  }

  function transcriptHandler() {
    const panel = document.querySelector("#panels");
    panel.style.display = "block";

    let observations = 0;
    const panelObserverHandler = (mutations, observer) => {
      if (observations === 10) {
        panel.style.display = "block";
        observer.disconnect();
      }
      const segments_cont = document.querySelector("#segments-container");
      console.log("Segment_cont: " + segments_cont);
      if (segments_cont) {
        const segment_children = segments_cont.childNodes;
        panel.style.display = "none";
        observer.disconnect();
        segmentHandler(segment_children);
      }
      observations += 1;
    };

    const panelObserver = new MutationObserver(panelObserverHandler);

    panelObserver.observe(panel, {
      childList: true,
      subtree: true,
    });
  }

  function applyModifications(isVideoPage) {
    const ytd_app = document.querySelector("ytd-app[darker-dark-theme]");

    if (!isVideoPage) {
      ytd_app.style.border = "none";
      return;
    }
    chrome.storage.local.set({ timeStamps: [] });
    let numberObserved = 0;

    const applyModificationsWhenReady = (mutation, observer) => {
      youtubePlayer = document.getElementsByClassName("video-stream")[0];
      console.log("observer running....");
      numberObserved += 1;

      const transcript_btn = document.querySelector(
        'button[aria-label="Show transcript"]'
      );

      if (transcript_btn) {
        ytd_app.style.border = "10px solid red";
        console.log("Transcript Button Found");
        transcript_btn.click();
        observer.disconnect();
        transcriptHandler();
      }
      if (numberObserved >= 20) {
        console.log("Exceeded observation limit, disconnecting observer");
        ytd_app.style.border = "none";
        observer.disconnect();
      }
    };

    const observer = new MutationObserver(applyModificationsWhenReady);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    applyModifications(window.location.href.includes("youtube.com/watch"));
  });
  window.addEventListener("yt-page-data-updated", () => {
    applyModifications(window.location.href.includes("youtube.com/watch"));
  });
})();
