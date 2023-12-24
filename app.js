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
    setTimeout(() => {
      console.log("Transcript Handler running...");

      let observations = 0;
      const checkInterval = setInterval(() => {
        if (observations === 5) clearInterval(checkInterval);
        console.log("Interval Running...");
        const segments_cont = document.querySelector("#segments-container");
        console.log("Segment_cont: " + segments_cont);
        if (segments_cont) {
          const segment_children = segments_cont.childNodes;
          document.querySelector("#panels").style.display = "none";
          segmentHandler(segment_children);
          clearInterval(checkInterval);
        } else {
          document.querySelector("#panels").style.display = "block";
        }
        observations += 1;
      }, 1000);
    }, 1000);
  }

  function applyModifications(isVideoPage) {
    console.log("executed!!!");
    const ytd_app = document.querySelector("ytd-app[darker-dark-theme]");

    if (!isVideoPage) {
      ytd_app.style.border = "none";
      return;
    }

    let numberObserved = 0;

    // const description_cont = document.querySelector("div#description");

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
      if (numberObserved >= 100) {
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
