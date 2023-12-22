// import { searchResultHandler } from "./app.js";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "executeScript") {
//     chrome.scripting.executeScript({
//       target: { tabId: sender.tab.id },
//       func: searchResultHandler,
//       args: message.argument,
//     });
//   }
// });
let timeStampStringList = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "executeScript") {
    chrome.tabs.getCurrent((currentTab) => {
      console.log("Current tab:", currentTab);
      // Check if the currentTab is defined
      if (currentTab) {
        const activeTabId = currentTab.id;

        chrome.scripting.executeScript({
          target: { tabId: activeTabId },
          function: searchResultHandler,
          args: [message.argument],
        });
      } else {
        console.error("No active tab found.");
      }
    });
  }
});

function searchResultHandler(string) {
  const res = [];
  for (let i = 0; i < timeStampStringList.length; i++) {
    if (timeStampStringList[i].includes(string)) {
      res.push(timeStampStringList[i]);
    }
  }

  console.log(string);
  console.log(res);
  return res;
}
