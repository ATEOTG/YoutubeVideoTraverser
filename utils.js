export async function getActiveTabURL() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export function separateTime(textArray) {
  const separatedData = textArray.map((text) => {
    const timeRegex =
      /^(\d+)\s*hour(?:s)?(?:,\s*(\d+)\s*minute(?:s)?)?(?:,\s*(\d+)\s*second(?:s)?)?|^\d+\s*minute(?:s)?(?:,\s*(\d+)\s*second(?:s)?)?|^\d+\s*second(?:s)?/g;
    const matches = text.match(timeRegex);

    return [matches, text.replace(timeRegex, "").trim()];
  });

  return separatedData;
}

export function convertTimeFormatToSeconds(timeString) {
  const unitValueArray = timeString.split(",");
  let seconds = 0;
  if (unitValueArray.length === 1) {
    seconds = Number(unitValueArray[0].match(/(\d+)/)[0]);
    return seconds;
  }
  if (unitValueArray.length === 2) {
    for (let i = 0; i < unitValueArray.length; i++) {
      const str = unitValueArray[i];
      if (i == 0) {
        seconds += Number(str.match(/(\d+)/)[0]) * 60;
      }
      if (i === 1) {
        seconds += Number(str.match(/(\d+)/)[0]);
      }
    }
    return seconds;
  }
  if (unitValueArray.length === 3) {
    for (let i = 0; i < unitValueArray.length; i++) {
      const str = unitValueArray[i];
      if (i == 0) {
        seconds += Number(str.match(/(\d+)/)[0]) * 3600;
      }
      if (i === 1) {
        seconds += Number(str.match(/(\d+)/)[0]) * 60;
      }
      if (i === 2) {
        seconds += Number(str.match(/(\d+)/)[0]);
      }
    }
    return seconds;
  }
}
