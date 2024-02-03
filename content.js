// Entry point for doing anything with the page content

let currentUrl = window.location.href
console.log("Current URL:", currentUrl)

// send message to the background script to check if the current site is a procrastination site
chrome.runtime.sendMessage({command: "checkSiteStatus", url: currentUrl}, function(response) {
    console.log("Response from background script:", response)
    if (response.isProcrastinationSite) {
        alert("You should be working!")
    }
})