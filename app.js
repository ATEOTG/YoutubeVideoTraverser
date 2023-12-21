// console.log("Content Script is running");
const ytd_app = document.querySelector("ytd-app");

function segmentHandler(segment_children) {
  //   browser console log has a limit but it contains everything
  for (let i = 0; i < segment_children.length; i++) {
    const textContent = segment_children[i].childNodes[2].ariaLabel;
    console.log(textContent);
  }
}

function transcriptHandler(transcript_btn) {
  transcript_btn.click();

  let segments_cont;

  setTimeout(() => {
    segments_cont = document.querySelector("#segments-container");
    if (segments_cont) {
      const segment_children = segments_cont.childNodes;
      document.querySelector("#panels").style.display = "none";
      segmentHandler(segment_children);
    } else {
      document.querySelector("#panels").style.display = "block";
      transcriptHandler(transcript_btn);
    }
  }, 1000);
}

function isYouTubeVideoPage() {
  return window.location.href.includes("youtube.com/watch?v=");
}

function applyModifications() {
  setTimeout(() => {
    const transcript_btn = document.querySelector(
      'button[aria-label="Show transcript"]'
    );

    const exists = transcript_btn;
    if (isYouTubeVideoPage() && exists) {
      ytd_app.style.border = "10px solid red";
      transcriptHandler(transcript_btn);
    } else {
      ytd_app.style.border = "none";
    }
  }, 1000);
}

// Listen for changes in the URL
window.addEventListener("DOMContentLoaded", applyModifications);
window.addEventListener("yt-page-data-updated", applyModifications);
