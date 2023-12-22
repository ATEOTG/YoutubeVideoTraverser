const searchForm = document.querySelector("#search-form");
const searchValue = document.querySelector("#search");
const resultList = document.querySelector(".search-list");

console.log("Excecuting popup.js");
// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//   const activeTabId = tabs[0].id;

//   chrome.scripting.executeScript({
//     target: { tabId: activeTabId },
//     function: (search) => {
//       // This function is executed in the context of the content script
//       window.dispatchEvent(new CustomEvent("searchEvent", { detail: search }));
//     },
//     args: [searchValue.value.toLowerCase()], // Use value instead of textContent
//   });
// });

searchValue.addEventListener("keydown", (e) => {
  const inputSearch = e.target.value;
  searchValue.textContent = inputSearch;
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const search = searchValue.value.toLowerCase();

  chrome.runtime.sendMessage({ action: "executeScript", argument: search });
});
