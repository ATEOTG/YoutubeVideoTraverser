(() => {
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, isVideoPage } = obj;

    applyModifications(isVideoPage);
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
    const transcript_btn = document.querySelector(
      'button[aria-label="Show transcript"]'
    );
    transcript_btn.click();

    const checkInterval = setInterval(() => {
      const segments_cont = document.querySelector("#segments-container");
      if (segments_cont) {
        const segment_children = segments_cont.childNodes;
        document.querySelector("#panels").style.display = "none";
        segmentHandler(segment_children);
        clearInterval(checkInterval);
      }
    }, 1000);
  }

  function applyModifications(isVideoPage) {
    setTimeout(() => {
      const ytd_app = document.querySelector("ytd-app[darker-dark-theme]");

      console.log("Apply modifications running...");
      if (!isVideoPage) {
        ytd_app.style.border = "none";
        return;
      }

      let debounceTimer;
      let numberObserved = 0;
      let isObserverDisconnected = false;

      const description_cont = document.querySelector("div#description");

      const applyModificationsWhenReady = () => {
        clearTimeout(debounceTimer);
        numberObserved += 1;

        if (isObserverDisconnected) {
          return;
        }

        const transcript_btn = document.querySelector(
          'button[aria-label="Show transcript"]'
        );

        if (transcript_btn) {
          ytd_app.style.border = "10px solid red";
          console.log("Transcript Button Found");
          observer.disconnect();
          isObserverDisconnected = true;
          transcriptHandler();
        } else if (numberObserved >= 20) {
          console.log("Exceeded observation limit, disconnecting observer");
          observer.disconnect();
          isObserverDisconnected = true;
          ytd_app.style.border = "none";
        } else {
          console.log("Transcript button not found yet");
          debounceTimer = setTimeout(applyModificationsWhenReady, 1000);
        }
      };

      const observer = new MutationObserver(() => {
        debounceTimer = setTimeout(applyModificationsWhenReady, 1000);
      });

      observer.observe(description_cont, {
        childList: true,
        subtree: true,
      });

      observer.disconnect = () => {
        isObserverDisconnected = true;
        clearTimeout(debounceTimer);
        MutationObserver.prototype.disconnect.call(observer);
      };
    }, 1000);
  }
})();
