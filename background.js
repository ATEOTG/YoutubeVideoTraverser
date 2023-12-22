chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url.includes("youtube.com")) {
    const isYouTubeVideoPage = tab.url && tab.url.includes("youtube.com/watch");
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      isVideoPage: isYouTubeVideoPage,
    });
  }
});

// chrome.runtime.onInstalled.addListener(() => {
//   console.log("Extension Installed");
// });

// // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// //   if (message.action === "executeScript") {
// //     chrome.scripting.executeScript({
// //       target: { tabId: sender.tab.id },
// //       func: searchResultHandler,
// //       args: message.argument,
// //     });
// //   }
// // });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "executeScript") {
//     chrome.tabs.getCurrent((currentTab) => {
//       console.log("Current tab:", currentTab);
//       // Check if the currentTab is defined
//       if (currentTab) {
//         const activeTabId = currentTab.id;

//         chrome.scripting.executeScript({
//           target: { tabId: activeTabId },
//           function: searchResultHandler,
//           args: [message.argument],
//         });
//       } else {
//         console.error("No active tab found.");
//       }
//     });
//   }
// });
