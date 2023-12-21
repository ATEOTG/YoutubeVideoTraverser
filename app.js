// console.log("Content Script is running");
const ytd_app = document.querySelector("ytd-app");

function isYouTubeVideoPage() {
  return window.location.href.includes("youtube.com/watch?v=");
}

function applyModifications() {
  setTimeout(() => {
    // const title = document.querySelector(
    //   "yt-formatted-string.style-scope.ytd-watch-metadata"
    // );
    const transcript_btn = document.querySelector(
      'button[aria-label="Show transcript"]'
    );

    const exists = transcript_btn;
    if (isYouTubeVideoPage() && exists) {
      ytd_app.style.border = "10px solid red";
      transcript_btn.click();
    } else {
      ytd_app.style.border = "none";
    }
  }, 500);
}

// applyModifications();

// Listen for changes in the URL
window.addEventListener("DOMContentLoaded", applyModifications);
window.addEventListener("yt-page-data-updated", applyModifications);
