import {
  getActiveTabURL,
  convertTimeFormatToSeconds,
  separateTime,
} from "./utils.js";

const searchForm = document.querySelector("#search-form");
const searchValue = document.querySelector("#search");
const resultList = document.querySelector(".search-list");
const notOnPage = document.querySelector(".not-on-page-cont");
const onPage = document.querySelector(".on-page-cont");

function fetchTimeStamp() {
  return new Promise((res) => {
    chrome.storage.local.get("timeStamps", (obj) => {
      res(obj["timeStamps"] ? obj["timeStamps"] : []);
    });
  });
}

function searchResultHandler(string, timeStamps) {
  const res = [];
  for (let i = 0; i < timeStamps.length; i++) {
    if (timeStamps[i][1].includes(string)) {
      res.push(timeStamps[i]);
    }
  }

  return res;
}

async function onPlay(e) {
  const itemTimeStamp = e.target.getAttribute("data-timestamp");
  const activeTab = await getActiveTabURL();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: itemTimeStamp,
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
  for (const timeStamp of results) {
    if (timeStamp[0] === null) continue;
    addItemToList(timeStamp);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  if (activeTab.url.includes("youtube.com/watch")) {
    notOnPage.style.display = "none";
    onPage.style.display = "block";
  } else {
    onPage.style.display = "none";
    notOnPage.style.display = "block";
  }
});
