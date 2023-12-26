export function separateTime(textArray) {
  const separatedData = textArray.map((text) => {
    const timeRegex =
      /^(\d+)\s*hour(?:s)?(?:,\s*(\d+)\s*minute(?:s)?)?(?:,\s*(\d+)\s*second(?:s)?)?|^\d+\s*minute(?:s)?(?:,\s*(\d+)\s*second(?:s)?)?|^\d+\s*second(?:s)?/g;
    const matches = text.match(timeRegex);

    return [matches, text.replace(timeRegex, "").trim()];
  });

  return separatedData;
}

function unitEvaluator(unitValueArray) {
  let seconds = 0;
  for (let i = 0; i < unitValueArray.length; i++) {
    const str = unitValueArray[i];
    if (str.includes("second")) {
      seconds += Number(str.match(/(\d+)/)[0]);
    } else if (str.includes("minute")) {
      seconds += Number(str.match(/(\d+)/)[0]) * 60;
    } else {
      seconds += Number(str.match(/(\d+)/)[0]) * 3600;
    }
  }
  return seconds;
}

export function convertTimeFormatToSeconds(timeString) {
  const unitValueArray = timeString.split(",");
  if (unitValueArray.length === 1) {
    return unitEvaluator(unitValueArray);
  }
  if (unitValueArray.length === 2) {
    return unitEvaluator(unitValueArray);
  }
  if (unitValueArray.length === 3) {
    return unitEvaluator(unitValueArray);
  }
}
