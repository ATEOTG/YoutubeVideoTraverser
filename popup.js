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

function separateTime(textArray) {
  const separatedData = textArray.map((text) => {
    const timeRegex =
      /^(\d+)\s*hour(?:s)?(?:,\s*(\d+)\s*minute(?:s)?)?(?:,\s*(\d+)\s*second(?:s)?)?|^\d+\s*minute(?:s)?(?:,\s*(\d+)\s*second(?:s)?)?|^\d+\s*second(?:s)?/g;
    const matches = text.match(timeRegex);

    return [matches, text.replace(timeRegex, "").trim()];
  });

  return separatedData;
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

function addItemToList(textArr) {
  const listItem = document.createElement("li");

  const spanElement = document.createElement("span");
  spanElement.textContent = textArr[0];

  listItem.appendChild(spanElement);
  listItem.appendChild(document.createTextNode(textArr[1]));

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
