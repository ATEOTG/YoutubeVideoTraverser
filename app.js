(() => {
  let youtubePlayer;

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value } = obj;

    if (type === "PLAY") {
      youtubePlayer.currentTime = value;
    }
  });

  async function segmentHandler(segment_children) {
    let segmentString = "";
    for (let i = 0; i < segment_children.length; i++) {
      if (segment_children[i].getAttribute("hidden") === null) {
        console.log(segment_children[i]);
        const textContent = segment_children[i].childNodes[2].ariaLabel;
        segmentString += "::" + textContent.toLowerCase();
      }
    }
    const timeStampStringList = segmentString.split("::");
    timeStampStringList.shift();

    await chrome.storage.local.set({ timeStamps: timeStampStringList });
    await chrome.storage.local.set({ isTranscribable: true });
  }

  function transcriptHandler(transcript_btn, panel) {
    transcript_btn.click();
    const panelObserverHandler = (mutations, observer) => {
      const segments_cont = document.querySelector("#segments-container");
      if (segments_cont) {
        const segment_children = segments_cont.childNodes;
        console.log(segment_children);
        console.log(segment_children.length);
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

  async function applyModifications(isVideoPage) {
    if (!isVideoPage) {
      return;
    }
    await chrome.storage.local.set({ timeStamps: [] });
    await chrome.storage.local.set({ isTranscribable: false });

    let numberObserved = 0;

    const applyModificationsWhenReady = (mutation, observer) => {
      youtubePlayer = document.getElementsByClassName("video-stream")[0];
      numberObserved += 1;

      const transcript_btn = document.querySelector(
        'button[aria-label="Show transcript"]'
      );

      if (transcript_btn) {
        const panel = document.querySelector(
          "div#panels.style-scope.ytd-watch-flexy"
        );
        panel.style.display = "flex";
        transcriptHandler(transcript_btn, panel);
        observer.disconnect();
      }
      if (numberObserved >= 20) {
        console.log("Exceeded observation limit, disconnecting observer");
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
