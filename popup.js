const { timeStamp } = require("console");

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

function fetchTimeStamp() {
  return new Promise((res) => {
    chrome.storage.local.get("timeStamps", (obj) => {
      res(obj["timeStamps"] ? obj["timeStamps"] : []);
    });
  });
}

// function searchResultHandler(string) {
//   const res = [];
//   for (let i = 0; i < timeStampStringList.length; i++) {
//     if (timeStampStringList[i].includes(string)) {
//       res.push(timeStampStringList[i]);
//     }
//   }

//   console.log(string);
//   console.log(res);
//   return res;
// }

searchValue.addEventListener("keydown", (e) => {
  const inputSearch = e.target.value;
  searchValue.textContent = inputSearch;
});

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const search = searchValue.value.toLowerCase();

  const timeStamps = await fetchTimeStamp();
  console.log(timeStamps);
});
