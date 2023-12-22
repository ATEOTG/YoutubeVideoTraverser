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
