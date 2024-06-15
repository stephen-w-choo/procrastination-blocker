// Entry point for doing anything with the page content

import { ChakraProvider } from "@chakra-ui/react"
import createCache, { EmotionCache } from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import React from "react"
import { createRoot, Root } from "react-dom/client"
import { SiteData } from "../data/models/SiteData"
import { checkFocusModeUseCase } from "../messagePassing/backgroundToggleUseCases"
import {
	CheckSiteSeenResponse,
	SiteClassificationResponse,
	SiteDataRequest,
	SiteDataResponse,
} from "../messagePassing/base/MessageTypes"
import { setListener } from "../messagePassing/base/setListener"
import { requestSiteClassificationUseCase } from "../messagePassing/classificationModelUseCases"
import { checkSiteSeenUseCase } from "../messagePassing/repositoryUseCases"
import { ContentView } from "../view/content/ContentView"

class ContentProcess {
	currentSiteData: SiteData
	serialisedSiteData: string
	THRESHOLD = 0.7
	root: Root
	cache: EmotionCache
	pagesSeen: Set<string> = new Set()

	constructor() {
		// Setup data
		this.currentSiteData = {
			title: document.title,
			domain: window.location.href,
		}
		this.serialisedSiteData = JSON.stringify(this.currentSiteData)
		this.pagesSeen.add(this.serialisedSiteData)

		// Setup shadow DOM
		const [root, cache] = this.createShadowDom()
		this.root = root
		this.cache = cache

		// Get the initial state
		this.getFocusModeState()
	}

	// TypeScript is funny - I can't call this method in the constructor without a type error
	setupPageData() {
		this.currentSiteData = {
			title: document.title,
			domain: window.location.href,
		}
		this.serialisedSiteData = JSON.stringify(this.currentSiteData)
		this.pagesSeen.add(this.serialisedSiteData)
	}

	setSiteDataRequestListener() {
		setListener<SiteDataRequest, SiteDataResponse>((request, _, sendResponse) => {
			const serialisedSiteData = this.serialisedSiteData
			if (request.command === "siteDataRequest") {
				sendResponse({ serialisedSiteData })
			}
		})
	}

	getFocusModeState() {
		checkFocusModeUseCase().then(response => {
			if (response.toggleStatus === undefined) return
			if (response.toggleStatus === true) {
				this.classifySiteAndRenderTopBar()
			}
		})
	}

	classifySiteAndRenderTopBar() {
		Promise.all([
			requestSiteClassificationUseCase(this.currentSiteData),
			checkSiteSeenUseCase(this.serialisedSiteData),
		]).then(([siteClassificationData, siteSeen]) => {
			this.renderTopBar(siteClassificationData, siteSeen)
		})
	}

	observeUrlChanges() {
		if ("navigation" in window) {
			//@ts-ignore - navigation API is not yet in the TypeScript lib
			navigation.addEventListener("navigate", event => {
				setTimeout(() => {
					this.setupPageData()
					this.getFocusModeState()
				}, 2000)

				// event.intercept({
				// 	handler: async () => {
				// 		console.log(
				// 			"Intercepted navigation event. Waiting for the new page to load..."
				// 		)

				// 		// // Wait for the new page to load completely
				// 		window.addEventListener(
				// 			"load",
				// 			() => {
				// 				console.log("Page loaded")

				// 		// 		// Reload the page data after the new page has loaded
				// 		// 		this.setupPageData()

				// 		// 		// Reload the focus mode state if the page changes as an SPA and the page hasn't been seen before
				// 		// 		if (!this.pagesSeen.has(this.serialisedSiteData)) {
				// 		// 			this.getFocusModeState()
				// 		// 		}
				// 			},
				// 			{ once: true }
				// 		) // Ensure the event listener is removed after it's triggered once
				// 	},
				// })
			})
		} else {
			console.warn("Navigation API is not supported in this browser.")
		}
	}

	createShadowDom(): [Root, EmotionCache] {
		const shadowHost = document.createElement("div")
		document.body.appendChild(shadowHost)
		const shadowRoot = shadowHost.attachShadow({ mode: "open" })

		const cache = createCache({
			key: "chakra",
			container: shadowRoot,
		})

		const style = document.createElement("style")
		style.textContent = `
		  * {
			font-family: sans-serif;
		  }
		`
		shadowRoot.appendChild(style)
		const root = createRoot(shadowRoot)

		return [root, cache]
	}

	renderTopBar(
		siteStatus: SiteClassificationResponse,
		siteSeen: CheckSiteSeenResponse
	) {
		if (siteStatus.procrastinationScore && siteStatus.trainedOn) {
			// TODO: add a conditional on whether or not to show
			// currently shows in all cases for debugging purposes
			// TODO - turn siteData, siteSeen, and siteStatus into a provider

			console.log("rerendering root")

			this.root.render(
				<CacheProvider value={this.cache}>
					<ChakraProvider>
						<ContentView
							isActive={true}
							siteData={this.currentSiteData}
							siteSeen={siteSeen.seenBefore}
							siteStatus={{
								procrastinationScore: siteStatus.procrastinationScore,
								trainedOn: siteStatus.trainedOn,
							}}
						/>
					</ChakraProvider>
				</CacheProvider>
			)
		}
	}
}

const contentProcess = new ContentProcess()
contentProcess.setSiteDataRequestListener()
contentProcess.observeUrlChanges()
