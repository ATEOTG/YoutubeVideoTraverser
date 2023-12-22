const searchForm = document.querySelector("#search-form");
const searchValue = document.querySelector("#search");
const resultList = document.querySelector(".search-list");

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
    if (timeStamps[i].includes(string)) {
      res.push(timeStamps[i]);
    }
  }

  return res;
}

function addItemToList(text) {
  const listItem = document.createElement("li");
  listItem.textContent = text;
  listItem.classList.add("search-list-item");
  resultList.appendChild(listItem);
}

searchValue.addEventListener("keydown", (e) => {
  const inputSearch = e.target.value;
  searchValue.textContent = inputSearch;
});

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const search = searchValue.value.toLowerCase();

  const timeStamps = await fetchTimeStamp();
  const results = searchResultHandler(search, timeStamps);

  resultList.innerHTML = "";
  for (const timeStamp of results) {
    addItemToList(timeStamp);
  }
});
