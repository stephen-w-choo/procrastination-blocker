import { ChakraProvider } from "@chakra-ui/react"
import React from "react"
import { createRoot } from "react-dom/client"
import { SiteData } from "../data/models/SiteData"
import { ModelDataResponse, SiteStatusResponse } from "../messagePassing/base/MessageTypes"
import {
	requestModelDataUseCase,
	requestSiteStatusUseCase,
} from "../messagePassing/requestModelDataUseCases"
import { requestSiteDataUseCase } from "../messagePassing/requestSiteDataUseCases"
import PopUp from "../view/popup/PopUp"

// Setup siteData and modelData
let siteData: SiteData | null
let modelData: ModelDataResponse | null
let siteStatus: SiteStatusResponse | null

// Request current page site data
try {
	let response = await requestSiteDataUseCase()
	siteData = JSON.parse(response.serialisedSiteData) as SiteData
	siteStatus = await requestSiteStatusUseCase(siteData)
} catch (error) {
	siteData = null
	siteStatus = null
}

// Request current model data
try {
	modelData = await requestModelDataUseCase()
} catch (error) {
	modelData = null
}

renderPopUp(siteData)

function renderPopUp(siteData: SiteData | null) {
	const rootElement = document.getElementById("root")

	if (rootElement !== null) {
		const root = createRoot(rootElement)
		root.render(
			<ChakraProvider>
				<PopUp siteData={siteData} seenBefore={false} />
			</ChakraProvider>
		)
	}
}
