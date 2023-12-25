# Youtube Video Transript Search
This chrome browser extension allows you to search for keywords in a video (as long as it has a transcript available) and get timestamps and text that contain that keyword! It allows you to then navigate the video based on the relevant keywords you entered.
No longer are the days of skimming for minutes on a 4 hour podcast to see a topic you're interested in being discussed. 

## Screenshot
![SR](https://github.com/ATEOTG/YoutubeVideoTraverser/assets/25332391/fa240a40-2d9f-4e71-8451-7c0c1de8d5ea)

## What I learned
I learned a lot, especially since this was my first ever browser extension project!
- Building a browser extension is a whole new experience. Traditionally when you build sites you make and define every element, you know the structure of your application. Because browser extensions build on top of a site, you have to learn how the application is structured and the custom elements defined in the site. This Provided an interesting challenge when developing this extension.
  - I encountered a bug where when I attempted to grab an element with the id "panels" but there was an issue where sometimes I would grab the element and do the appropriate operations and sometimes it did not work. After looking at the HTML of the site and a few console logs, I became aware that there were two elements with the same id! This is usually something you do not see and I was unaware of this due to the fact that I did not structure the application.
  - I encountered another bug where I wanted the app.js script to listen after a url has been changed, and if it's a youtube video url, run a particular function. Usually you would use the popstate event listener to listen to active history changes. This wasn't working because of how Youtube navigation works and instead I had to rely on Youtube's own event for video navigation and found that if you listen to the "yt-page-data-updated" event, it will always detect when you navigate to a different url within the Youtube site. 
