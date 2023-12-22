// import { segmentHandler } from "./app.js";

const searchForm = document.querySelector("#search-form");
const searchValue = document.querySelector("#search");
const resultList = document.querySelector(".search-list");

console.log("Excecuting popup.js");
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const activeTabId = tabs[0].id;

  // Load app.js into the current active tab
  chrome.scripting
    .executeScript({ target: { tabId: activeTabId }, files: ["app.js"] })
    .then(() => {
      console.log("Script injected");
    });
});

searchValue.addEventListener("keydown", (e) => {
  const inputSearch = e.target.value;
  searchValue.textContent = inputSearch;
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const search = searchValue.textContent.toLowerCase();
  console.log(search);
  chrome.runtime.sendMessage({ action: "executeScript", argument: search });
});
