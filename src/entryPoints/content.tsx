// Entry point for doing anything with the page content

import { ChakraProvider } from "@chakra-ui/react"
import createCache, { EmotionCache } from "@emotion/cache"
import React from "react"
import { createRoot, Root } from "react-dom/client"
import { SiteData } from "../data/models/SiteData"
import {
	SiteDataRequest,
	SiteDataResponse,
	SiteStatusRequest,
	SiteStatusResponse,
} from "../messagePassing/base/MessageTypes"
import { sendMessage } from "../messagePassing/base/sendMessage"
import { TopBar } from "../view/content/TopBar"

const THRESHOLD = 0.7

// Setup data
let currentSiteData: SiteData = {
	title: document.title,
	domain: window.location.href,
}

const serialisedSiteData = JSON.stringify(currentSiteData)

let seenBefore = false

// Sends message to check the siteStatus on startup
sendMessage<SiteStatusRequest, SiteStatusResponse>({
	command: "checkSiteStatus",
	serialisedSiteData,
}).then((response: SiteStatusResponse) => {
	console.log("Response from background script:", response)
	if (response.success && response.seenBefore != undefined) {
		if (
			response.isProcrastinationSite != undefined &&
			response.isProcrastinationSite > THRESHOLD
		) {
		}
		renderTopBar(response, true)
	}
})

// Listener for when popup requests content data
chrome.runtime.onMessage.addListener(
	(
		request: SiteDataRequest,
		_,
		response: (response: SiteDataResponse) => void
	) => {
		if (request.command === "siteDataRequest") {
			response({
				serialisedSiteData,
			})
		}
	}
)

function createShadowDom(): [Root, EmotionCache] {
	const shadowHost = document.createElement("div")
	const shadowRoot = shadowHost.attachShadow({ mode: "open" })
	document.body.insertBefore(shadowHost, document.body.firstChild)
	const cache = createCache({
		key: "css",
		container: shadowRoot,
	})
	const root = createRoot(shadowHost)

	return [root, cache]
}

function createNormalDom(): Root {
	const normalHost = document.createElement("div")
	document.body.insertBefore(normalHost, document.body.firstChild)
	const normalRoot = createRoot(normalHost)

	return normalRoot
}

function renderTopBar(
	siteStatus: SiteStatusResponse,
	shadowDom: Boolean = false
) {
	if (shadowDom) {
		// const [root, cache] = createShadowDom()
		const root = createNormalDom()

		root.render(
			// <CacheProvider value={cache}>
			<ChakraProvider>
				<TopBar
					siteStatus={siteStatus}
					serialisedSiteData={serialisedSiteData}
				/>
			</ChakraProvider>
			// </CacheProvider>
		)
	}
}
