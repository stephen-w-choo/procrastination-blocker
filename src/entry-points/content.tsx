// Entry point for doing anything with the page content

import React from "react"
import { createRoot } from "react-dom/client"
import { TopBar } from "../view/TopBar"
import {
	BackgroundRequest,
	BackgroundResponse,
	TrainingRequest,
} from "../domain/models/MessageTypes"
import { Category } from "../data/models/SiteData"
import { ChakraProvider } from "@chakra-ui/react"

const THRESHOLD = 0.7

let currentUrl = window.location.href
console.log("Current URL:", currentUrl)

// Gets the current site data
const serialisedSiteData = JSON.stringify({
	title: document.title,
	domain: currentUrl,
})

// Sends message to check the siteStatus on startup
chrome.runtime.sendMessage<BackgroundRequest, BackgroundResponse>(
	{ command: "checkSiteStatus", serialisedSiteData },
	(response: BackgroundResponse) => {
		console.log("Response from background script:", response)
		if (
			response.isProcrastinationSite != undefined &&
			response.isProcrastinationSite > THRESHOLD
		) {
			alert("You should be working!")
		}
	}
)

// functions to call background use cases
function addSite(siteType: Category) {
	chrome.runtime.sendMessage<TrainingRequest, BackgroundResponse>(
		{ command: "addSite", serialisedSiteData, type: siteType },
		(response: BackgroundResponse) => {
			console.log(`Site addition: ${response}`)
		}
	)
}

function removeSite(siteType: Category) {
	chrome.runtime.sendMessage<TrainingRequest, BackgroundResponse>({
		command: "removeSite",
		serialisedSiteData,
		type: siteType
	}, (response: BackgroundResponse) => {
		console.log(`Site removal: ${response}`)
	})
}

const shadowHost = document.createElement('div')
document.body.insertBefore(shadowHost, document.body.firstChild)
const shadowRoot = shadowHost.attachShadow({ mode: 'open' })
const container = document.createElement('div')
const root = createRoot(container)

shadowRoot.appendChild(container)

root.render(
    <ChakraProvider>
        <TopBar addSite={addSite} removeSite={removeSite} />
    </ChakraProvider>
)
