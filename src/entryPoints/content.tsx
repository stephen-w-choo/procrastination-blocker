// Entry point for doing anything with the page content

import { ChakraProvider } from "@chakra-ui/react"
import createCache, { EmotionCache } from "@emotion/cache"
import React from "react"
import { createRoot, Root } from "react-dom/client"
import { SiteData } from "../data/models/SiteData"
import {
	CheckSiteSeenResponse,
	SiteClassificationResponse,
	SiteDataRequest,
	SiteDataResponse,
} from "../messagePassing/base/MessageTypes"
import { setListener } from "../messagePassing/base/setListener"
import { requestSiteClassificationUseCase } from "../messagePassing/classificationModelUseCases"
import { checkSiteSeenUseCase } from "../messagePassing/repositoryUseCases"
import { TopBar } from "../view/content/TopBar"

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
		this.classifySiteAndRenderTopBar()
	}

	setSiteDataRequestListener() {
		const serialisedSiteData = this.serialisedSiteData
		setListener<SiteDataRequest, SiteDataResponse>((request, _, sendResponse) => {
			if (request.command === "siteDataRequest") {
				sendResponse({ serialisedSiteData })
			}
		})
	}

	classifySiteAndRenderTopBar() {
		requestSiteClassificationUseCase(this.currentSiteData).then(
			siteClassificationData => {
				checkSiteSeenUseCase(this.serialisedSiteData).then(siteSeen => {
					this.conditionallyRenderTopBar(siteClassificationData, siteSeen)
				})
			}
		)
	}

	conditionallyRenderTopBar(
		siteStatus: SiteClassificationResponse,
		siteSeen: CheckSiteSeenResponse
	) {
		console.log("Response from background script:", siteStatus)
		if (siteStatus.success != undefined) {
			if (
				siteStatus.isProcrastinationSite != undefined &&
				siteStatus.isProcrastinationSite > this.THRESHOLD
			) {
				this.renderTopBar(siteStatus, true)
			}
		}
	}

	createShadowDom(): [Root, EmotionCache] {
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

	createNormalDom(): Root {
		const normalHost = document.createElement("div")
		document.body.insertBefore(normalHost, document.body.firstChild)
		const normalRoot = createRoot(normalHost)

		return normalRoot
	}

	renderTopBar(siteStatus: SiteClassificationResponse, shadowDom: Boolean = false) {
		if (shadowDom) {
			// const [root, cache] = createShadowDom()
			const root = this.createNormalDom()

			root.render(
				// <CacheProvider value={cache}>
				<ChakraProvider>
					<TopBar
						siteStatus={siteStatus}
						serialisedSiteData={this.serialisedSiteData}
					/>
				</ChakraProvider>
				// </CacheProvider>
			)
		}
	}
}

const contentProcess = new ContentProcess()
contentProcess.setSiteDataRequestListener()
