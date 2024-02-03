let procrastinationSiteList = ["www.facebook.com", "www.youtube.com", "www.instagram.com", "www.twitter.com"]

function isSiteProcrastinationSite(url) {
  return procrastinationSiteList.includes(url)
}

console.log(procrastinationSiteList)

// In background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command == "checkSiteStatus") {
        let url = new URL(request.url)

        console.log(url)
        let isProcrastinationSite = isSiteProcrastinationSite(url.hostname)
        sendResponse({isProcrastinationSite})
    }
})