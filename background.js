// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === "complete" && tab.url.includes("youtube.com")) {
//     const isYouTubeVideoPage = tab.url && tab.url.includes("youtube.com/watch");
//     chrome.tabs.sendMessage(tabId, {
//       type: "NEW",
//       isVideoPage: isYouTubeVideoPage,
//     });
//   }
// });

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});
