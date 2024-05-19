// // Entry point for doing anything with the page content

// import React from "react"
// import { createRoot, Root } from "react-dom/client"
// import { TopBar } from "../view/TopBar"
// import {
// 	BackgroundRequest,
// 	BackgroundResponse,
// 	ContentResponse,
// 	GenericResponse,
// 	RequestContentData,
// 	SendContentData,
// } from "../message_passing/MessageTypes"
// import { Category, SiteData } from "../data/models/SiteData"
// import { ChakraProvider } from "@chakra-ui/react"
// import createCache from "@emotion/cache"
// import { CacheProvider } from "@emotion/react"
// import { sendMessage } from "../message_passing/sendMessage"
// import { classifySiteUseCases } from "../message_passing/classifySiteUseCases"

// const THRESHOLD = 0.7

// // Setup data
// let currentSiteData: SiteData = {
// 	title: document.title,
// 	domain: window.location.href
// }
// const serialisedSiteData = JSON.stringify(currentSiteData)
// let seenBefore = false
// const siteStatus = await sendMessage<BackgroundRequest, BackgroundResponse>(
// 	{ command: "checkSiteStatus", serialisedSiteData }
// )

// // Setup shadow DOM
// const shadowHost = document.createElement('div')
// const shadowRoot = shadowHost.attachShadow({ mode: 'open' })
// document.body.insertBefore(shadowHost, document.body.firstChild)
// const cache = createCache({
// 	key: 'css',
// 	container: shadowRoot,
// })
// const root = createRoot(shadowHost)

// // Normal DOM
// const normalHost = document.createElement('div')
// document.body.insertBefore(normalHost, document.body.firstChild)
// const normalRoot = createRoot(normalHost)

// console.log ("Response from background script:", siteStatus)

// updateUI(siteStatus)

// // Update UI
// function updateUI(siteStatus: BackgroundResponse) {
// 	// sends a message to update the popup UI
// 	if (siteStatus.success && siteStatus.seenBefore) {
// 		sendContentData(seenBefore)
// 	}

// 	// initialise the use cases
// 	let useCases = new classifySiteUseCases(serialisedSiteData)

// 	// if the site is a procrastination site, render the top bar
// 	if (
// 		siteStatus.isProcrastinationSite != undefined &&
// 		siteStatus.isProcrastinationSite > THRESHOLD
// 	) {
// 		renderTopBar(
// 			normalRoot,
// 			useCases.addSite,
// 			useCases.removeSite
// 		)
// 	}
// }

// // Sends message to get the content data on startup
// function sendContentData(seenBefore: boolean) {
// 	chrome.runtime.sendMessage<SendContentData, GenericResponse>(
// 		{
// 			command: "sendContentData",
// 			serialisedSiteData,
// 			seenBefore,
// 		},
// 		(response: GenericResponse) => {
// 			console.log("Response from background script:", response)
// 		}
// 	)
// }

// // Listener for when popup requests content data
// chrome.runtime.onMessage.addListener(
// 	(
// 		request: RequestContentData,
// 		_,
// 		response: (response: ContentResponse) => void
// 	) => {
// 		if (request.command === "requestContentData") {
// 			response({
// 				serialisedSiteData,
// 				seenBefore,
// 			})
// 		}
// 	}
// )

// function renderTopBar(
// 	root: Root,
// 	addSite: (siteType: Category) => void,
// 	removeSite: (siteType: Category) => void
// ) {
// 	root.render(
// 		<CacheProvider	value={cache}>
// 			<ChakraProvider>
// 				<TopBar addSite={addSite} removeSite={removeSite} />
// 			</ChakraProvider>
// 		</CacheProvider>
// 	)
// }
