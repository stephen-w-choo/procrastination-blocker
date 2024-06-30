// Entry point for doing anything with the page content

import { ChakraProvider } from "@chakra-ui/react"
import createCache, { EmotionCache } from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import React from "react"
import { createRoot, Root } from "react-dom/client"
import { SiteData } from "../data/models/SiteData"
import { Category } from "../data/models/Category"
import { checkFocusModeUseCase } from "../messagePassing/settingsUseCases"
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
import { calculateOverallScore } from "../domain/models/ProcrastinationScore"
import { ContentViewModelProvider } from "../view/content/ContentContext"

const INVALID_CONTEXT = ["chrome://", "chrome-extension://", "about:"]

class ContentProcess {
	currentSiteData: SiteData
	serialisedSiteData: string
	THRESHOLD = 0.6
	root: Root
	cache: EmotionCache
	pagesSeen: Set<string> = new Set()
	topBarRendered = false

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

	static isValidContext(): boolean {
		const url = window.location.href

		// return false if the URL is undefined or empty
		if (url === "undefined" || "") return false

		// return false if the URL starts with any of the invalid contexts
		return !INVALID_CONTEXT.some(context => url.startsWith(context))
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
				this.THRESHOLD = response.threshold
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

	/**
	 * Observes URL changes and re-renders the top bar - specifically for handling
	 * SPA navigation, where the URL can change without a full page reload
	 */
	observeUrlChanges() {
		if ("navigation" in window) {
			//@ts-ignore - navigation API is not yet in the TypeScript lib
			navigation.addEventListener("navigate", event => {
				setTimeout(() => {
					this.setupPageData()
					setTimeout(() => {
						this.getFocusModeState()
					}, 500)
				}, 1000)
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

	renderTopBarConditional(
		siteStatus: SiteClassificationResponse,
		siteSeen: CheckSiteSeenResponse
	): boolean {
		// If the top bar has already been rendered once (due to SPA behaviour),
		// and we're asked to render it again, we will rerender it to update the content, regardless of the score
		if (this.topBarRendered) return true

		// If the site has been seen before and marked as productive, don't render the top bar
		if (siteSeen.seenBefore === Category.productive) return false

		// If site classification is successful
		if (siteStatus.procrastinationScore && siteStatus.trainedOn) {
			// If the site has been seen before and marked as procrastination, render the top bar
			if (siteSeen.seenBefore === Category.procrastination) {
				return true
			}

			// If the site is uncategorised, and the procrastination score is above the threshold, render the top bar
			if (calculateOverallScore(siteStatus.procrastinationScore) > this.THRESHOLD) {
				return true
			}
		}

		return false
	}

	renderTopBar(
		siteStatus: SiteClassificationResponse,
		siteSeen: CheckSiteSeenResponse
	) {
		if (this.renderTopBarConditional(siteStatus, siteSeen)) {
			this.root.render(
				<CacheProvider value={this.cache}>
					<ChakraProvider>
						<ContentViewModelProvider
							isActive={true}
							rerenderTopBar={() => {
								this.classifySiteAndRenderTopBar()
							}}
							siteData={this.currentSiteData}
							siteSeen={siteSeen.seenBefore}
							siteStatus={{
								// This is already checked in the conditional
								procrastinationScore: siteStatus.procrastinationScore!!,
								trainedOn: siteStatus.trainedOn!!,
							}}
						>
							<ContentView />
						</ContentViewModelProvider>
					</ChakraProvider>
				</CacheProvider>
			)
		}
	}
}

if (ContentProcess.isValidContext()) {
	const contentProcess = new ContentProcess()
	contentProcess.setSiteDataRequestListener()
	contentProcess.observeUrlChanges()
}
