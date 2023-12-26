import { convertTimeFormatToSeconds, separateTime } from "./utils.js";

const searchForm = document.querySelector("#search-form");
const searchValue = document.querySelector("#search");
const resultList = document.querySelector(".search-list");
const notOnPage = document.querySelector(".not-on-page-cont");
const onPage = document.querySelector(".on-page-cont");
const cannotTranscribe = document.querySelector(".no-transcription");
const noResults = document.querySelector("#no-results-text");

async function fetchTimeStamp() {
  return new Promise((res) => {
    chrome.storage.local.get("timeStamps", (obj) => {
      res(obj["timeStamps"] ? obj["timeStamps"] : []);
    });
  });
}

// function fetchIsTranscribable() {
//   return new Promise((res) => {
//     chrome.storage.local.get("isTranscribable", (obj) => {
//       res(obj["isTranscribable"] ? obj["isTranscribable"] : false);
//     });
//   });
// }

function searchResultHandler(string, timeStamps) {
  const res = [];
  for (let i = 0; i < timeStamps.length; i++) {
    if (timeStamps[i][1].includes(string)) {
      res.push(timeStamps[i]);
    }
  }

  return res;
}

function onPlay(e) {
  let target = e.target;
  while (target.tagName !== "LI") {
    target = target.parentNode;
  }
  const itemTimeStamp = target.getAttribute("data-timestamp");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      type: "PLAY",
      value: itemTimeStamp,
    });
  });
}

function addItemToList(textArr) {
  const listItem = document.createElement("li");

  const spanElement = document.createElement("span");
  spanElement.textContent = textArr[0];

  listItem.appendChild(spanElement);
  listItem.appendChild(document.createTextNode(textArr[1]));

  listItem.setAttribute(
    "data-timestamp",
    convertTimeFormatToSeconds(textArr[0][0])
  );

  listItem.classList.add("search-list-item");

  listItem.addEventListener("click", onPlay);
  resultList.appendChild(listItem);
}

searchValue.addEventListener("keydown", (e) => {
  const inputSearch = e.target.value;
  searchValue.textContent = inputSearch;
});

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const search = searchValue.value.toLowerCase();
  if (search.trim() === "") return;
  const timeStamps = await fetchTimeStamp();
  const timeStampArray = separateTime(timeStamps);
  const results = searchResultHandler(search, timeStampArray);

  resultList.innerHTML = "";
  searchValue.value = "";
  noResults.style.display = results.length === 0 ? "block" : "none";
  for (const timeStamp of results) {
    if (timeStamp[0] === null) continue;
    addItemToList(timeStamp);
  }
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const activeTab = tabs[0];
  console.log(activeTab);
  let isTranscribable;
  if (activeTab.url.includes("youtube.com/watch")) {
    chrome.tabs.sendMessage(
      activeTab.id,
      { type: "NEW", value: activeTab.url },
      (response) => {
        console.log("Message below");
        console.log(response);
        isTranscribable = response.res;

        console.log("IsTrabscribable: " + isTranscribable);
        notOnPage.style.display = "none";
        onPage.style.display = "block";
        if (isTranscribable) {
          cannotTranscribe.style.display = "none";
          onPage.style.display = "block";
        } else {
          cannotTranscribe.style.display = "block";
          onPage.style.display = "none";
        }
      }
    );
  } else {
    onPage.style.display = "none";
    notOnPage.style.display = "block";
  }
});
// document.addEventListener("DOMContentLoaded", () => {

// });
