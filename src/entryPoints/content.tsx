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

	constructor() {
		this.currentSiteData = {
			title: document.title,
			domain: window.location.href,
		}
		this.serialisedSiteData = JSON.stringify(this.currentSiteData)
		this.getFocusModeState()
	}

	setSiteDataRequestListener() {
		const serialisedSiteData = this.serialisedSiteData
		setListener<SiteDataRequest, SiteDataResponse>((request, _, sendResponse) => {
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

	createNormalDom(): Root {
		const normalHost = document.createElement("div")
		document.body.insertBefore(normalHost, document.body.firstChild)
		const normalRoot = createRoot(normalHost)

		return normalRoot
	}

	renderTopBar(
		siteStatus: SiteClassificationResponse,
		siteSeen: CheckSiteSeenResponse
	) {
		const [root, cache] = this.createShadowDom()
		if (siteStatus.procrastinationScore && siteStatus.trainedOn) {
			// const root = this.createNormalDom()
			// TODO: add a conditional on whether or not to show
			// currently shows in all cases for debugging purposes
			// TODO - turn siteData, siteSeen, and siteStatus into a provider

			root.render(
				<CacheProvider value={cache}>
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
